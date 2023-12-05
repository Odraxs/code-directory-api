import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from '../auth/auth-user';
import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async getUserById(id: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }
    return user;
  }
}
