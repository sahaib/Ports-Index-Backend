import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { endpoint, params } = req.query;
  
  if (!endpoint || typeof endpoint !== 'string') {
    return res.status(400).json({ error: 'Invalid endpoint' });
  }

  const mapboxToken = process.env.VITE_MAPBOX_TOKEN;
  const url = `https://api.mapbox.com/${endpoint}?access_token=${mapboxToken}&${params}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from Mapbox' });
  }
} 