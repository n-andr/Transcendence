import { postJson } from "./http";
import type { LoginResponse, SignupResponse } from "../../shared/auth.types";

export type LoginRequest = {
	email: string;
  	password: string;
};

export type SignupRequest = {
	email: string;
  	password: string;
	username: string;
};

export type User = {
	id: number;
	//name: string;
};

export type UserProfileDto = {
  id: number;
  nickname: string;
  email: string;
  friends: FriendDto[]; // for showing usernames
};

export type FriendDto = {
  id: number;
  nickname: string;
};

export function login(req: LoginRequest) {
  return postJson<LoginResponse>("/auth/login", req);
}

export function signup(req: SignupRequest) {
  return postJson<SignupResponse>("/auth/signup", req);
}

export function getUserProfile(userId: number) {
	console.log(`Fetching user profile for userId: ${userId}`);
  return postJson<UserProfileDto>("/users/me", { userId });
}

