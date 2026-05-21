import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform, Expose, Exclude } from 'class-transformer';

export class CreateUserDto {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Expose()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Exclude()
  password: string;
}
