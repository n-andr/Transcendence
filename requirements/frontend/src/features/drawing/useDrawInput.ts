// src/features/drawing/useDrawInput.ts
import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import { emitStrokeEnd, emitStrokePoints, emitStrokeStart } from "../../api/drawingSocket";

function makeStrokeId() {
  return `s-${crypto.randomUUID?.() ?? String(Date.now())}`;
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function useDrawInput(opts: {
  enabled: boolean;
  socket: Socket;
  roomId: number;
  svgRef: React.RefObject<SVGSVGElement>;
}) {
  const { enabled, socket, roomId, svgRef } = opts;

  const isDownRef = useRef(false);
  const strokeIdRef = useRef<string | null>(null);

  const bufferRef = useRef<Array<[number, number]>>([]);
  const flushTimerRef = useRef<number | null>(null);

  function getNormalizedPoint(ev: PointerEvent): [number, number] | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;

    const nx = clamp01((ev.clientX - rect.left) / rect.width);
    const ny = clamp01((ev.clientY - rect.top) / rect.height);
    return [nx, ny];
  }

  function flush() {
    const strokeId = strokeIdRef.current;
    if (!strokeId) return;
    const points = bufferRef.current;
    if (points.length === 0) return;

    emitStrokePoints(socket, { roomId, strokeId, points: points.splice(0) });
  }

  useEffect(() => {
    if (!enabled) return;

    const svg = svgRef.current;
    if (!svg) return;

    function scheduleFlush() {
      if (flushTimerRef.current != null) return;
      flushTimerRef.current = window.setTimeout(() => {
        flushTimerRef.current = null;
        flush();
      }, 25); // ~40 msgs/sec max (adjust 16..50ms)
    }

    function onPointerDown(ev: PointerEvent) {
      if (ev.button !== 0) return;
      const p = getNormalizedPoint(ev);
      if (!p) return;

      svg.setPointerCapture(ev.pointerId);

      isDownRef.current = true;
      const strokeId = makeStrokeId();
      strokeIdRef.current = strokeId;

      emitStrokeStart(socket, { roomId, strokeId, nx: p[0], ny: p[1] });
      bufferRef.current.push(p);
      scheduleFlush();
    }

    function onPointerMove(ev: PointerEvent) {
      if (!isDownRef.current) return;
      const p = getNormalizedPoint(ev);
      if (!p) return;
      bufferRef.current.push(p);
      scheduleFlush();
    }

    function endStroke() {
      if (!isDownRef.current) return;
      isDownRef.current = false;

      flush(); // send remaining points
      const strokeId = strokeIdRef.current;
      if (strokeId) emitStrokeEnd(socket, { roomId, strokeId });
      strokeIdRef.current = null;
    }

    function onPointerUp() {
      endStroke();
    }
    function onPointerCancel() {
      endStroke();
    }

    svg.addEventListener("pointerdown", onPointerDown);
    svg.addEventListener("pointermove", onPointerMove);
    svg.addEventListener("pointerup", onPointerUp);
    svg.addEventListener("pointercancel", onPointerCancel);

    return () => {
      svg.removeEventListener("pointerdown", onPointerDown);
      svg.removeEventListener("pointermove", onPointerMove);
      svg.removeEventListener("pointerup", onPointerUp);
      svg.removeEventListener("pointercancel", onPointerCancel);
      if (flushTimerRef.current != null) window.clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
    };
  }, [enabled, roomId, socket, svgRef]);
}
