/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.module.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lieselotdetaeye <lieselotdetaeye@studen    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/14 16:17:58 by lde-taey          #+#    #+#             */
/*   Updated: 2026/02/09 11:40:14 by lieselotdet      ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { DatabaseModule } from './database/database.module';
import { WebsocketModule } from './websocket/websocket.module';
import { TmpModule } from './tmp/tp.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomsController } from './rooms/rooms.controller';
import { GameModule } from './game/game.module';

@Module
({
  imports: [AuthModule,
	UsersModule,
	DatabaseModule,
	WebsocketModule,
	TmpModule,
  RoomsModule,
  GameModule],
    //ConfigModule,//would need to be installe seperately
    //DatabaseModule,
    //UsersModule,
  controllers: [AuthController, UsersController, RoomsController]

})
export class AppModule {}
