// drawing:strokeStart
// drawing:strokePoints
// drawing:strokeEnd
// drawing:clear


// emitStrokeStart(roomId, payload)
// emitStrokePoints(roomId, payload)
// onStrokeStart(cb), onStrokePoints(cb), …




// src/api/socket/drawingSocket.ts
import type { Socket } from "socket.io-client";
import {
  DRAWING_EVENTS,
  type StrokeStartPayload,
  type StrokePointsPayload,
  type StrokeEndPayload,
  type ClearPayload,
} from "../features/drawing/protocol";

export function emitStrokeStart(socket: Socket, payload: StrokeStartPayload) {
  socket.emit(DRAWING_EVENTS.STROKE_START, payload);
}

export function emitStrokePoints(socket: Socket, payload: StrokePointsPayload) {
  socket.emit(DRAWING_EVENTS.STROKE_POINTS, payload);
}

export function emitStrokeEnd(socket: Socket, payload: StrokeEndPayload) {
  socket.emit(DRAWING_EVENTS.STROKE_END, payload);
}

export function emitClear(socket: Socket, payload: ClearPayload) {
  socket.emit(DRAWING_EVENTS.CLEAR, payload);
}

export function onStrokeStart(socket: Socket, cb: (p: StrokeStartPayload) => void) {
  socket.on(DRAWING_EVENTS.STROKE_START, cb);
  return () => socket.off(DRAWING_EVENTS.STROKE_START, cb);
}

export function onStrokePoints(socket: Socket, cb: (p: StrokePointsPayload) => void) {
  socket.on(DRAWING_EVENTS.STROKE_POINTS, cb);
  return () => socket.off(DRAWING_EVENTS.STROKE_POINTS, cb);
}

export function onStrokeEnd(socket: Socket, cb: (p: StrokeEndPayload) => void) {
  socket.on(DRAWING_EVENTS.STROKE_END, cb);
  return () => socket.off(DRAWING_EVENTS.STROKE_END, cb);
}

export function onClear(socket: Socket, cb: (p: ClearPayload) => void) {
  socket.on(DRAWING_EVENTS.CLEAR, cb);
  return () => socket.off(DRAWING_EVENTS.CLEAR, cb);
}
