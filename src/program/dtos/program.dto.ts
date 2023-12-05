import {
  IsBase64,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { AllowedProgrammingLanguages } from '../allowedProgrammingLanguages';

/**
 * params
 * @userId
 * @name
 * @executable
 * @language
 */
export class ProgramDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsBase64()
  executable: string;

  @IsNotEmpty()
  @IsEnum(AllowedProgrammingLanguages)
  language: AllowedProgrammingLanguages;
}
