import { ScoutDegreeController } from './scout-degree.controller';

describe('ScoutDegreeController', () => {
  it('delegates all scout degree operations to the service', async () => {
    const service = {
      findAll: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue('created'),
      createTask: jest.fn().mockResolvedValue('task-created'),
      open: jest.fn().mockResolvedValue('opened'),
      complete: jest.fn().mockResolvedValue('completed'),
      updateTask: jest.fn().mockResolvedValue('task-updated'),
      deleteTask: jest.fn().mockResolvedValue('task-deleted'),
      deleteScoutDegree: jest.fn().mockResolvedValue('degree-deleted'),
    };
    const controller = new ScoutDegreeController(service as never);
    const dto = {} as never;

    await expect(controller.findAll('scout-1')).resolves.toEqual([]);
    await expect(controller.create('scout-1', dto)).resolves.toBe('created');
    await expect(controller.createTask('degree-1', dto)).resolves.toBe('task-created');
    await expect(controller.open('degree-1')).resolves.toBe('opened');
    await expect(controller.complete('degree-1', { orderNumber: '1' })).resolves.toBe(
      'completed',
    );
    await expect(controller.updateTask('task-1', dto)).resolves.toBe('task-updated');
    await expect(controller.deleteTask('task-1')).resolves.toBe('task-deleted');
    await expect(controller.deleteScoutDegree('degree-1')).resolves.toBe('degree-deleted');

    expect(service.findAll).toHaveBeenCalledWith('scout-1');
    expect(service.create).toHaveBeenCalledWith('scout-1', dto);
    expect(service.createTask).toHaveBeenCalledWith('degree-1', dto);
    expect(service.open).toHaveBeenCalledWith('degree-1');
    expect(service.complete).toHaveBeenCalledWith('degree-1', '1');
    expect(service.updateTask).toHaveBeenCalledWith('task-1', dto);
    expect(service.deleteTask).toHaveBeenCalledWith('task-1');
    expect(service.deleteScoutDegree).toHaveBeenCalledWith('degree-1');
  });
});
