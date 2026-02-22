import { PlayerDto } from "./player.dto";

export interface JoinRoomPayload {
	user_id: number;
}

export interface TurnInfoPayload {
	roomd_id: number;
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
	roomd_id: number;
}

export interface GuessUpdatePayload {
	guesser_id: number;
	guess: string | null;
	roomd_id: number;
	score: number;
	correct: boolean;
}

export interface ResultsPayload {
	final: boolean;
	solution: string;
	time_to_display: number;
}
export type Point = { x: number; y: number };
export type Stroke = { id: string; color: string; width: number; points: Point[] };

export interface DrawPayload {
	room_id: number;
	drawer: Number;
	width: number;
	strokes: Stroke[];
	color: `#${string}`// e.g. "#ff00ff"
}