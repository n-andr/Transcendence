import { io, Socket } from "socket.io-client";

const WS_URL = import.meta.env.VITE_WS_URL ?? "http://localhost:3000";

export const socket: Socket = io(WS_URL, {
  withCredentials: true,
  transports: ["websocket"], 
  autoConnect: false,        // we decide when to connect
});

let listenersBound = false;


export function initSocketWithIdentify(userId: number) {
  if (!listenersBound) {
    listenersBound = true;

    socket.on("connect", () => {
      console.log("[ws] connected:", socket.id);
      // server will emit "pleaseIdentify" right after connect
    });

    socket.on("disconnect", (reason) => {
      console.log("[ws] disconnected:", reason);
    });

    socket.on("pleaseIdentify", () => {
      console.log("[ws] pleaseIdentify -> sending identify", userId);
      socket.emit("identify", { userId });
    });

    socket.on("identified", () => {
      console.log("[ws] identified OK");
    });

    // debug
    socket.on("youAre", (payload) => {
      console.log("[ws] youAre:", payload);
    });
  }

  if (!socket.connected) {
    socket.connect();
  }
}