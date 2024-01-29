import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(authDto: AuthDto) {
    try {
      const hash = await argon2.hash(authDto.password);
      const data = { ...authDto, password: hash };

      const user = await this.prisma.user.create({
        data,
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email is already taken');
        }
      }
      throw error;
    }
  }

  signin() {
    return { message: 'Sign in' };
  }
}
