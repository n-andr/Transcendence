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
  id: string;
  name: string;
  avatarUrl?: string;

  role: "drawer" | "guesser" | "spectator";
  status: "connected" | "disconnected";

  score: number;
}

export interface RoomState {
  roomId: string;

  phase: RoomPhase;
  round: number;

  timer: RoomTimer | null;
  prompt: Prompt | null;

  participants: Participant[];

  me: Participant;
}
