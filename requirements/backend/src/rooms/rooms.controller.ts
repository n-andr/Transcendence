/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   rooms.controller.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: nboer <nboer@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/01 17:29:47 by nboer             #+#    #+#             */
/*   Updated: 2026/02/01 18:10:32 by nboer            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { RoomService } from "./rooms.service";


@Controller('rooms')
export class RoomsController {
	constructor(private readonly RoomService: RoomService) {}

	@Get()
	getAllRooms() {
		return this.RoomService.getAllRooms()
	}

	@Get(':id')
	getRoom(@Param('id') id: number) {
		return this.RoomService.getRoom(id)
	}

	@Post(':room')
	createRoom (@Body() data : { roomId: number; maxPlayers: number }) {
		return this.RoomService.createRoom(data.roomId, data.maxPlayers)
	}


}


