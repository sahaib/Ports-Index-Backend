import prisma from '../lib/prisma';

export const findPortByLocode = async (locode: string) => {
  return prisma.port.findUnique({
    where: { locode: locode.toUpperCase() }
  });
};

export const searchPortsByName = async (name: string, countryCode: string) => {
  return prisma.port.findMany({
    where: {
      name: { contains: name, mode: 'insensitive' },
      countryCode: countryCode.toUpperCase()
    }
  });
};
