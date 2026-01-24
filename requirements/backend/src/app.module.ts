/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.module.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: nboer <nboer@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/14 16:17:58 by lde-taey          #+#    #+#             */
/*   Updated: 2026/01/24 19:00:29 by nboer            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';


@Module
({
  imports: [
    //ConfigModule,//would need to be installe seperately
    //DatabaseModule,
    //AuthModule,
    //UsersModule,
    //GameModule,
  ],
  controllers: [AuthController]

})
export class AppModule {}
