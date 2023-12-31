import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UserResponseDto } from './dtos/userResponse.dto';
import { ProgramDto } from '../program/dtos/program.dto';
import { ProgramService } from '../program/program.service';
import { ProgramExecResultDto } from '../program/dtos/programExecResult.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly programService: ProgramService,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  async getUser(@Param('id') id: string): Promise<UserResponseDto> {
    const { email, name } = await this.userService.getUserById(id);
    return new UserResponseDto(email, name!);
  }

  @Post('program')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(AuthGuard())
  async postProgram(
    @Body() programDto: ProgramDto,
  ): Promise<ProgramExecResultDto> {
    await this.userService.getUserById(programDto.userId);
    return await this.programService.processProgram(programDto);
  }
}
