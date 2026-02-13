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
import { RoomsService } from "./rooms.service";


@Controller('rooms')
export class RoomsController {
	constructor(private readonly RoomsService: RoomsService) {}

	@Get()
	getAllRooms() {
		return this.RoomsService.getAllRooms()
	}

	@Get(':id')
	getRoom(@Param('id') id: number) {
		return this.RoomsService.getRoom(id)
	}

	@Post(':room')
	createRoom (@Body() data : { roomId: number; maxPlayers: number }) {
		return this.RoomsService.createRoom(data.roomId, data.maxPlayers)
	}


}


