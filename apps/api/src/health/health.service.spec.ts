import { ServiceUnavailableException } from '@nestjs/common';

import { HealthService } from './health.service';

describe('HealthService', () => {
  it('reports a healthy database', async () => {
    const prisma = {
      $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    };
    const service = new HealthService(prisma as never);

    await expect(service.check()).resolves.toEqual({
      status: 'ok',
      checks: {
        database: 'up',
      },
    });
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it('reports the database as unavailable when the probe fails', async () => {
    const prisma = {
      $queryRaw: jest.fn().mockRejectedValue(new Error('connection refused')),
    };
    const service = new HealthService(prisma as never);

    await expect(service.check()).rejects.toMatchObject(
      new ServiceUnavailableException({
        message: 'Usługa jest tymczasowo niedostępna.',
        checks: {
          database: 'down',
        },
      }),
    );
  });
});
