// room.mock.ts
import type { RoomState } from "./room.types";

export const mockRoomState: RoomState = {
  roomId: "mock-room",

  phase: "drawing",
  round: 1,

  timer: {
    startedAt: Date.now(),
    duration: 60,
  },

  prompt: {
    text: "A very confused octopus",
    round: 1,
  },

  participants: [
    {
      id: "1",
      name: "Natalia",
      role: "drawer",
      status: "connected",
      score: 10,
    },
    {
      id: "2",
      name: "Marc",
      role: "guesser",
      status: "connected",
      score: 5,
    },
  ],

  me: {
    id: "1",
    name: "Alice",
    role: "drawer",
    status: "connected",
    score: 10,
  },
};

