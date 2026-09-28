import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class DegreeTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(troopId: string, dto: CreateTemplateDto) {
    const existing = await this.prisma.degreeTemplate.findUnique({
      where: {
        troopId_degree: {
          troopId,
          degree: dto.degree,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Templatka dla tego stopnia już istnieje.');
    }

    return this.prisma.degreeTemplate.create({
      data: {
        troopId,
        degree: dto.degree,
        tasks: {
          create: dto.tasks.map((task, index) => ({
            description: task.description,
            position: index,
          })),
        },
      },
      include: {
        tasks: {
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  async findAll(troopId: string) {
    return this.prisma.degreeTemplate.findMany({
      where: { troopId },
      include: {
        tasks: {
          orderBy: { position: 'asc' },
        },
      },
      orderBy: {
        degree: 'asc',
      },
    });
  }

  async update(troopId: string, id: string, dto: UpdateTemplateDto) {
    return this.prisma.$transaction(async (tx) => {
      const template = await tx.degreeTemplate.findFirst({
        where: {
          id,
          troopId,
        },
        include: {
          tasks: {
            select: { id: true },
          },
        },
      });

      if (!template) {
        throw new NotFoundException('Nie znaleziono templatki stopnia.');
      }

      const nextDegree = dto.degree ?? template.degree;

      if (dto.degree !== undefined) {
        const duplicate = await tx.degreeTemplate.findFirst({
          where: {
            troopId,
            degree: nextDegree,
            id: { not: id },
          },
          select: { id: true },
        });

        if (duplicate) {
          throw new ConflictException(
            'Templatka dla tego stopnia już istnieje.',
          );
        }
      }

      if (dto.tasks !== undefined) {
        const existingTaskIds = new Set(template.tasks.map((task) => task.id));

        const submittedIds = dto.tasks
          .map((task) => task.id)
          .filter((taskId): taskId is string => taskId !== undefined);

        if (new Set(submittedIds).size !== submittedIds.length) {
          throw new BadRequestException(
            'To samo zadanie zostało przesłane więcej niż raz.',
          );
        }

        const invalidIds = submittedIds.filter(
          (taskId) => !existingTaskIds.has(taskId),
        );

        if (invalidIds.length > 0) {
          throw new BadRequestException(
            'Jedno lub więcej zadań nie należy do tej templatki.',
          );
        }

        const submittedIdSet = new Set(submittedIds);

        const idsToDelete = [...existingTaskIds].filter(
          (taskId) => !submittedIdSet.has(taskId),
        );

        if (idsToDelete.length > 0) {
          await tx.degreeTemplateTask.deleteMany({
            where: {
              id: { in: idsToDelete },
              templateId: id,
            },
          });
        }

        for (const [index, task] of dto.tasks.entries()) {
          const data = {
            description: task.description,
            position: index,
          };

          if (task.id) {
            await tx.degreeTemplateTask.update({
              where: {
                id: task.id,
              },
              data,
            });
          } else {
            await tx.degreeTemplateTask.create({
              data: {
                ...data,
                templateId: id,
              },
            });
          }
        }
      }

      return tx.degreeTemplate.update({
        where: { id },
        data: {
          ...(dto.degree !== undefined && { degree: dto.degree }),
        },
        include: {
          tasks: {
            orderBy: { position: 'asc' },
          },
        },
      });
    });
  }
}
