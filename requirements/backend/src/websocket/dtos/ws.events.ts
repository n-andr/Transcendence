export const WS_EVENTS = {
	JOIN_ROOM: "joinRoom",
	ROOM_STATE: "roomState",
	GUESS: "guess",
	GUESS_UPDATE: "guessUpdate",
	RESULTS: "results",
	TURN_INFO: "turnInfo",
	DRAWING: "drawing",
	ROOM_FULL: "roomFull"
} as const;

export type WSEvent = typeof WS_EVENTS[keyof typeof WS_EVENTS]

/*USAGE
socker.emit(WS_EVENTS.MACRO_NAME, payload);
*/