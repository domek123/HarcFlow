import { Degree } from '@prisma/client';

export const degreeRank: Record<Degree, number> = {
  NONE: 0,
  DH: 1,
  ML: 2,
  WYW: 3,
  CW: 4,
  HO: 5,
  HR: 6,
};
