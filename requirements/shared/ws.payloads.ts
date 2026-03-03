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

export interface DrawingPayload {
	room_id: number;
	drawer: Number;
	coordinate_x: number;
	coordinate_y: number;
	color: `#${string}`// e.g. "#ff00ff"
}
