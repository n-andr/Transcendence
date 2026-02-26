<<<<<<< HEAD
=======
//copy from Server

>>>>>>> origin/drawing
export const WS_EVENTS = {
	JOIN_ROOM: "joinRoom",
	ROOM_STATE: "roomState",
	GUESS: "guess",
	GUESS_UPDATE: "guessUpdate",
	RESULTS: "results",
<<<<<<< HEAD
	ROOM_FULL: "roomFull",
	TURN_INFO: "turnInfo",
	DRAWING: "drawing"
=======
	TURN_INFO: "turnInfo",
	INIT_DRAWING: "init_drawing",
	STROKE_START: "stroke:start",
	STROKE_APPEND: "stroke:append",
  	CANVAS_CLEAR: "canvas:clear",
  	CANVAS_UNDO: "canvas:undo",
	ROOM_FULL: "roomFull"
>>>>>>> origin/drawing
} as const;

export type WSEvent = typeof WS_EVENTS[keyof typeof WS_EVENTS]

/*USAGE
socker.emit(WS_EVENTS.MACRO_NAME, payload);
*/