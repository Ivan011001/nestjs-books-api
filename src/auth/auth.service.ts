import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  signup(authDto: AuthDto) {
    return { message: 'Sign up', dto: authDto };
  }

  signin() {
    return { message: 'Sign in' };
  }
}
