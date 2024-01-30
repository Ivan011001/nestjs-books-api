import { IsNotEmpty } from 'class-validator';
import { User } from '@prisma/client';

export class CreateBookDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description?: string;

  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  userId: string;
}
