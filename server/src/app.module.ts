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

@Module
({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    GameModule,
  ],
})
export class AppModule {}