import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UserService } from '../user.service';
import { PrismaService } from '../../common/services/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import mockUser from '../../../test/mockUser';

describe('UserService', () => {
  let service: UserService;
  let spyPrismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useFactory: () => mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    spyPrismaService = module.get(
      PrismaService,
    ) as DeepMockProxy<PrismaService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return the user with the requested id', async () => {
      spyPrismaService.user.findUnique.mockResolvedValue(mockUser);

      expect(await service.getUserById(mockUser.id)).toStrictEqual(mockUser);
      expect(spyPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(spyPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });

    it('should return the user from the database', async () => {
      spyPrismaService.user.findUnique.mockResolvedValue(mockUser);

      expect(await service.getUserById(mockUser.id)).toStrictEqual(mockUser);
    });

    it('should throw a not found exception', async () => {
      spyPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserById(mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(spyPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });
});
