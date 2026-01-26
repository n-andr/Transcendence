/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   login.dto.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: nandreev <nandreev@student.42berlin.de>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/24 19:09:06 by nboer             #+#    #+#             */
/*   Updated: 2026/01/26 22:45:41 by nandreev         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { IsString, MinLength, MaxLength, IsEmail} from 'class-validator';

export class LoginDto {
	@IsString()
	@MinLength(8)
	password: string;

	// @IsString()
	// @MinLength(2)
	// @MaxLength(20)
	@IsEmail()
	email: string;
}
