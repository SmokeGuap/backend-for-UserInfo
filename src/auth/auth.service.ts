import { Injectable } from '@nestjs/common';
import { Payload } from 'src/types/payload';
import { sign, verify } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signPayload(payload: Payload) {
    const accessToken = sign(payload, process.env.SECRET_KEY, {
      expiresIn: '10m',
    });

    const refreshToken = sign(
      {
        email: payload.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: '1d' },
    );

    return { accessToken, refreshToken };
  }

  async validateUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = verify(refreshToken, process.env.SECRET_KEY);
      console.log(decoded);
      const user = await this.userService.findByPayload(
        decoded as { email: string },
      );
      if (!user) {
        throw new Error('User not found');
      }
      const payload = { email: user.email };
      return {
        access_token: sign(payload, process.env.SECRET_KEY),
      };
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }
}
