/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.module.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: nboer <nboer@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/14 16:17:58 by lde-taey          #+#    #+#             */
/*   Updated: 2026/01/25 17:22:13 by nboer            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';


@Module
({
  imports: [AuthModule],
    //ConfigModule,//would need to be installe seperately
    //DatabaseModule,
    //AuthModule,
    UsersModule,
    //GameModule,
  controllers: [AuthController]

})
export class AppModule {}
