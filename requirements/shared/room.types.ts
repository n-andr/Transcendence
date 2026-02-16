export type RoomPhase =
  | "waiting"
  | "starting"
  | "drawing"
  | "guessing"
  | "ended";

export interface RoomTimer {
  startedAt: number; // unix timestamp (ms)
  duration: number; // seconds
}

export interface Prompt {
  text: string;
  round: number;
}

export interface Participant {
  id: number;
  name: string;
  avatarUrl?: string;

  role: "drawer" | "guesser" /*| "spectator"*/;
  status: "connected" | "disconnected"; // guessed correctly 

  score: number;
}

// backend roomstate
export interface RoomState {
  roomId: number;
  phase: RoomPhase;
  round: number;
  turn: number,
  timer: RoomTimer | null;
  prompt: Prompt | null;
  participants: Participant[];
}

//frontend then ADDS 'me' participant
export type RoomViewState = RoomState & {
    me: Participant;
};
