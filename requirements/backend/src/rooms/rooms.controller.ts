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

/* 
Handle JoinRoom(number playerid, number roomid)
	receives player ID that wants to join from the client
		-> if (!playerID)
			-> error;
	room ID to join
		-> if player ID is not in room ID
			-> error;
		--> if n_players > max_player
			--> error;
		--> if player is already in room;
			--> error;
	if (!drawing)
		-> do not return the currentWord
	returns the updated room that was joined (so frontend sees the new player in the list)

Handle LeaveRoom(number playerid, number roomid)
	/ receives player ID that wants to leave from the client
	// the updated room, so the frontend sees that the player left.

// Delete room and create room are handled by the server therefore not in room.controller
*/
