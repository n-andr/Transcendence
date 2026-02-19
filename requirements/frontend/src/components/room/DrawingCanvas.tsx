import { useEffect, useRef, useState } from "react";
import { socket } from "../../api/socket";

export type Point = { x: number; y: number };
export type Stroke = { id: string; color: string; width: number; points: Point[] };

function drawStroke(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  stroke: Stroke
) {
  const pts = stroke.points;
  if (pts.length < 2) return;

  // We draw in CSS pixels (because we setTransform(dpr,0,0,dpr,0,0))
  const rect = canvas.getBoundingClientRect();

  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(pts[0].x * rect.width, pts[0].y * rect.height);

  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x * rect.width, pts[i].y * rect.height);
  }
  ctx.stroke();
}

function redrawAll(canvas: HTMLCanvasElement, strokes: Stroke[]) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear in CSS pixels (transform makes 1 unit = 1 CSS pixel)
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);

  for (const s of strokes) drawStroke(ctx, canvas, s);
}

function pointFromPointerEvent(
  canvas: HTMLCanvasElement,
  e: React.PointerEvent<HTMLCanvasElement>
): Point {
  const rect = canvas.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;

  return {
    x: rect.width ? px / rect.width : 0,
    y: rect.height ? py / rect.height : 0,
  };
}

type Props = {
  isDrawer: boolean;
  color?: string;
  strokeWidth?: number; // optional for later
};

export function DrawingCanvas({ isDrawer, color = "#111", strokeWidth = 4 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const strokesRef = useRef<Stroke[]>([]);
  const activeStrokeIdRef = useRef<string | null>(null);

  // batching points for network
  const pendingPointsRef = useRef<Point[]>([]);
  const rafFlushRef = useRef<number | null>(null);

  // keep ref in sync for resize redraw
  useEffect(() => {
    strokesRef.current = strokes;
    const canvas = canvasRef.current;
    if (!canvas) return;
    redrawAll(canvas, strokes);
  }, [strokes]);

  // Resize to match CSS size + DPR (once + on resize)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // physical buffer size
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));

      // draw in CSS pixels
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      redrawAll(canvas, strokesRef.current);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ---- socket listeners (receive drawing from server) ----
  useEffect(() => {
    const onInit = (payload: { strokes: Stroke[] }) => setStrokes(payload.strokes);

    const onStart = (stroke: Stroke) => {
      setStrokes((prev) => [...prev, stroke]);
    };

    const onAppend = (payload: { id: string; points: Point[] }) => {
      setStrokes((prev) =>
        prev.map((s) =>
          s.id === payload.id ? { ...s, points: [...s.points, ...payload.points] } : s
        )
      );
    };

    const onClear = () => setStrokes([]);

    const onUndo = (payload: { removedId?: string }) => {
      if (payload?.removedId) {
        setStrokes((prev) => prev.filter((s) => s.id !== payload.removedId));
      }
    };

    socket.on("init_drawing", onInit);
    socket.on("stroke:start", onStart);
    socket.on("stroke:append", onAppend);
    socket.on("canvas:clear", onClear);
    socket.on("canvas:undo", onUndo);

    return () => {
      socket.off("init_drawing", onInit);
      socket.off("stroke:start", onStart);
      socket.off("stroke:append", onAppend);
      socket.off("canvas:clear", onClear);
      socket.off("canvas:undo", onUndo);
    };
  }, []);


  function flushPendingPoints() {
    rafFlushRef.current = null;

    const id = activeStrokeIdRef.current;
    if (!id) return;

    const pts = pendingPointsRef.current;
    if (pts.length === 0) return;

    pendingPointsRef.current = [];
    socket.emit("stroke:append", { id, points: pts });
  }

  function scheduleFlush() {
    if (rafFlushRef.current != null) return;
    rafFlushRef.current = window.requestAnimationFrame(flushPendingPoints);
  }

  // ---- pointer handlers (only if drawer) ----
  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);

    const id = crypto.randomUUID();
    activeStrokeIdRef.current = id;

    const p = pointFromPointerEvent(canvas, e);
    const stroke: Stroke = { id, color, width: strokeWidth, points: [p] };

    // local immediate
    setStrokes((prev) => [...prev, stroke]);

    // network
    socket.emit("stroke:start", stroke);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const id = activeStrokeIdRef.current;
    if (!id) return;

    const p = pointFromPointerEvent(canvas, e);

    // local immediate
    setStrokes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, points: [...s.points, p] } : s))
    );

    // network batched
    pendingPointsRef.current.push(p);
    scheduleFlush();
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    flushPendingPoints();
    activeStrokeIdRef.current = null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded cursor-crosshair touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    />
  );
}
