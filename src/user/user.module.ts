import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../common/services/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { ProgramService } from 'src/program/program.service';
import { ProgramExecFactory } from 'src/program/programExec/ProgramExecFactory';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [UserService, PrismaService, ProgramService, ProgramExecFactory],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
