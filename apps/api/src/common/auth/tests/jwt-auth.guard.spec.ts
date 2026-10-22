import { UnauthorizedException } from '@nestjs/common';

import { JwtAuthGuard } from '../jwt-auth.guard';

const context = (request: object) =>
  ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({ getRequest: () => request }),
  }) as never;

describe('JwtAuthGuard', () => {
  function createGuard(
    isPublic = false,
    userResult = { user: null, error: null },
  ) {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(isPublic),
    };
    const supabase = {
      auth: { getUser: jest.fn().mockResolvedValue({ data: userResult }) },
    };
    return {
      guard: new JwtAuthGuard(reflector as never, supabase as never),
      reflector,
      supabase,
    };
  }

  it('allows public endpoints without checking a token', async () => {
    const { guard, supabase } = createGuard(true);

    await expect(guard.canActivate(context({ headers: {} }))).resolves.toBe(
      true,
    );
    expect(supabase.auth.getUser).not.toHaveBeenCalled();
  });

  it.each([undefined, '', 'Basic token', 'Bearer', 'Bearer '])(
    'rejects an invalid authorization header: %p',
    async (authorization) => {
      const { guard, supabase } = createGuard();

      await expect(
        guard.canActivate(context({ headers: { authorization } })),
      ).rejects.toThrow(
        new UnauthorizedException('Wymagany jest token Bearer.'),
      );
      expect(supabase.auth.getUser).not.toHaveBeenCalled();
    },
  );

  it('rejects an invalid or expired token', async () => {
    const { guard, supabase } = createGuard(false, {
      user: null,
      error: { message: 'invalid token' },
    });

    await expect(
      guard.canActivate(
        context({ headers: { authorization: 'Bearer invalid-token' } }),
      ),
    ).rejects.toThrow(
      new UnauthorizedException('Token jest nieważny lub wygasł.'),
    );
    expect(supabase.auth.getUser).toHaveBeenCalledWith('invalid-token');
  });

  it('stores the authenticated Supabase user on the request', async () => {
    const user = { id: 'auth-user', email: 'user@example.com' };
    const { guard, reflector, supabase } = createGuard(false, {
      user,
      error: null,
    });
    const request = { headers: { authorization: 'Bearer valid-token' } };

    await expect(guard.canActivate(context(request))).resolves.toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
      'isPublic',
      expect.any(Array),
    );
    expect(supabase.auth.getUser).toHaveBeenCalledWith('valid-token');
    expect(request).toEqual({
      headers: { authorization: 'Bearer valid-token' },
      user,
    });
  });
});
