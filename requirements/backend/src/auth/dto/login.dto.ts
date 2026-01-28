/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   login.dto.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: nboer <nboer@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/24 19:09:06 by nboer             #+#    #+#             */
/*   Updated: 2026/01/25 15:51:55 by nboer            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
	@IsString()
	password: string;

	@IsString()
	@MinLength(2)
	@MaxLength(20)
	username: string;
}
