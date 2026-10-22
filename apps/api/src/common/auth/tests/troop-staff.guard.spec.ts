import { Role } from '@prisma/client';

import { TroopStaffGuard } from '../troop-staff.guard';

const context = (request: object) =>
  ({
    switchToHttp: () => ({ getRequest: () => request }),
  }) as never;

describe('TroopStaffGuard', () => {
  it('allows administrators without checking staff membership', async () => {
    const authorization = {
      getApplicationUser: jest.fn().mockResolvedValue({ role: Role.ADMIN }),
      getTroopIdForRequest: jest.fn(),
      assertStaff: jest.fn(),
    };

    await expect(
      new TroopStaffGuard(authorization as never).canActivate(
        context({ user: { id: 'auth-user' } }),
      ),
    ).resolves.toBe(true);
    expect(authorization.assertStaff).not.toHaveBeenCalled();
  });

  it('checks staff access for a regular user', async () => {
    const user = { role: Role.USER };
    const request = { user, params: { troopId: 'troop-1' } };
    const authorization = {
      getApplicationUser: jest.fn().mockResolvedValue(user),
      getTroopIdForRequest: jest.fn().mockResolvedValue('troop-1'),
      assertStaff: jest.fn(),
    };

    await expect(
      new TroopStaffGuard(authorization as never).canActivate(context(request)),
    ).resolves.toBe(true);
    expect(authorization.assertStaff).toHaveBeenCalledWith(user, 'troop-1');
  });

  it('propagates a staff authorization denial', async () => {
    const error = new Error('not staff');
    const authorization = {
      getApplicationUser: jest.fn().mockResolvedValue({ role: Role.USER }),
      getTroopIdForRequest: jest.fn().mockResolvedValue('troop-1'),
      assertStaff: jest.fn().mockImplementation(() => {
        throw error;
      }),
    };

    await expect(
      new TroopStaffGuard(authorization as never).canActivate(
        context({ user: { id: 'auth-user' } }),
      ),
    ).rejects.toBe(error);
  });
});
