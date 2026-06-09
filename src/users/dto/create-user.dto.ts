import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import type { UserRole } from '../user-role.type';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['INTERN', 'ADMIN', 'ENGINEER'], {
    message: 'Role must be either INTERN, ADMIN, or ENGINEER',
  })
  role: UserRole;
}
