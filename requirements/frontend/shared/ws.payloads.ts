<<<<<<< HEAD
import type { PlayerDto } from "./player.dto";
=======
import { PlayerDto } from "./player.dto";
>>>>>>> origin/drawing

export interface JoinRoomPayload {
	user_id: number;
}

<<<<<<< HEAD
=======
/*
room_id = -1 -> no room. You have been send a dummy to fulfill the payload type.
example: if you receive this after joinRoom, there was no availbale room. 
*/
>>>>>>> origin/drawing
export interface TurnInfoPayload {
	room_id: number;
	drawer: number;
	word: string | null;
	word_length: number;
	round: number;
	turn: number;
	players: PlayerDto[];
<<<<<<< HEAD
=======
	time_to_display: number;
>>>>>>> origin/drawing
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

<<<<<<< HEAD
export interface DrawingPayload {
	room_id: number;
	drawer: Number;
	coordinate_x: number;
	coordinate_y: number;
=======
export type Point = { x: number; y: number };
export type Stroke = { id: string; color: string; width: number; points: Point[] };

export interface DrawPayload {
	room_id: number;
	drawer: Number;
	width: number;
	strokes: Stroke[];
>>>>>>> origin/drawing
	color: `#${string}`// e.g. "#ff00ff"
}