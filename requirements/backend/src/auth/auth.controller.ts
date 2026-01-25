/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.controller.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: nboer <nboer@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/24 18:54:09 by nboer             #+#    #+#             */
/*   Updated: 2026/01/25 16:04:59 by nboer            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	
	@Get()
	getAuth() {
		return 'Auth';
	}

	@Post('signup')
	async signup(@Body() dto: SignupDto) {
		console.log(dto); // for debugging with "docker logs backend"
		return this.authService.signup(dto.email, dto.password, dto.username);
	}

	@Post('login')
	async login(@Body() dto: LoginDto) {
		console.log(dto); // for debugging "docker logs backend"
		return this.authService.login(dto.username, dto.password);
}
}
