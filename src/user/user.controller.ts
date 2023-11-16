import { UserResponseDto } from './dtos/userResponse.dto';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('id') id: string): Promise<UserResponseDto> {
    const { email, name } = await this.userService.getUserById(id);
    return new UserResponseDto(email, name);
  }
}
