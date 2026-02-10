import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class ConnectionRegistry {
	/*
   * userId -> Set of sockets
   * One user may have multiple connections (tabs, refresh, phone, etc.)
   */
  private connections = new Map<number, Set<Socket>>();

  addConnection(userId: number, socket: Socket) {
	if (!this.connections.has(userId)) {
		this.connections.set(userId, new Set());
	}
	this.connections.get(userId)!.add(socket);
  }

  removeConnection(userId: number, socket: Socket) {
	const set = this.connections.get(userId);
	if (!set) return;
	set.delete(socket);
	if (set.size === 0) {
		this.connections.delete(userId);
	}
  }

  getSocketsByUserId(userId: number): Socket[] {
	console.log(`get sockets by user id: ${userId}`);
	return Array.from(this.connections.get(userId) ?? []);
  }

  getAllSockets(): Socket[] {
	return Array.from(this.connections.values()).flatMap(set => [...set]);
  }

  // --- debug method ---
  printRegistry() {
    console.log('--- Current ConnectionRegistry ---');
    for (const [userId, set] of this.connections.entries()) {
      console.log(`User ${userId} → ${set.size} socket(s):`, [...set].map(s => s.id));
    }
    console.log('---------------------------------');
  }
}