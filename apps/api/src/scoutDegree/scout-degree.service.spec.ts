import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Degree,
  ScoutDegreeStatus,
  ScoutDegreeTaskSource,
  ScoutDegreeTaskStatus,
} from '@prisma/client';

import { ScoutDegreeService } from './scout-degree.service';

describe('ScoutDegreeService', () => {
  function createService() {
    const prisma = {
      scoutDegree: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
        findUniqueOrThrow: jest.fn(),
      },
      scoutDegreeTask: {
        aggregate: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        delete: jest.fn(),
      },
      scoutProfile: { findUnique: jest.fn(), update: jest.fn() },
      degreeTemplate: { findFirst: jest.fn() },
      $queryRaw: jest.fn(),
      $transaction: jest.fn(),
    };
    prisma.$transaction.mockImplementation((callback) =>
      typeof callback === 'function' ? callback(prisma) : undefined,
    );
    return { prisma, service: new ScoutDegreeService(prisma as never) };
  }

  it('finds degrees for a scout', async () => {
    const { prisma, service } = createService();
    prisma.scoutDegree.findMany.mockResolvedValue([]);
    await service.findAll('scout-1');
    expect(prisma.scoutDegree.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { scoutId: 'scout-1' } }),
    );
  });

  it('creates a prepared degree from an active template', async () => {
    const { prisma, service } = createService();
    prisma.scoutProfile.findUnique.mockResolvedValue({ degree: Degree.NONE });
    prisma.degreeTemplate.findFirst.mockResolvedValue({
      id: 'template-1',
      degree: Degree.DH,
      tasks: [{ description: 'Task', position: 0 }],
    });
    prisma.scoutDegree.findUnique.mockResolvedValue(null);
    prisma.scoutDegree.create.mockResolvedValue({ id: 'degree-1' });

    await expect(
      service.create('scout-1', { templateId: 'template-1' }),
    ).resolves.toEqual({ id: 'degree-1' });
    expect(prisma.scoutDegree.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: ScoutDegreeStatus.PREPARED,
          tasks: {
            create: [
              {
                description: 'Task',
                position: 0,
                source: ScoutDegreeTaskSource.TEMPLATE,
                status: ScoutDegreeTaskStatus.TODO,
              },
            ],
          },
        }),
      }),
    );
  });

  it('rejects creating a degree when the scout or template is missing', async () => {
    const { prisma, service } = createService();
    prisma.scoutProfile.findUnique.mockResolvedValue(null);
    prisma.degreeTemplate.findFirst.mockResolvedValue(null);

    await expect(service.create('scout-1', { templateId: 'missing' })).rejects.toThrow(
      new NotFoundException('Nie znaleziono harcerza.'),
    );
  });

  it('creates individual tasks at the next position', async () => {
    const { prisma, service } = createService();
    prisma.scoutDegreeTask.aggregate.mockResolvedValue({ _max: { position: 2 } });
    prisma.scoutDegreeTask.create.mockResolvedValue({ id: 'task-1' });

    await service.createTask('degree-1', { description: 'New task' });
    expect(prisma.scoutDegreeTask.create).toHaveBeenCalledWith({
      data: {
        scoutDegreeId: 'degree-1',
        description: 'New task',
        position: 3,
        source: ScoutDegreeTaskSource.INDIVIDUAL,
        status: ScoutDegreeTaskStatus.TODO,
      },
    });
  });

  it('updates and deletes only individual tasks', async () => {
    const { prisma, service } = createService();
    prisma.scoutDegreeTask.update.mockResolvedValue({ id: 'task-1' });
    prisma.scoutDegreeTask.findFirst.mockResolvedValue({
      source: ScoutDegreeTaskSource.INDIVIDUAL,
    });
    prisma.scoutDegreeTask.delete.mockResolvedValue({ id: 'task-1' });

    await service.updateTask('task-1', { description: 'Updated' });
    await expect(service.deleteTask('task-1')).resolves.toEqual({ id: 'task-1' });
    expect(prisma.scoutDegreeTask.update).toHaveBeenCalledWith({
      where: { id: 'task-1' },
      data: { description: 'Updated' },
    });
  });

  it('rejects deleting a template task', async () => {
    const { prisma, service } = createService();
    prisma.scoutDegreeTask.findFirst.mockResolvedValue({
      source: ScoutDegreeTaskSource.TEMPLATE,
    });

    await expect(service.deleteTask('task-1')).rejects.toThrow(
      new BadRequestException('Zadania pochodzącego z szablonu nie można usunąć.'),
    );
  });

  it('opens a prepared degree and updates the scout acquisition', async () => {
    const { prisma, service } = createService();
    prisma.scoutDegree.findFirst
      .mockResolvedValueOnce({
        status: ScoutDegreeStatus.PREPARED,
        scoutId: 'scout-1',
        startedAt: null,
        tasks: [{ status: ScoutDegreeTaskStatus.TODO }],
        scout: { id: 'scout-1' },
        degree: { degree: Degree.DH },
      })
      .mockResolvedValueOnce(null);
    prisma.scoutDegree.update.mockResolvedValue({ id: 'degree-1' });

    await service.open('degree-1');
    expect(prisma.scoutProfile.update).toHaveBeenCalledWith({
      where: { id: 'scout-1' },
      data: { acquiringDegree: Degree.DH },
    });
  });

  it('returns an already open degree unchanged', async () => {
    const { prisma, service } = createService();
    const degree = {
      status: ScoutDegreeStatus.IN_PROGRESS,
      tasks: [{ status: ScoutDegreeTaskStatus.TODO }],
    };
    prisma.scoutDegree.findFirst.mockResolvedValue(degree);
    await expect(service.open('degree-1')).resolves.toBe(degree);
  });

  it('completes an in-progress degree when every task is approved', async () => {
    const { prisma, service } = createService();
    prisma.scoutDegree.findUnique.mockResolvedValue({
      status: ScoutDegreeStatus.IN_PROGRESS,
      tasks: [{ status: ScoutDegreeTaskStatus.APPROVED }],
      scout: { id: 'scout-1' },
      degree: { degree: Degree.DH },
    });
    prisma.scoutDegree.updateMany.mockResolvedValue({ count: 1 });
    prisma.scoutDegree.findUniqueOrThrow.mockResolvedValue({ id: 'degree-1' });

    await expect(service.complete('degree-1', '12')).resolves.toEqual({ id: 'degree-1' });
    expect(prisma.scoutProfile.update).toHaveBeenCalledWith({
      where: { id: 'scout-1' },
      data: { degree: Degree.DH },
    });
  });

  it('rejects completing a prepared degree', async () => {
    const { prisma, service } = createService();
    prisma.scoutDegree.findUnique.mockResolvedValue({
      status: ScoutDegreeStatus.PREPARED,
      tasks: [],
      scout: { id: 'scout-1' },
      degree: { degree: Degree.DH },
    });

    await expect(service.complete('degree-1', '12')).rejects.toThrow(
      new BadRequestException('Nie można ukończyć próby, która nie została rozpoczęta.'),
    );
  });

  it('deletes a scout degree', async () => {
    const { prisma, service } = createService();
    prisma.scoutDegree.delete.mockResolvedValue({ id: 'degree-1' });
    await expect(service.deleteScoutDegree('degree-1')).resolves.toEqual({ id: 'degree-1' });
  });
});
