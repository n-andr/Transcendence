/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   signup.dto.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: nboer <nboer@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/24 18:54:22 by nboer             #+#    #+#             */
/*   Updated: 2026/01/24 19:34:58 by nboer            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class SignupDto {
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(8)
	password: string;

	@IsString()
	@MinLength(2)
	@MaxLength(20)
	username: string;
}
