import { ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';

import { AdminGuard } from '../admin.guard';

const context = (request: object) =>
  ({
    switchToHttp: () => ({ getRequest: () => request }),
  }) as never;

describe('AdminGuard', () => {
  it('allows an administrator', async () => {
    const authorization = {
      getApplicationUser: jest.fn().mockResolvedValue({ role: Role.ADMIN }),
    };
    const guard = new AdminGuard(authorization as never);

    await expect(
      guard.canActivate(context({ user: { id: 'auth-user' } })),
    ).resolves.toBe(true);
    expect(authorization.getApplicationUser).toHaveBeenCalledWith({
      id: 'auth-user',
    });
  });

  it('rejects a regular user', async () => {
    const authorization = {
      getApplicationUser: jest.fn().mockResolvedValue({ role: Role.USER }),
    };
    const guard = new AdminGuard(authorization as never);

    await expect(
      guard.canActivate(context({ user: { id: 'auth-user' } })),
    ).rejects.toThrow(
      new ForbiddenException('Wymagane są uprawnienia administratora.'),
    );
  });

  it('propagates an application-user lookup failure', async () => {
    const error = new ForbiddenException('Brak profilu');
    const authorization = {
      getApplicationUser: jest.fn().mockRejectedValue(error),
    };

    await expect(
      new AdminGuard(authorization as never).canActivate(
        context({ user: { id: 'auth-user' } }),
      ),
    ).rejects.toBe(error);
  });
});
