import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { UserService } from '../user/user.service';
import { SignupDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async signup(signupDto: SignupDto): Promise<void> {
    try {
      await this.prisma.user.create({
        data: {
          name: signupDto.name,
          email: signupDto.email,
          passwordHash: await bcrypt.hash(signupDto.passwordHash, 10),
        },
        select: null,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          //unique email error
          throw new ConflictException();
        } else {
          throw error;
        }
      } else throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<string> {
    const normalizeEmail = loginDto.email.toLocaleLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        email: normalizeEmail,
      },
      select: {
        id: true,
        passwordHash: true,
        email: true,
        name: true,
      },
    });
    if (
      user === null ||
      !bcrypt.compareSync(loginDto.password, user.passwordHash)
    )
      throw new UnauthorizedException();

    return user.id;
  }
}
