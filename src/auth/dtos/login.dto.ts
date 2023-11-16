import { IsNotEmpty, MinLength } from 'class-validator';

/**
 * params
 * @email
 * @password
 */
export class LoginDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
