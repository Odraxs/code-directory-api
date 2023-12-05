import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { SignupDto } from './dtos/signup.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { LoginDto } from './dtos/login.dto';
import { AuthUser } from './auth-user';

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
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

    const validatePassword = await bcrypt.compareSync(
      loginDto.password,
      user!.passwordHash,
    );

    if (user === null || !validatePassword) throw new UnauthorizedException();

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name!,
    };
    return this.jwtService.signAsync(payload);
  }

  async validateUser(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (
      user !== null &&
      user.email === payload.email &&
      user.name === payload.name
    ) {
      return user;
    }
    throw new UnauthorizedException();
  }
}
