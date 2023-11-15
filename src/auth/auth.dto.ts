import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
} from 'class-validator';
// import { passwordConstraint } from './consts';

export class UserDto {
  @IsOptional()
  @IsNotEmpty()
  @Matches(RegExp('^[a-zA-Z]+$'))
  @MaxLength(120)
  name?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  //   @IsDefined()
  //   @MinLength(passwordConstraint.minLength)
  //   @MaxLength(passwordConstraint.maxLength)
  //   passwordHash: string;
}
