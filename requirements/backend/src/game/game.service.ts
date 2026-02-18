import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameState } from './game.types';

@Injectable()
export class GameService {
    constructor(private readonly events: EventEmitter2) {}
    private readonly games = new Map<number, GameState>();

    getGameState(roomID: number): GameState {
        const game = this.require(roomID);
        return game;
    }

    addCorrectPlayer(roomID: number, playerID: number) {
        const game = this.require(roomID);
        game.guessedCorrectly.add(playerID);
    }

    setPrompt(roomID: number, prompt: string) {
        const game = this.require(roomID);
        game.prompt = prompt;
    }

    advanceTurn(roomID: number) {
        const game = this.require(roomID);
        game.guessedCorrectly.clear();

        const isLastTurn = game.turn >= game.turnsPerRound;
        const isLastRound = game.round >= game.totalRounds;

        if (isLastTurn && isLastRound) {
            game.isFinished = true;
            return { finished: true };
        }

        if (isLastTurn) {
            game.round += 1;
            game.turn = 1;
        } else {
            game.turn += 1;
        }

        return { finished: false };
    }

    buildFinalPayload(roomID: number) {
        const game = this.require(roomID);

        return {
            final: true,
            player_list: Array.from(game.players.values()),
            solution: game.prompt,
        };
    }

    buildSemiFinalPayload(roomID: number) {
        const game = this.require(roomID);

        return {
            final: false,
            player_list: Array.from(game.players.values()),
            solution: game.prompt,
            time_to_display: 10,
        };
    }

    buildTurnInfo(roomID: number) {
        const game = this.require(roomID);

        const prompt = this.generateWord();

        return {
            Drawer: this.getNextDrawer(roomID),
            Word: prompt,
            Word_length: prompt.length,
            Round: game.round,
            Turn: game.turn,
            Player_list: Array.from(game.players.values()),
            Room_id: roomID,
        };
    }

    generateWord(): string {

        // build random word generator here !!!
        return 'TEST';
    }

    getNextDrawer(roomID: number) {
        const game = this.require(roomID);

        const drawer = game.players[game.turn - 1];
        return drawer;
    }

    endAndCleanup(roomID: number) {
        this.games.delete(roomID);
    }

    // Call this when the last turn ends (timer hits 0, or drawer submits end, etc.)
    endTurnAndMaybeGame(roomID: number) {
        const result = this.advanceTurn(roomID);

        if (result.finished) {
            const payload = this.buildFinalPayload(roomID);

            this.events.emit('trigger_results', { roomID, payload });

            // optional: cleanup after a short delay, or immediately if you’re done
            this.endAndCleanup(roomID);
        } else {
            const payload = this.buildSemiFinalPayload(roomID);

            this.events.emit('trigger_results', { roomID, payload });

            const turn_info = this.buildTurnInfo(roomID);

            setTimeout(() => {
                this.events.emit('start_turn', { roomID, turn_info });
            }, 10000);
        }
    }

    private require(roomId: number) {
        const game = this.games.get(roomId);
        if (!game) throw new Error(`No game for roomId=${roomId}`);
        return game;
    }


}
