import { Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ConnectionRegistry } from '../websocket/websocket.service';
//copy paste for testing

@Controller('tmp')
export class TmpController {
  constructor(
	private readonly registry: ConnectionRegistry,
  ) {}

  @Post('broadcast')
  handleBroadcast(
	@Body('message') message: string,
  ) {
	const sockets = this.registry.getAllSockets();
	sockets.forEach(socket => {
		console.log('broadcast to ', socket.data.userId);
		socket.emit('broadcast', { message });
	});
	return { sendTo: sockets.length, message };
	//send the message to all connected users
  }

  @Post('singlecast/:id')
  handleSinglecast(
	@Body('message') message: string,
	@Param('id', ParseIntPipe) receiver: number,
  ) {
	this.registry.printRegistry();
	const sockets = this.registry.getSocketsByUserId(receiver);
	sockets.forEach(socket => {
		console.log('singlecast to ', socket.data.userId);
		socket.emit('singlecast', { message });
	});
	return { sendTo: sockets.length, receiver, message };
	//send the message to the user with the user id receiver
  }

}
