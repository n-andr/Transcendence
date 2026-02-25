//import { resolve } from "path";
import { io, Socket } from "socket.io-client";
import { useSessionStore } from "../state/sessionStore";
import { WS_EVENTS } from "../../shared/ws.events"; //change to shared folder

const WS_URL = import.meta.env.VITE_WS_URL ?? "http://localhost:3000";

export type Player = {
  Nickname: string;
  User_ID: number;
  Score: number;
};

export type RoomStatePayload = {
  members: Player[];
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

	if (!socket.connected) socket.connect();

	if (!identifyInFlight) {
		identifyInFlight = new Promise<void>((resolve) => {
			socket.once("pleaseIdentify", () => {
			console.log("[ws] pleaseIdentify -> sending identify", userId);
			socket.emit("identify", { userId });
			});

			socket.once("identified", () => {
			console.log("[ws] identified OK");
			resolve();
			});

			// debug delete later
			// socket.on("youAre", (payload) => {
			// console.log("[ws] youAre:", payload);
			// });
		});
	}
  return identifyInFlight;
}

// ack - acknowledgment callbacks
//Socket.IO (Application Layer): Supports acknowledgment callbacks in emit functions, where the final argument is a function executed upon receipt.

//Client -> Server: "play" + userId
export async function play(userId: number) {
	await initSocketWithIdentify(userId);

	socket.emit("play", {userId}, (ack?: {ok :boolean; message?: string}) => {
		if (ack) console.log("[ws] play ack:", ack);
	});
}


// Helper to subscribe/unsubscribe cleanly from BE events.
export function onRoomState(callback: (payload: RoomStatePayload) => void) {
  socket.on("room_state", callback);
  return () => socket.off("room_state", callback);
}

export function onStartGame(callback: (payload: RoomStatePayload) => void) {
  socket.on("start_game", callback);
  return () => socket.off("start_game", callback);
}