import { ProgramDto } from '../dtos/program.dto';

export interface IProgramExec {
  processExecutable(programDto: ProgramDto): void;
  runExecutable(programDto: ProgramDto): Promise<string>;
  formatErrorMessage(error: Error): any;
}
