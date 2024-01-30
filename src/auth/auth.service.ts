import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(authDto: AuthDto) {
    try {
      const hash = await argon2.hash(authDto.password);
      const data = { ...authDto, password: hash };

      const user = await this.prisma.user.create({
        data,
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email is already taken');
        }
      }
      throw error;
    }
  }

  async signin(authDto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('Email not found');
    }

    const pwMatches = await argon2.verify(user.password, authDto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Password is wrong');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: string, email: string): Promise<{ token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('SECRET');

    return {
      token: await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret,
      }),
    };
  }
}
