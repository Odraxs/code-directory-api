import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { passwordConstraint } from '../consts';

/**
 * params
 * @name
 * @email
 * @passwordHash
 */
export class SignupDto {
  @IsOptional()
  @IsNotEmpty()
  @Matches(RegExp('^[a-zA-Z]+$'))
  @MaxLength(120)
  name?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  @MinLength(passwordConstraint.minLength)
  @MaxLength(passwordConstraint.maxLength)
  passwordHash: string;
}
