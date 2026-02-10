import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;

  constructor(private readonly usersService: UsersService) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  // --------------------------------------------------
  // Signup
  // --------------------------------------------------
  async signup(email: string, password: string, username: string) {
    const user = await this.usersService.getUser(email);

    if (user) {
      throw new UnauthorizedException(`Email ${user.email} is already used.`);
    }

    const passwordHash = await this.hashPassword(password);

    const newUser = await this.usersService.createUser(username, email, passwordHash);

    return {
      message: `Account for ${newUser.nickname} successfully created.`,
      id: 1,
      username: newUser.nickname,
      email:  newUser.email,
    };
  }

  // --------------------------------------------------
  // Login
  // --------------------------------------------------
  async login(email: string, password: string) {
    const user = await this.usersService.getUser(email);

    if (!user) {
      throw new UnauthorizedException('No user available');
    }

    const isValid = await this.verifyPassword(
      password,
      user.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Wrong pw');
    }

    // later: return JWT here
    return {
      message: `${user.nickname} has successfully logged in.`,
      id: 1,
      username: user.nickname,
      email:  user.email,
    };
  }
}
