import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup() {
    return { message: 'Sign up' };
  }

  signin() {
    return { message: 'Sign in' };
  }
}
