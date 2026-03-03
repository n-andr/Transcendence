export const WS_EVENTS = {
	JOIN_ROOM: "joinRoom",
	//ROOM_STATE: "roomState",
	GUESS: "guess",
	GUESS_UPDATE: "guessUpdate",
	RESULTS: "results",
	TURN_INFO: "turnInfo",
	INIT_DRAWING: "init_drawing",
	STROKE_START: "stroke:start",
	STROKE_APPEND: "stroke:append",
	CANVAS_CLEAR: "canvas:clear",
	CANVAS_UNDO: "canvas:undo",
	ROOM_FULL: "roomFull",
	FRIEND_LIST: "friendList",
	ADD_FRIEND: "addFriend",
	REMOVE_FRIEND: "removeFriend",
} as const;

export type WSEvent = typeof WS_EVENTS[keyof typeof WS_EVENTS]

/*USAGE
socker.emit(WS_EVENTS.MACRO_NAME, payload);
*/
