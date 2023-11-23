import { AllowedProgrammingLanguages } from '../allowedProgrammingLanguages';

/**
 * params
 * @programName
 * @language
 * @result
 */
export class ProgramExecResultDto {
  programName: string;
  language: AllowedProgrammingLanguages;
  result: string;

  constructor(
    programName: string,
    language: AllowedProgrammingLanguages,
    result: string,
  ) {
    this.programName = programName;
    this.language = language;
    this.result = result;
  }
}
