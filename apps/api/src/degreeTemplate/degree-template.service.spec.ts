import { ConflictException, NotFoundException } from '@nestjs/common';
import { Degree } from '@prisma/client';

import { DegreeTemplatesService } from './degree-template.service';

describe('DegreeTemplatesService', () => {
  const dto = { degree: Degree.DH, tasks: [{ description: 'Zadanie 1' }] };

  function createService() {
    const prisma = {
      degreeTemplate: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      degreeTemplateTask: {
        deleteMany: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    };
    prisma.$transaction.mockImplementation((callback) => callback(prisma));
    return { prisma, service: new DegreeTemplatesService(prisma as never) };
  }

  it('creates a template with indexed tasks', async () => {
    const { prisma, service } = createService();
    prisma.degreeTemplate.create.mockResolvedValue({ id: 'template-1' });

    await expect(service.create('troop-1', dto)).resolves.toEqual({ id: 'template-1' });
    expect(prisma.degreeTemplate.findUnique).toHaveBeenCalledWith({
      where: { troopId_degree: { troopId: 'troop-1', degree: Degree.DH } },
    });
    expect(prisma.degreeTemplate.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          troopId: 'troop-1',
          tasks: { create: [{ description: 'Zadanie 1', position: 0 }] },
        }),
      }),
    );
  });

  it('rejects duplicate templates', async () => {
    const { prisma, service } = createService();
    prisma.degreeTemplate.findUnique.mockResolvedValue({ id: 'existing' });

    await expect(service.create('troop-1', dto)).rejects.toThrow(
      new ConflictException('Templatka dla tego stopnia już istnieje.'),
    );
    expect(prisma.degreeTemplate.create).not.toHaveBeenCalled();
  });

  it('finds troop templates ordered with ordered tasks', async () => {
    const { prisma, service } = createService();
    prisma.degreeTemplate.findMany.mockResolvedValue([]);

    await service.findAll('troop-1');
    expect(prisma.degreeTemplate.findMany).toHaveBeenCalledWith({
      where: { troopId: 'troop-1' },
      include: { tasks: { orderBy: { position: 'asc' } } },
      orderBy: { degree: 'asc' },
    });
  });

  it('updates a template and removes omitted tasks', async () => {
    const { prisma, service } = createService();
    prisma.degreeTemplate.findFirst.mockResolvedValue({
      id: 'template-1',
      degree: Degree.DH,
      tasks: [{ id: 'task-1' }, { id: 'task-2' }],
    });
    prisma.degreeTemplate.update.mockResolvedValue({ id: 'template-1' });

    await service.update('troop-1', 'template-1', {
      tasks: [{ id: 'task-1', description: 'Nowy opis' }],
    });

    expect(prisma.degreeTemplateTask.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ['task-2'] }, templateId: 'template-1' },
    });
    expect(prisma.degreeTemplateTask.update).toHaveBeenCalledWith({
      where: { id: 'task-1' },
      data: { description: 'Nowy opis', position: 0 },
    });
  });

  it('rejects updating a missing template', async () => {
    const { prisma, service } = createService();
    prisma.degreeTemplate.findFirst.mockResolvedValue(null);

    await expect(service.update('troop-1', 'missing', {})).rejects.toThrow(
      new NotFoundException('Nie znaleziono templatki stopnia.'),
    );
  });
});
