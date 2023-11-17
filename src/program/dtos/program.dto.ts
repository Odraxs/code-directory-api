import { IsBase64, IsEnum, IsNotEmpty } from 'class-validator';

enum AllowedProgrammingLanguages {
  JS = 'javascript',
  PT = 'python',
}
/**
 * params
 * @userId
 * @executable
 * @language
 */
export class ProgramDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsBase64()
  executable: string;

  @IsNotEmpty()
  @IsEnum(AllowedProgrammingLanguages)
  language: AllowedProgrammingLanguages;
}
