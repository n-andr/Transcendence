//import { resolve } from "path";
import { io, Socket } from "socket.io-client";
import type { PlayerDto } from "../../shared/player.dto";
import { WS_EVENTS } from "../../shared/ws.events";
import type { ResultsPayload, TurnInfoPayload } from "../../shared/ws.payloads";
import { useSessionStore } from "../state/sessionStore";

const WS_URL = import.meta.env.VITE_WS_URL ?? "http://localhost:3000";

export type RoomStatePayload = {
  members: PlayerDto[];
  round: number; // -1 in waiting, 1+ when game starts
  turn: number;  // -1 in waiting, 1+ when game starts
};

export const socket: Socket = io(WS_URL, {
  withCredentials: true,
  transports: ["websocket"], 
  autoConnect: false,        // we decide when to connect
});

let listenersBound = false;
let identifyInFlight: Promise<void> | null = null;

export function initSocketWithIdentify(userId: number): Promise<void> {
  	if (!listenersBound) {
		listenersBound = true;

		socket.on("connect", () => {
		console.log("[ws] connected:", socket.id);
		});// server will emit "pleaseIdentify" right after connect

		socket.on("disconnect", (reason) => {
		console.log("[ws] disconnected:", reason);
		identifyInFlight = null; // allow re-identify after reconnect
		});
	}

    if (!socket.connected) {
        console.log("[ws] initiating connection...");
        socket.connect();
    }

    if (!identifyInFlight) {
        identifyInFlight = new Promise<void>((resolve) => {
            socket.once("pleaseIdentify", () => {
            console.log("[ws] pleaseIdentify received -> sending identify", userId);
            socket.emit("identify", { userId });
            });

            socket.once("identified", () => {
            console.log("[ws] identified OK - promise resolved");
            resolve();
            });

			// debug delete later
			socket.on("youAre", (payload) => {
			console.log("[ws] youAre:", payload);
			});
		});
	}
  return identifyInFlight;
}

// ack - acknowledgment callbacks
// Socket.IO (Application Layer): Supports acknowledgment callbacks in emit functions, where the final argument is a function executed upon receipt.

export function onStartGame(callback: (payload: RoomStatePayload) => void) {
  socket.on("start_game", callback);
  return () => socket.off("start_game", callback);
}

export async function joinRoom(userId: number) {
  console.log("[ws] joinRoom() called with userId:", userId);
  await initSocketWithIdentify(userId);
  console.log("[ws] identified, now emitting joinRoom...");
  socket.emit(WS_EVENTS.JOIN_ROOM, { user_id: userId });
}

//Client -> Server: "joinRoom" + userId
// export async function joinRoom(userId: number) {
// 	await initSocketWithIdentify(userId);

// 	socket.emit("joinRoom", {userId}, (ack?: {ok :boolean; message?: string}) => {
// 		if (ack) console.log("[ws] joinRoom ack:", ack);
// 	});
// }

// Helper to subscribe/unsubscribe cleanly from BE events.
// export function onRoomState(callback: (payload: RoomStatePayload) => void) {
//   console.log("[ws] subscribing to roomState");
//   socket.on(WS_EVENTS.ROOM_STATE, callback);
//   return () => socket.off(WS_EVENTS.ROOM_STATE, callback);
// }

export function onTurnInfo(callback: (payload: TurnInfoPayload) => void) {
  console.log("[ws] subscribing to turn_info");
  // use a stored handler here so we can unsubscribe using the exact same input 
  const handler = (payload: TurnInfoPayload) => {
    console.log("[ws] turn_info received:", payload);
    callback(payload);
  };
  socket.on(WS_EVENTS.TURN_INFO, handler);
  return () => socket.off(WS_EVENTS.TURN_INFO, handler);
}

export function onRoomFull(callback: () => void) {
  socket.on(WS_EVENTS.ROOM_FULL, callback);
  return () => socket.off(WS_EVENTS.ROOM_FULL, callback);
}

export function onGuess(callback: (payload: any) => void) {
  socket.on(WS_EVENTS.GUESS, callback);
  return () => socket.off(WS_EVENTS.GUESS, callback);
}

export function onGuessUpdate(callback: (payload: any) => void) {
  socket.on(WS_EVENTS.GUESS_UPDATE, callback);
  return () => socket.off(WS_EVENTS.GUESS_UPDATE, callback);
}

export function onResults(callback: (payload: ResultsPayload) => void) {
  socket.on(WS_EVENTS.RESULTS, callback);
  return () => socket.off(WS_EVENTS.RESULTS, callback);
}

export function onDrawing(callback: (payload: any) => void) {
  socket.on(WS_EVENTS.DRAWING, callback);
  return () => socket.off(WS_EVENTS.DRAWING, callback);
}