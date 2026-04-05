//import { resolve } from "path";
import { io, Socket } from "socket.io-client";
import type { PlayerDto } from "../../shared/player.dto";
import { WS_EVENTS } from "../../shared/ws.events";
import type { ResultsPayload, TurnInfoPayload, FriendListPayload, RemoveFriendPayload, AddFriendPayload } from "../../shared/ws.payloads";
import { useSessionStore } from "../state/sessionStore";

const WS_URL = import.meta.env.VITE_WS_URL ?? window.location.origin;//"http://localhost:3000";

//const WS_URL =
//  import.meta.env.VITE_WS_URL ??
//  `http://${window.location.hostname}:3000`;

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
		console.log("[wss] connected:", socket.id);
		});// server will emit "pleaseIdentify" right after connect

		socket.on("disconnect", (reason) => {
		console.log("[wss] disconnected:", reason);
		identifyInFlight = null; // allow re-identify after reconnect
		});
	}

    if (!socket.connected) {
        console.log("[wss] initiating connection...");
        socket.connect();
    }

    if (!identifyInFlight) {
        identifyInFlight = new Promise<void>((resolve) => {
            socket.once("pleaseIdentify", () => {
            console.log("[wss] pleaseIdentify received -> sending identify", userId);
            socket.emit("identify", { userId });
            });

            socket.once("identified", () => {
            console.log("[wss] identified OK - promise resolved");
            resolve();
            });

			// debug delete later
			// socket.on("youAre", (payload) => {
			// console.log("[wss] youAre:", payload);
			// });
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
  console.log("[wss] joinRoom() called with userId:", userId);
  await initSocketWithIdentify(userId);
  console.log("[wss] identified, now emitting joinRoom...");
  socket.emit(WS_EVENTS.JOIN_ROOM, { user_id: userId });
}

export async function watchGame(userId: number) {
  console.log("[wss] watchGame() called with userId:", userId);
  await initSocketWithIdentify(userId);
  console.log("[wss] identified, now emitting watchGame...");
  socket.emit(WS_EVENTS.WATCH_GAME, { user_id: userId });
}

//Client -> Server: "joinRoom" + userId
// export async function joinRoom(userId: number) {
// 	await initSocketWithIdentify(userId);

// 	socket.emit("joinRoom", {userId}, (ack?: {ok :boolean; message?: string}) => {
// 		if (ack) console.log("[wss] joinRoom ack:", ack);
// 	});
// }

// Helper to subscribe/unsubscribe cleanly from BE events.
// export function onRoomState(callback: (payload: RoomStatePayload) => void) {
//   console.log("[wss] subscribing to roomState");
//   socket.on(WS_EVENTS.ROOM_STATE, callback);
//   return () => socket.off(WS_EVENTS.ROOM_STATE, callback);
// }

export function onTurnInfo(callback: (payload: TurnInfoPayload) => void) {
  console.log("[wss] subscribing to turn_info");
  const handler = (payload: TurnInfoPayload) => {
    console.log("[wss] turn_info received:", payload);

    // Read userId from store at MESSAGE ARRIVAL TIME
    const currentUserId = useSessionStore.getState().user?.id;
    useSessionStore.getState().setRoom(payload.room_id); // update roomId in store on every turn_info, so it's always correct for other handlers that might need it
    if (currentUserId === undefined) {
      console.warn("[wss] userId not set in store yet");
      callback(payload);
      return;
    }

    if (payload.drawer === currentUserId) {
      console.log("[wss] I am the drawer this turn!");
      useSessionStore.getState().setRole("drawer");
    } else {
      console.log("[wss] I am a guesser this turn. i am user " + currentUserId + " drawer is " + payload.drawer);
      useSessionStore.getState().setRole("guesser");
    }

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

// export function onDrawing(callback: (payload: any) => void) {
//   socket.on(WS_EVENTS.DRAWING, callback);
//   return () => socket.off(WS_EVENTS.DRAWING, callback);
// }

export function friendList(callback: (payload: FriendListPayload) => void) {
  socket.on(WS_EVENTS.FRIEND_LIST, callback);
  console.log("[wss] subscribed to friendList updates");
  return () => socket.off(WS_EVENTS.FRIEND_LIST, callback);
}

//export function addFriend(callback: (payload: AddFriendPayload) => void) {
//   socket.on(WS_EVENTS.ADD_FRIEND, callback);
//   return () => socket.off(WS_EVENTS.ADD_FRIEND, callback);
// }

// export function removeFriend(callback: (payload: RemoveFriendPayload) => void) {
//   socket.on(WS_EVENTS.REMOVE_FRIEND, callback);
//   return () => socket.off(WS_EVENTS.REMOVE_FRIEND, callback);
// }

export function emitAddFriend(payload: AddFriendPayload) {
	console.log("[wss] emitAddFriend called with payload:", payload);
  socket.emit(WS_EVENTS.ADD_FRIEND, payload);
}

export function emitRemoveFriend(payload: RemoveFriendPayload) {
	console.log("[wss] emitRemoveFriend called with payload:", payload);
  socket.emit(WS_EVENTS.REMOVE_FRIEND, payload);
}



//remove later
export function testSetDrawer(roomId: number, drawerId: number) {
  console.log("[wss] test:setDrawer - room:", roomId, "drawer:", drawerId);
  socket.emit('test:setDrawer', { room_id: roomId, drawer_id: drawerId });
}
//window.testSetDrawer(0, 1); // in console! to set user 1 as drawer in room 0 for testing
// Expose for console testing
if (import.meta.env.DEV) {
  (window as any).testSetDrawer = testSetDrawer;
}
