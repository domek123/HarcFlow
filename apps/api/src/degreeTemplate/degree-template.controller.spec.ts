import { DegreeTemplatesController } from './degree-template.controller';

describe('DegreeTemplatesController', () => {
  it('delegates create, findAll and update operations', async () => {
    const service = {
      create: jest.fn().mockResolvedValue('created'),
      findAll: jest.fn().mockResolvedValue(['template']),
      update: jest.fn().mockResolvedValue('updated'),
    };
    const controller = new DegreeTemplatesController(service as never);
    const dto = { degree: 'DH', tasks: [] } as never;

    await expect(controller.create('troop-1', dto)).resolves.toBe('created');
    await expect(controller.findAll('troop-1')).resolves.toEqual(['template']);
    await expect(controller.update('troop-1', 'template-1', dto)).resolves.toBe('updated');

    expect(service.create).toHaveBeenCalledWith('troop-1', dto);
    expect(service.findAll).toHaveBeenCalledWith('troop-1');
    expect(service.update).toHaveBeenCalledWith('troop-1', 'template-1', dto);
  });
});
