import prisma  from '../lib/prisma';
import { PortData } from '../types/port';

export async function findNearbyPorts(
  lat: number,
  lon: number,
  radius: number = 30,
  limit: number = 10
): Promise<PortData[]> {
  console.log('Finding ports:', { lat, lon, radius, limit });

  try {
    // Convert radius to approximate degrees (1 degree ≈ 111 km)
    const degreeRadius = radius / 111;

    const ports = await prisma.port.findMany({
      where: {
        AND: [
          { latitude: { gte: lat - degreeRadius } },
          { latitude: { lte: lat + degreeRadius } },
          { longitude: { gte: lon - degreeRadius } },
          { longitude: { lte: lon + degreeRadius } }
        ]
      },
      take: limit
    });

    // Calculate actual distances and filter
    return ports
      .map((port: PortData) => {
        const distance = calculateHaversineDistance(
          lat,
          lon,
          port.latitude,
          port.longitude
        );
        return { ...port, distance };
      })
      .filter((port: PortData) => port.distance! <= radius)
      .sort((a: PortData, b: PortData) => a.distance! - b.distance!)
      .slice(0, limit);
  } catch (error) {
    console.error('Error finding nearby ports:', error);
    throw error;
  }
}

function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
} 