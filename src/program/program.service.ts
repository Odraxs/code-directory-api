import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
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

  public async storeExecuteProgram(
    programDto: ProgramDto,
  ): Promise<ProgramExecResultDto> {
    const programExc: IProgramExec = this.programExecFactory.createProgramExec(
      programDto.language,
    );
    try {
      programExc.processExecutable(programDto);
      const result = await programExc.runExecutable(programDto);
      await this.prisma.program.create({
        data: { ...programDto },
      });

      return new ProgramExecResultDto(
        programDto.name,
        programDto.language,
        result,
      );
    } catch (error) {
      const errorMessage = programExc.formatErrorMessage(error);
      throw new BadRequestException('Code compilation failed', {
        cause: errorMessage,
        description: errorMessage,
      });
    }
  }
}
