export type AuthResponse = {
  message: string;
  id: number;
  username: string;
  email: string;
};

export type LoginResponse = AuthResponse;

export type SignupResponse = AuthResponse;
