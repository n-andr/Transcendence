import { postJson } from "./http";

export type LoginRequest = {
	email: string;
  	password: string;
};

export type LoginResponse = {
  user: { id: string; name: string };
};

export function login(req: LoginRequest) {
  return postJson<LoginResponse>("/api/auth/login", req);
}
