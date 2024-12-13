import { RequestHandler, Router } from 'express';
import { findNearbyPorts } from '../../lib/db';
import { logger } from '../../utils/logger';

const nearbyPortsRouter = Router();

const getNearbyPorts: RequestHandler = async (req, res) => {
    try {
      const { lat, lon, radius = 30, limit = 10 } = req.body;  // Changed from req.query to req.body
  
      if (!lat || !lon) {
        res.status(400).json({ error: 'Latitude and longitude are required' });
        return;
      }
  
      const latitude = Number(lat);
      const longitude = Number(lon);
      const radiusKm = Number(radius);
      const limitNum = Number(limit);
  
      if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusKm)) {
        res.status(400).json({ error: 'Invalid coordinates or radius' });
        return;
      }
  
      const ports = await findNearbyPorts(latitude, longitude, radiusKm, limitNum);
      res.json({ ports });
      
    } catch (error) {
      logger.error('Nearby ports error:', { error });
      res.status(500).json({ error: 'Failed to fetch nearby ports' });
    }
  };
  
  nearbyPortsRouter.post('/nearby', getNearbyPorts);  // Changed to .post

export { nearbyPortsRouter }; 