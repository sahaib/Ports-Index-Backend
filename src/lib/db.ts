import { Pool, QueryConfig } from 'pg';
import { PortData } from '../types/port';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function findNearbyPorts(
  lat: number,
  lon: number,
  radius: number = 30,
  limit: number = 10
): Promise<PortData[]> {
  console.log('Finding ports:', { lat, lon, radius, limit });

  // First ensure extensions are installed
  await pool.query('CREATE EXTENSION IF NOT EXISTS cube;');
  await pool.query('CREATE EXTENSION IF NOT EXISTS earthdistance;');

  const query = `
    SELECT 
      locode,
      name,
      name_wo_diacritics as "nameWoDiacritics",
      CAST(latitude AS FLOAT) as latitude,
      CAST(longitude AS FLOAT) as longitude,
      subdivision,
      function,
      status,
      country_code as "countryCode",
      date,
      iata,
      remarks,
      point($1, $2) <@> point(latitude, longitude) as distance
    FROM ports
    WHERE 
      latitude IS NOT NULL 
      AND longitude IS NOT NULL
      AND point($1, $2) <@> point(latitude, longitude) <= $3
    ORDER BY distance
    LIMIT $4;
  `;

  const result = await pool.query(query, [lat, lon, radius, limit]);
  console.log(`Found ${result.rows.length} ports`);

  return result.rows.map(port => ({
    ...port,
    type: 'port' as const,
    lat: Number(port.latitude),
    lon: Number(port.longitude),
    latitude: Number(port.latitude),
    longitude: Number(port.longitude),
    distance: Number(port.distance)
  }));
} 