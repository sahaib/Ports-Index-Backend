import prisma from '../lib/prisma';
import { logger } from '../utils/logger';
import { handleDatabaseError } from '../utils/dbErrorHandler';
import { formatCoordinates } from '../utils/coordinateUtils';
import { PortData } from '../types/port';

interface PortWithDistance extends PortData {
  distance: number;
}

export const findPortsByCountry = async (countryCode: string): Promise<PortData[]> => {
  try {
    const ports = await prisma.port.findMany({
      where: {
        countryCode: countryCode.toUpperCase()
      },
      orderBy: {
        name: 'asc'
      }
    });

    logger.info(`Found ${ports.length} ports for country ${countryCode}`);
    
    return ports.map(port => ({
      locode: port.locode,
      name: port.name,
      nameWoDiacritics: port.nameWoDiacritics,
      coordinates: formatCoordinates(port.latitude, port.longitude),
      latitude: port.latitude,
      longitude: port.longitude,
      subdivision: port.subdivision,
      function: port.function,
      status: port.status,
      countryCode: port.countryCode,
      date: port.unlocodeDate,
      iata: port.iata,
      remarks: port.remarks,
      type: 'port',
      updatedAt: port.updatedAt,
      createdAt: port.createdAt
    }));
  } catch (error) {
    throw handleDatabaseError(error);
  }
};

export const findPortsByCoordinates = async (
  lat: number,
  lon: number,
  radiusKm: number = 100
): Promise<PortData[]> => {
  // Using Haversine formula in Prisma query
  const earthRadiusKm = 6371;
  
  try {
    const ports = await prisma.$queryRaw<PortData[]>`
      SELECT *,
        ${earthRadiusKm} * acos(
          cos(radians(${lat})) * 
          cos(radians(latitude)) * 
          cos(radians(longitude) - radians(${lon})) + 
          sin(radians(${lat})) * 
          sin(radians(latitude))
        ) AS distance
      FROM "Port"
      WHERE ${earthRadiusKm} * acos(
        cos(radians(${lat})) * 
        cos(radians(latitude)) * 
        cos(radians(longitude) - radians(${lon})) + 
        sin(radians(${lat})) * 
        sin(radians(latitude))
      ) <= ${radiusKm}
      ORDER BY distance
      LIMIT 10
    `;

    return ports.map(port => ({
      ...port,
      coordinates: formatCoordinates(port.latitude, port.longitude)
    }));
  } catch (error) {
    throw handleDatabaseError(error);
  }
};

export const findNearbyPorts = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 30,
  limit: number = 10
): Promise<PortData[]> => {
  const earthRadiusKm = 6371; // Earth's radius in kilometers
  
  try {
    logger.info(`Searching for ports within ${radiusKm}km of ${latitude},${longitude}`);
    
    const ports = await prisma.$queryRaw<PortWithDistance[]>`
      SELECT 
        *,
        ${earthRadiusKm} * acos(
          cos(radians(${latitude})) * 
          cos(radians(latitude)) * 
          cos(radians(longitude) - radians(${longitude})) + 
          sin(radians(${latitude})) * 
          sin(radians(latitude))
        ) AS distance
      FROM "Port"
      WHERE ${earthRadiusKm} * acos(
        cos(radians(${latitude})) * 
        cos(radians(latitude)) * 
        cos(radians(longitude) - radians(${longitude})) + 
        sin(radians(${latitude})) * 
        sin(radians(latitude))
      ) <= ${radiusKm}
      ORDER BY distance ASC
      LIMIT ${limit}
    `;

    logger.info(`Found ${ports.length} ports within radius`);

    return ports.map(port => ({
      ...port,
      distance: Number(port.distance) // Convert distance to number
    }));
  } catch (error) {
    logger.error('Error finding nearby ports:', { error });
    throw handleDatabaseError(error);
  }
}; 