import { Role } from '@prisma/client';

import { TroopMemberGuard } from '../troop-member.guard';

const context = (request: object) =>
  ({
    switchToHttp: () => ({ getRequest: () => request }),
  }) as never;

describe('TroopMemberGuard', () => {
  it('allows an administrator without resolving a troop id', async () => {
    const authorization = {
      getApplicationUser: jest.fn().mockResolvedValue({ role: Role.ADMIN }),
      getTroopIdForRequest: jest.fn(),
      assertMember: jest.fn(),
    };

    await expect(
      new TroopMemberGuard(authorization as never).canActivate(
        context({ user: { id: 'auth-user' } }),
      ),
    ).resolves.toBe(true);
    expect(authorization.getTroopIdForRequest).not.toHaveBeenCalled();
    expect(authorization.assertMember).not.toHaveBeenCalled();
  });

  it('resolves the troop and checks membership for a regular user', async () => {
    const user = { role: Role.USER };
    const request = { user, params: { troopId: 'troop-1' } };
    const authorization = {
      getApplicationUser: jest.fn().mockResolvedValue(user),
      getTroopIdForRequest: jest.fn().mockResolvedValue('troop-1'),
      assertMember: jest.fn(),
    };

    await expect(
      new TroopMemberGuard(authorization as never).canActivate(
        context(request),
      ),
    ).resolves.toBe(true);
    expect(authorization.getTroopIdForRequest).toHaveBeenCalledWith(request);
    expect(authorization.assertMember).toHaveBeenCalledWith(user, 'troop-1');
  });

  it('propagates a membership denial', async () => {
    const error = new Error('not a member');
    const authorization = {
      getApplicationUser: jest.fn().mockResolvedValue({ role: Role.USER }),
      getTroopIdForRequest: jest.fn().mockResolvedValue('troop-1'),
      assertMember: jest.fn().mockImplementation(() => {
        throw error;
      }),
    };

    await expect(
      new TroopMemberGuard(authorization as never).canActivate(
        context({ user: { id: 'auth-user' } }),
      ),
    ).rejects.toBe(error);
  });
});
