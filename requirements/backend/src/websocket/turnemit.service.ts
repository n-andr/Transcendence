import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Room } from 'src/rooms/room.class';
import { TurnInfoPayload } from './dtos/ws.payloads';
import { WS_EVENTS } from './dtos/ws.events';
import { TURN_DURATION } from './../game/game.constants';

@Injectable()
export class TurnEmitService {
  emitTurnInfo(room: Room, server: Server, timeToDisplay?: number) {
    const payload: TurnInfoPayload = {
      room_id: room.id,
      drawer: room.drawer,
      word: room.drawer === room.drawer ? room.word : null,
      word_length: room.word_length,
      round: room.round,
      turn: room.turn,
      players: room.players,
      spectators: room.spectators,
      time_to_display: timeToDisplay ?? TURN_DURATION,
    };
    server.to(`room-${room.id}`).emit(WS_EVENTS.TURN_INFO, payload);
    return payload;
  }
}