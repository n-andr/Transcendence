import { postJson } from "./http";

export type LoginRequest = {
	email: string;
  	password: string;
};

export type SignupRequest = {
	email: string;
  	password: string;
	username: string;
};

// export type LoginResponse = {
//   user: { id: string; username: string };
// };

export type TemporalResponse = {message : string}; // temporaly


//change to login response when it will be defined
export function login(req: LoginRequest) {
  return postJson<TemporalResponse>("/auth/login", req);
}


//change to signup response when it will be defined
export function signup(req: SignupRequest) {
  return postJson<TemporalResponse>("/auth/signup", req);
}
