import { Injectable } from '@nestjs/common';
import { IProgramExec } from './IProgramExec';
import { ProgramExecJs } from './ProgramExecJs';

const languages = {
  javascript: new ProgramExecJs(),
  // "python":
};

@Injectable()
export class ProgramExecFactory {
  public createProgramExec(language: string): IProgramExec {
    return languages[language];
  }
}
