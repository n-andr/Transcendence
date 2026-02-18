// src/features/drawing/protocol.ts
export const DRAWING_EVENTS = {
  STROKE_START: "drawing:strokeStart",
  STROKE_POINTS: "drawing:strokePoints",
  STROKE_END: "drawing:strokeEnd",
  CLEAR: "drawing:clear",
} as const;

export type StrokeId = string;

export type StrokeStartPayload = {
  roomId: number;
  strokeId: StrokeId;
  nx: number; // 0..1
  ny: number; // 0..1
};

export type StrokePointsPayload = {
  roomId: number;
  strokeId: StrokeId;
  points: Array<[number, number]>; // normalized points
};

export type StrokeEndPayload = {
  roomId: number;
  strokeId: StrokeId;
};

export type ClearPayload = {
  roomId: number;
};
