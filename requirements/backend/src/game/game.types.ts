export type Player = {
    id: number;
    name: string;
    score: number;
}

export type GameState = {
    roomID: number;
    isFinished: boolean;

    players: Map<number, Player>; // key: user id
    prompt: string;

    round: number;
    totalRounds: number;

    turn: number;
    turnsPerRound: number;

    guessedCorrectly: Set<number>;
}
