import { PlayerDto } from "./player.dto";

export interface JoinRoomPayload {
	user_id: number;
}

export interface WatchGamePayload {
	user_id: number;
}

export interface TurnInfoPayload {
	room_id: number;
	drawer: number;
	word: string | null;
	word_length: number;
	round: number;
	turn: number;
	players: PlayerDto[];
}

export interface GuessPayload {
	guesser_id: number;
	guess: string;
	room_id: number;
}

export interface GuessUpdatePayload {
	guesser_id: number;
	guess: string | null;
	room_id: number;
	score: number;
	correct: boolean;
}

export interface ResultsPayload {
	final: boolean;
	solution: string;
	time_to_display: number;
}

export interface FriendListPayload {
	room_id: number;
	friends: string[];
}

export interface AddFriendPayload {
	room_id: number;
	newFriend: string;
	player: number;
}

export interface RemoveFriendPayload {
	room_id: number;
	removeFriend: string;
	player: number;
}

export interface ProfilePagePayload {
	id: number;
	nickname: string;
	email: string;
	friends: string[];
}

export interface DrawingPayload {
	room_id: number;
	friends: string[];
}

export type Point = { x: number; y: number };
export type Stroke = {
  id: string;
  width: number;
  color: `#${string}`;
  points: Point[];
};

// Normalized point in range [0..1]
// Used for STROKE_START (full stroke info).
export interface DrawPayload {
  room_id: number;
  drawer: number;
  strokes: Stroke[];
}

export interface InitDrawingPayload {
  room_id: number;
  strokes: Stroke[];
}

// Low-load append: send ONLY delta points + stroke id.
export interface StrokeAppendPayload {
  room_id: number;
  id: string;
  points: Point[];
  // optional for debugging / future ordering guarantees:
  // seq?: number;
}
