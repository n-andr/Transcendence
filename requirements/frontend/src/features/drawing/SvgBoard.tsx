// src/features/drawing/SvgBoard.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { pointsToPathD } from "./render";
import type { DrawingState } from "./types";
import { useDrawInput } from "./useDrawInput";
import { onClear, onStrokeEnd, onStrokePoints, onStrokeStart } from "../../api/drawingSocket";

type Props = {
  roomId: number;
  socket: Socket;
  mode: "draw" | "view";
  strokeWidth?: number; // keep fixed in MVP
};

const initialState: DrawingState = { strokes: {}, order: [] };

export default function SvgBoard({ roomId, socket, mode, strokeWidth = 4 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 1, h: 1 });
  const [state, setState] = useState<DrawingState>(initialState);

  // track rendered size
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.max(1, r.width), h: Math.max(1, r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // input (drawer only)
  useDrawInput({ enabled: mode === "draw", socket, roomId, svgRef });

  // listeners (everyone)
  useEffect(() => {
    const off1 = onStrokeStart(socket, (p) => {
      if (p.roomId !== roomId) return;
      setState((prev) => {
        if (prev.strokes[p.strokeId]) return prev;
        return {
          strokes: { ...prev.strokes, [p.strokeId]: { id: p.strokeId, points: [[p.nx, p.ny]] } },
          order: [...prev.order, p.strokeId],
        };
      });
    });

    const off2 = onStrokePoints(socket, (p) => {
      if (p.roomId !== roomId) return;
      setState((prev) => {
        const s = prev.strokes[p.strokeId];
        if (!s) return prev;
        const nextStroke = { ...s, points: [...s.points, ...p.points] };
        return { ...prev, strokes: { ...prev.strokes, [p.strokeId]: nextStroke } };
      });
    });

    const off3 = onStrokeEnd(socket, (p) => {
      if (p.roomId !== roomId) return;
      // MVP: nothing special needed; later you can mark it as "final"
    });

    const off4 = onClear(socket, (p) => {
      if (p.roomId !== roomId) return;
      setState(initialState);
    });

    return () => {
      off1(); off2(); off3(); off4();
    };
  }, [roomId, socket]);

  const paths = useMemo(() => {
    return state.order.map((id) => {
      const stroke = state.strokes[id];
      const d = pointsToPathD(stroke.points, size.w, size.h);
      return { id, d };
    });
  }, [state, size]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        className={mode === "draw" ? "w-full h-full rounded cursor-crosshair" : "w-full h-full rounded"}
      >
        {paths.map((p) => (
          <path
            key={p.id}
            d={p.d}
            fill="none"
            stroke="black"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    </div>
  );
}
