import { Role } from '@prisma/client';

import { TroopLeaderGuard } from '../troop-leader.guard';

const context = (request: object) =>
  ({
    switchToHttp: () => ({ getRequest: () => request }),
  }) as never;

describe('TroopLeaderGuard', () => {
  it('allows administrators without checking leader membership', async () => {
    const authorization = {
      getApplicationUser: jest.fn().mockResolvedValue({ role: Role.ADMIN }),
      getTroopIdForRequest: jest.fn(),
      assertLeader: jest.fn(),
    };

    await expect(
      new TroopLeaderGuard(authorization as never).canActivate(
        context({ user: { id: 'auth-user' } }),
      ),
    ).resolves.toBe(true);
    expect(authorization.assertLeader).not.toHaveBeenCalled();
  });

  it('checks leader access for a regular user', async () => {
    const user = { role: Role.USER };
    const request = { user, params: { troopId: 'troop-1' } };
    const authorization = {
      getApplicationUser: jest.fn().mockResolvedValue(user),
      getTroopIdForRequest: jest.fn().mockResolvedValue('troop-1'),
      assertLeader: jest.fn(),
    };

    await expect(
      new TroopLeaderGuard(authorization as never).canActivate(
        context(request),
      ),
    ).resolves.toBe(true);
    expect(authorization.assertLeader).toHaveBeenCalledWith(user, 'troop-1');
  });

  it('propagates a leader authorization denial', async () => {
    const error = new Error('not leader');
    const authorization = {
      getApplicationUser: jest.fn().mockResolvedValue({ role: Role.USER }),
      getTroopIdForRequest: jest.fn().mockResolvedValue('troop-1'),
      assertLeader: jest.fn().mockImplementation(() => {
        throw error;
      }),
    };

    await expect(
      new TroopLeaderGuard(authorization as never).canActivate(
        context({ user: { id: 'auth-user' } }),
      ),
    ).rejects.toBe(error);
  });
});
