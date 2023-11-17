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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  async getUser(@Param('id') id: string): Promise<UserResponseDto> {
    const { email, name } = await this.userService.getUserById(id);
    return new UserResponseDto(email, name);
  }

  @Post('program')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(AuthGuard())
  postProgram(@Body() programDto: ProgramDto): ProgramDto {
    return programDto;
  }
}
