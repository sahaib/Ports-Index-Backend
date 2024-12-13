import { Router } from 'express';
import { findNearbyPorts } from '../lib/db';

const router = Router();

router.get('/nearby', async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    const radius = Number(req.query.radius) || 30;
    
    if (isNaN(lat) || isNaN(lon)) {
      res.status(400).json({ error: 'Invalid coordinates' });
      return;
    }

    const ports = await findNearbyPorts(lat, lon, radius);
    res.json({ ports });
    
  } catch (error) {
    console.error('Nearby ports error:', error);
    res.status(500).json({ error: 'Failed to fetch nearby ports' });
  }
});

export { router }; 