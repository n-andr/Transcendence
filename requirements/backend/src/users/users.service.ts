import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { User } from "@prisma/client"


@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	createUser(nickname: string, email: string, password: string): Promise<User> {
		console.log(`I am creating a user: ${nickname}, ${email}`);
		//call database
		//return {nickname, email, password };
		return this.prisma.user.create({
			data: { nickname, email, password },
		});
	}
	getUser(email: string): Promise<User | null> {
		console.log(`I am retrieving User data by email: ${email}`);
		//call database
		//return {nickname, email: 'Dummy@example.com', password: 'secret' };
		return this.prisma.user.findUnique({
			where: { email },
		});
	}
	async getUserById(id: number): Promise<User | null> {
		console.log(`I am retrieving User data by ID: ${id}`);
		return this.prisma.user.findUnique({
			where: { id },
		});
	}
	async getUserByNickname(nickname: string): Promise<User | null> {
		console.log(`I am fetching User data by nickname: ${nickname}`);
		return this.prisma.user.findUnique({
			where: { nickname },
		});
	}
	async addFriend(userID: number, friendID: number) {
		console.log(`[addFriend] called. Attempting to add friend with ID ${friendID} to user with ID ${userID}`);
		const user = await this.prisma.user.findUnique({
			where: { id: userID },
			select: { friends: true },
		});
		//console.log(`[addFriend] Adding friend with ID ${friendID} to user with ID ${userID}`);
		if (!user) {
			throw new Error("User not found");
		}

		const friends = user.friends ?? [];

		if (!friends.includes(friendID)) {
			await this.prisma.user.update({
				where: { id: userID },
				data: { friends: [...friends, friendID] },
			});
		}
		console.log(`[addFriend] User with ID ${userID} now has friends: ${friends}`);
	}
	async removeFriend(userID: number, friendID: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userID },
			select: { friends: true },
		});

		console.log(`[removeFriend] Removing friend with ID ${friendID} from user with ID ${userID}`);
		if (!user) {
			throw new Error("User not found");
		}

		const friends = user.friends ?? [];

		if (friends.includes(friendID)) {
			await this.prisma.user.update({
				where: { id: userID },
				data: { friends: friends.filter((id: number) => id !== friendID) },
			});
		}
		console.log(`[removeFriend] User with ID ${userID} now has friends: ${friends}`);
	}

	async getFriendsNicknames(friendsIDs: number[]): Promise<string[]> {
		let nicknames: string[] = [];
		for(const id of friendsIDs) {
			const user: User | null = await this.getUserById(id);
			if (!user) {
				throw new Error("User not found");
			}
			nicknames.push(user.nickname);
		}
		console.log(`[getFriendsNicknames] Retrieved nicknames for friends: ${nicknames}`);
		return nicknames;
	}
}
