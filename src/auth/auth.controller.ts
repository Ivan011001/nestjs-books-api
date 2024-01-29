import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  signup() {
    return this.authService.signup();
  }

  @Post('login')
  signin() {
    return this.authService.signin();
  }
}
