import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../../common/services/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AllowedProgrammingLanguages } from '../allowedProgrammingLanguages';
import { ProgramService } from '../program.service';
import { ProgramExecFactory } from '../programExec/ProgramExecFactory';
import mockUser from '../../../test/mockUser';
import { ProgramExecResultDto } from '../dtos/programExecResult.dto';
import { CodeCompilationException } from '../exceptions/codeCompilation.exception';
import * as path from 'path';
import * as fs from 'fs';

describe('UserService', () => {
  const BASE_DIRECTORY: string = 'uploadedPrograms';
  const testFileName: string = 'testCode';
  const testFilePath = () => {
    const rootPath = path.resolve(__dirname, '../../..');
    const directoryPath = path.join(rootPath, BASE_DIRECTORY, mockUser.id);
    return directoryPath;
  };

  let service: ProgramService;
  let spyPrismaService: DeepMockProxy<PrismaService>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let programExecFactory: ProgramExecFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgramService,
        ProgramExecFactory,
        {
          provide: PrismaService,
          useFactory: () => mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    service = module.get<ProgramService>(ProgramService);
    programExecFactory = module.get<ProgramExecFactory>(ProgramExecFactory);
    spyPrismaService = module.get(
      PrismaService,
    ) as DeepMockProxy<PrismaService>;
  });

  afterEach(async () => {
    const filePath = testFilePath();
    fs.rmSync(filePath, { recursive: true, force: true });
  });

  describe('programService', () => {
    it('should compile and retrieve the code result', async () => {
      const date: Date = new Date();
      // Executable in string is:
      // const sum = 1 + 1;
      // console.log(sum);
      const validExecutable =
        'Y29uc3Qgc3VtID0gMSArIDE7DQpjb25zb2xlLmxvZyhzdW0pOw==';
      const program = {
        id: 'fcd2fa2d-f5f4-4ed0-9d75-f3ca6ddd4c36',
        userId: mockUser.id,
        name: testFileName,
        executable: validExecutable,
        language: AllowedProgrammingLanguages.JS,
        createdAt: date,
        updatedAt: date,
      };

      const result = new ProgramExecResultDto(
        program.name,
        program.language,
        '2',
      );

      spyPrismaService.program.create.mockResolvedValue(program);
      expect(await service.processProgram(program)).toStrictEqual(result);
    });

    it('should retrieve a bad request exception', async () => {
      const date: Date = new Date();
      // Executable in string is:
      // console.log(1 + 1
      const validExecutable = 'Y29uc29sZS5sb2coMSArIDE=';
      const program = {
        id: 'fcd2fa2d-f5f4-4ed0-9d75-f3ca6ddd4c36',
        userId: mockUser.id,
        name: testFileName,
        executable: validExecutable,
        language: AllowedProgrammingLanguages.JS,
        createdAt: date,
        updatedAt: date,
      };

      await expect(service.processProgram(program)).rejects.toThrow(
        CodeCompilationException,
      );
    });
  });
});
