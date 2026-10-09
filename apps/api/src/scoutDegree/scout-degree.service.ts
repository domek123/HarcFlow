import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Prisma,
  ScoutDegreeStatus,
  ScoutDegreeTaskSource,
  ScoutDegreeTaskStatus,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateScoutDegreeDto } from './dto/create-scout-degree.dto';
import { CreateScoutDegreeTaskDto } from './dto/create-scout-degree-task.dto';
import { UpdateScoutDegreeTaskDto } from './dto/update-scout-degree-task.dto';
import { degreeRank } from '../common/constants';

const taskInclude = {
  degree: {
    select: {
      id: true,
      degree: true,
      description: true,
    },
  },

  tasks: {
    orderBy: {
      position: 'asc' as const,
    },
  },
};

@Injectable()
export class ScoutDegreeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(scoutId: string) {
    return this.prisma.scoutDegree.findMany({
      where: {
        scoutId,
      },
      include: taskInclude,
      orderBy: [
        {
          status: 'asc',
        },
        {
          startedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });
  }

  async create(scoutId: string, dto: CreateScoutDegreeDto) {
    const [scout, template] = await Promise.all([
      this.prisma.scoutProfile.findUnique({
        where: { id: scoutId },
        select: { degree: true },
      }),

      this.prisma.degreeTemplate.findFirst({
        where: {
          id: dto.templateId,
          isActive: true,
        },
        include: {
          tasks: {
            orderBy: { position: 'asc' },
          },
        },
      }),
    ]);

    if (!scout) {
      throw new NotFoundException('Nie znaleziono harcerza.');
    }

    if (!template) {
      throw new NotFoundException('Nie znaleziono aktywnego szablonu.');
    }

    if (degreeRank[scout.degree] > degreeRank[template.degree]) {
      throw new BadRequestException(
        'Nie można utworzyć próby na stopień niższy niż aktualnie zdobyty stopień harcerza.',
      );
    }

    const existing = await this.prisma.scoutDegree.findUnique({
      where: {
        scoutId_degreeId: {
          scoutId,
          degreeId: template.id,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Ten harcerz posiada już próbę na ten stopień.',
      );
    }

    return this.prisma.scoutDegree.create({
      data: {
        scoutId,
        degreeId: template.id,
        status: ScoutDegreeStatus.PREPARED,

        tasks: {
          create: template.tasks.map((task) => ({
            description: task.description,
            position: task.position,
            source: ScoutDegreeTaskSource.TEMPLATE,
            status: ScoutDegreeTaskStatus.TODO,
          })),
        },
      },

      include: taskInclude,
    });
  }

  async createTask(scoutDegreeId: string, dto: CreateScoutDegreeTaskDto) {
    const last = await this.prisma.scoutDegreeTask.aggregate({
      where: {
        scoutDegreeId,
      },

      _max: {
        position: true,
      },
    });

    const position = dto.position ?? (last._max.position ?? -1) + 1;

    return this.prisma.scoutDegreeTask.create({
      data: {
        scoutDegreeId,
        description: dto.description,
        position,
        source: ScoutDegreeTaskSource.INDIVIDUAL,
        status: ScoutDegreeTaskStatus.TODO,
      },
    });
  }

  async updateTask(taskId: string, dto: UpdateScoutDegreeTaskDto) {
    return this.prisma.scoutDegreeTask.update({
      where: {
        id: taskId,
      },

      data: dto,
    });
  }

  async deleteTask(taskId: string) {
    const task = await this.getTask(taskId);

    if (task.source !== ScoutDegreeTaskSource.INDIVIDUAL) {
      throw new BadRequestException(
        'Zadania pochodzącego z szablonu nie można usunąć.',
      );
    }

    return this.prisma.scoutDegreeTask.delete({
      where: {
        id: taskId,
      },
    });
  }

  async open(scoutDegreeId: string) {
    const degree = await this.getDegree(scoutDegreeId);

    if (degree.status === ScoutDegreeStatus.IN_PROGRESS) {
      return degree;
    }

    const openedDegree = await this.prisma.scoutDegree.findFirst({
      where: {
        scoutId: degree.scoutId,
        status: ScoutDegreeStatus.IN_PROGRESS,
      },
      select: {
        id: true,
      },
    });

    if (openedDegree) {
      throw new ConflictException(
        'Harcerz ma już otwartą inną próbę. Najpierw ją zakończ.',
      );
    }

    if (degree.tasks.length === 0) {
      throw new BadRequestException(
        'Nie można otworzyć próby, która nie ma żadnych zadań.',
      );
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const updatedDegree = await tx.scoutDegree.update({
          where: {
            id: scoutDegreeId,
          },
          data: {
            status: ScoutDegreeStatus.IN_PROGRESS,
            startedAt: degree.startedAt ?? new Date(),
          },
          include: taskInclude,
        });

        await tx.scoutProfile.update({
          where: {
            id: degree.scout.id,
          },
          data: {
            acquiringDegree: degree.degree.degree,
          },
        });

        return updatedDegree;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Harcerz ma już otwartą inną próbę. Najpierw ją zakończ.',
        );
      }

      throw error;
    }
  }

  async complete(scoutDegreeId: string, orderNumber: string) {
    const degree = await this.getDegree(scoutDegreeId);

    if (degree.status === ScoutDegreeStatus.COMPLETED) {
      return degree;
    }

    if (degree.status === ScoutDegreeStatus.PREPARED) {
      throw new BadRequestException(
        'Nie można ukończyć próby, która nie została rozpoczęta.',
      );
    }

    const hasIncompleteTasks = degree.tasks.some(
      (task) => task.status !== ScoutDegreeTaskStatus.APPROVED,
    );

    if (degree.tasks.length === 0 || hasIncompleteTasks) {
      throw new BadRequestException(
        'Nie można ukończyć próby, dopóki wszystkie zadania nie są zatwierdzone.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedDegree = await tx.scoutDegree.update({
        where: {
          id: scoutDegreeId,
        },
        data: {
          status: ScoutDegreeStatus.COMPLETED,
          completedAt: new Date(),
          orderNumber,
        },
        include: taskInclude,
      });

      await tx.scoutProfile.update({
        where: {
          id: degree.scout.id,
        },
        data: {
          degree: degree.degree.degree,
        },
      });

      return updatedDegree;
    });
  }

  async deleteScoutDegree(scoutDegreeId: string) {
    return this.prisma.scoutDegree.delete({
      where: {
        id: scoutDegreeId,
      },
    });
  }

  private async getDegree(scoutDegreeId: string) {
    const degree = await this.prisma.scoutDegree.findFirst({
      where: {
        id: scoutDegreeId,
      },

      include: {
        degree: true,
        tasks: {
          select: {
            status: true,
          },
        },

        scout: {
          select: {
            id: true,
            degree: true,
          },
        },
      },
    });

    if (!degree) {
      throw new NotFoundException('Nie znaleziono próby tego harcerza.');
    }

    return degree;
  }

  private async getTask(taskId: string) {
    const task = await this.prisma.scoutDegreeTask.findFirst({
      where: {
        id: taskId,
      },

      include: {
        scoutDegree: {
          include: {
            degree: true,

            scout: {
              select: {
                id: true,
                degree: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Nie znaleziono zadania w tej próbie.');
    }

    return task;
  }
}
