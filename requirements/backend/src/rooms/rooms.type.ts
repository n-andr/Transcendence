/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   rooms.type.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: nboer <nboer@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/01 15:24:53 by nboer             #+#    #+#             */
/*   Updated: 2026/02/01 18:15:48 by nboer            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* The idea is here to create a struct (type in this case) that can be sent from server to client whenever requested.
in this way, client doesn't need to request again to the server whenever you need another variable. (does this make sense?) */ 

type Room = {
	name: string
	id: string
	active: boolean
	players: Players[]
	round: number
	currentWord: string // only for the drawing client
	maxPlayers: number
	// timer?
}

type Player = {
	name: string
	id: string
	drawing: boolean	
}
