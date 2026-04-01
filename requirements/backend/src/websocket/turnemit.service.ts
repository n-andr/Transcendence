import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Room } from 'src/rooms/room.class';
import { TurnInfoPayload } from './dtos/ws.payloads';
import { WS_EVENTS } from './dtos/ws.events';
import { TURN_DURATION } from './../game/game.constants';

@Injectable()
export class TurnEmitService {
  emitTurnInfo(room: Room, server: Server) {
    for (const p of [...room.players, ...room.spectators]) {
      const isDrawer = p.userId === room.drawer;

      const payload: TurnInfoPayload = {
        room_id: room.id,
        drawer: room.drawer,
        word: isDrawer ? room.word : null,
        word_length: room.word_length,
        round: room.round,
        turn: room.turn,
        players: room.players,
        spectators: room.spectators,
        time_to_display: TURN_DURATION - (Date.now() - (room.turnStartTime?? Date.now())),
		turn_start_time: room.turnStartTime?? Date.now(),
      };

      server.to(`user-${p.userId}`).emit(WS_EVENTS.TURN_INFO, payload);
    }
  }
}
