/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.module.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lde-taey <lde-taey@student.42berlin.de>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/14 16:17:58 by lde-taey          #+#    #+#             */
/*   Updated: 2026/01/14 16:18:06 by lde-taey         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'

@Module
({
  imports: [
    //ConfigModule,//would need to be installe seperately
    //DatabaseModule,
    //AuthModule,
    UsersModule,
    //GameModule,
  ],
})
export class AppModule {}