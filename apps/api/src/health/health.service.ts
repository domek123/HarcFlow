import { Injectable, ServiceUnavailableException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        checks: {
          database: 'up',
        },
      };
    } catch {
      throw new ServiceUnavailableException({
        message: 'Usługa jest tymczasowo niedostępna.',
        checks: {
          database: 'down',
        },
      });
    }
  }
}
