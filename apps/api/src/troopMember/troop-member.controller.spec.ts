import { Function } from '@prisma/client';

jest.mock('./dto/update-member.dto', () => ({
  UpdateMemberDto: class UpdateMemberDto {},
}));

import { TroopMemberController } from './troop-member.controller';

describe('TroopMemberController', () => {
  it('authorizes and delegates member creation', async () => {
    const service = { createMember: jest.fn().mockResolvedValue('created') };
    const authorization = { assertCanAssignStaffFunction: jest.fn() };

    const controller = new TroopMemberController(
      service as never,
      authorization as never,
    );

    const dto = { troopId: 'troop-1', function: Function.NONE } as never;
    const request = { user: { id: 'auth-user' } } as never;

    await expect(controller.createMember(dto, request)).resolves.toBe(
      'created',
    );

    expect(authorization.assertCanAssignStaffFunction).toHaveBeenCalledWith(
      request.user,
      'troop-1',
      Function.NONE,
    );
    expect(service.createMember).toHaveBeenCalledWith(dto);
  });

  it('does not create a member when authorization fails', async () => {
    const service = { createMember: jest.fn() };
    const authorization = {
      assertCanAssignStaffFunction: jest
        .fn()
        .mockRejectedValue(new Error('Forbidden')),
    };

    const controller = new TroopMemberController(
      service as never,
      authorization as never,
    );

    const dto = { troopId: 'troop-1', function: Function.NONE } as never;
    const request = { user: { id: 'auth-user' } } as never;

    await expect(controller.createMember(dto, request)).rejects.toThrow(
      'Forbidden',
    );

    expect(service.createMember).not.toHaveBeenCalled();
  });

  it('delegates all remaining member operations with resolved troop authorization', async () => {
    const service = {
      deleteMember: jest.fn().mockResolvedValue('deleted'),
      updateMember: jest.fn().mockResolvedValue('updated'),
      getTroopMembersSection: jest.fn().mockResolvedValue([]),
      updateDegree: jest.fn().mockResolvedValue('degree-updated'),
    };

    const authorization = {
      getTroopIdForRequest: jest.fn().mockResolvedValue('troop-1'),
      assertCanAssignStaffFunction: jest.fn(),
    };

    const controller = new TroopMemberController(
      service as never,
      authorization as never,
    );

    const request = { user: { id: 'auth-user' } } as never;
    const dto = { function: Function.PRZYBOCZNY } as never;

    await expect(controller.deleteMember('profile-1')).resolves.toBe('deleted');
    await expect(
      controller.updateMember('profile-1', dto, request),
    ).resolves.toBe('updated');
    await expect(controller.getTroopMembersSection('troop-1')).resolves.toEqual(
      [],
    );
    await expect(
      controller.updateDegree('profile-1', {
        degree: 'DH',
        acquiringDegree: 'ML',
      } as never),
    ).resolves.toBe('degree-updated');

    expect(service.deleteMember).toHaveBeenCalledWith('profile-1');

    expect(authorization.getTroopIdForRequest).toHaveBeenCalledWith(request);
    expect(authorization.assertCanAssignStaffFunction).toHaveBeenCalledWith(
      request.user,
      'troop-1',
      Function.PRZYBOCZNY,
    );

    expect(service.updateMember).toHaveBeenCalledWith('profile-1', dto);
    expect(service.getTroopMembersSection).toHaveBeenCalledWith('troop-1');
    expect(service.updateDegree).toHaveBeenCalledWith('profile-1', 'DH', 'ML');
  });

  it('uses Function.NONE when the updated function is undefined', async () => {
    const service = {
      updateMember: jest.fn().mockResolvedValue('updated'),
    };

    const authorization = {
      getTroopIdForRequest: jest.fn().mockResolvedValue('troop-1'),
      assertCanAssignStaffFunction: jest.fn(),
    };

    const controller = new TroopMemberController(
      service as never,
      authorization as never,
    );

    const request = { user: { id: 'auth-user' } } as never;
    const dto = {} as never;

    await expect(
      controller.updateMember('profile-1', dto, request),
    ).resolves.toBe('updated');

    expect(authorization.assertCanAssignStaffFunction).toHaveBeenCalledWith(
      request.user,
      'troop-1',
      Function.NONE,
    );
    expect(service.updateMember).toHaveBeenCalledWith('profile-1', dto);
  });

  it('does not update a member when authorization fails', async () => {
    const service = {
      updateMember: jest.fn(),
    };

    const authorization = {
      getTroopIdForRequest: jest.fn().mockResolvedValue('troop-1'),
      assertCanAssignStaffFunction: jest
        .fn()
        .mockRejectedValue(new Error('Forbidden')),
    };

    const controller = new TroopMemberController(
      service as never,
      authorization as never,
    );

    const request = { user: { id: 'auth-user' } } as never;
    const dto = { function: Function.PRZYBOCZNY } as never;

    await expect(
      controller.updateMember('profile-1', dto, request),
    ).rejects.toThrow('Forbidden');

    expect(authorization.getTroopIdForRequest).toHaveBeenCalledWith(request);
    expect(service.updateMember).not.toHaveBeenCalled();
  });
});
