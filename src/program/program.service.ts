import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CodeCompilationException } from './exceptions/codeCompilation.exception';
import { PrismaService } from '../common/services/prisma.service';
import { ProgramDto } from './dtos/program.dto';
import { ProgramExecFactory } from './programExec/ProgramExecFactory';
import { IProgramExec } from './programExec/IProgramExec';
import { ProgramExecResultDto } from './dtos/programExecResult.dto';

@Injectable()
export class ProgramService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly programExecFactory: ProgramExecFactory,
  ) {}

  public async processProgram(
    programDto: ProgramDto,
  ): Promise<ProgramExecResultDto> {
    const result = await this.executeProgram(programDto);
    try {
      await this.prisma.program.create({
        data: { ...programDto },
      });

      return new ProgramExecResultDto(
        programDto.name,
        programDto.language,
        result,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Something happened when saving the program',
      );
    }
  }

  public async executeProgram(programDto: ProgramDto): Promise<string> {
    const programExc: IProgramExec = this.programExecFactory.createProgramExec(
      programDto.language,
    );
    try {
      programExc.processExecutable(programDto);
      const result = await programExc.runExecutable(programDto);
      return result;
    } catch (error) {
      const errorMessage = programExc.formatErrorMessage(error);
      throw new CodeCompilationException('Code compilation failed', {
        cause: 'Compilation error',
        description: errorMessage,
      });
    }
  }
}
