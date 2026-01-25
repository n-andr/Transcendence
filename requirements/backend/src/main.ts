/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lde-taey <lde-taey@student.42berlin.de>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/12 17:15:31 by lde-taey          #+#    #+#             */
/*   Updated: 2026/01/14 16:20:49 by lde-taey         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() 
{
  const app = await NestFactory.create(AppModule);
  await app.listen(3000); // 3000 is the port
  console.log('Server is running on http://localhost:3000');
  console.log('Testing changes');
}
bootstrap();