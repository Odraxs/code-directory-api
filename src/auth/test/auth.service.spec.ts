import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UserService } from './../../user/user.service';
import { AuthService } from '../auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/services/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import config from '../../common/config';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  //mocks
  let spyUserService: UserService;
  let spyJwtService: JwtService;
  let spyPrismaService: DeepMockProxy<PrismaService>;

  const date = new Date();
  const user = {
    id: 'fcd2fa2d-f5f4-4ed0-9d75-f3ca6ddd4c21',
    name: 'John',
    email: 'john@doe.com',
    passwordHash: 'hashedPassword',
    createdAt: date,
    updatedAt: date,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: config.jwt.secret,
          signOptions: {
            expiresIn: config.jwt.expiresIn,
          },
        }),
      ],
      providers: [
        AuthService,
        UserService,
        {
          provide: PrismaService,
          useFactory: () => mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    spyUserService = module.get<UserService>(UserService);
    spyJwtService = module.get<JwtService>(JwtService);
    spyPrismaService = module.get(
      PrismaService,
    ) as DeepMockProxy<PrismaService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(spyUserService).toBeDefined();
    expect(spyJwtService).toBeDefined();
    expect(spyPrismaService).toBeDefined();
  });

  describe('signup', () => {
    const signUpData = {
      name: 'John',
      email: 'john@doe.com',
      passwordHash: 'securePassword',
    };

    it('should create a new user', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(user.passwordHash);
      spyPrismaService.user.create.mockResolvedValue(user);

      await service.signup(signUpData);
      expect(spyPrismaService.user.create).toHaveBeenCalledTimes(1);
      expect(spyPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: signUpData.name,
          email: signUpData.email,
          passwordHash: user.passwordHash,
        },
        select: null,
      });
    });

    it('should return an error for a duplicated email', async () => {
      spyPrismaService.user.create.mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError('Some error', {
          code: 'P2002',
          clientVersion: '4.12.0',
        }),
      );

      await expect(service.signup(signUpData)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginInfo = {
      email: 'john@doe.com',
      password: 'hashedPassword',
    };
    const testJWT =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMwYzE0Mzc2LTlmYWYtNGQ5Yi04MThiLTEzMjQwNWE0NTYyNyIsImVtYWlsIjoiamhvbkBkb2UuY29tIiwibmFtZSI6Ikpob24iLCJpYXQiOjE3MDExMjExNDQsImV4cCI6MTcwMTIwNzU0NH0.yXpbpk1NLglAMI3ypGWollhsBmWfxuL2K1KyZCt_zDY';

    it('should allow an user to login', async () => {
      jest.spyOn(bcrypt, 'compareSync').mockResolvedValue(true);
      jest.spyOn(spyJwtService, 'signAsync').mockResolvedValue(testJWT);
      spyPrismaService.user.findFirst.mockResolvedValue(user);

      expect(await service.login(loginInfo)).toStrictEqual(testJWT);
      expect(spyPrismaService.user.findFirst).toHaveBeenCalledTimes(1);
    });

    it('should retrieve an unauthorized error', async () => {
      spyPrismaService.user.findFirst.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compareSync').mockResolvedValue(false);

      await expect(service.login(loginInfo)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    it('should return a valid user', async () => {
      spyPrismaService.user.findUnique.mockResolvedValue(user);
      expect(await service.validateUser(payload)).toStrictEqual(user);
    });

    it('should throw an unauthorized error', async () => {
      spyPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.validateUser(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
