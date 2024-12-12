import express, { Express, Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import prisma from './lib/prisma';
import dotenv from 'dotenv';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

interface LocodeParams { locode: string }
interface QueryParams { name?: string; countryCode?: string; limit?: string }

app.get('/api/test-connection', async (req, res) => {
  try {
    await prisma.$connect();
    const count = await prisma.port.count();
    console.log('Port count:', count);
    res.json({ connected: true, portCount: count });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ connected: false, error: 'Database connection failed' });
  }
});

const getPortByLocode: RequestHandler<LocodeParams> = async (req, res) => {
  try {
    const port = await prisma.port.findUnique({
      where: { locode: req.params.locode.toUpperCase() }
    });
    if (!port) {
      res.status(404).json({ error: `Port with LOCODE ${req.params.locode} not found` });
    } else {
      res.json(port);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch port' });
  }
};

app.get('/api/ports/:locode', getPortByLocode);

const searchPorts: RequestHandler<{}, any, any, QueryParams> = async (req, res) => {
  const { name, countryCode, limit = '10' } = req.query;
  
  if (!name || !countryCode) {
    res.status(400).json({ error: 'Name and country code are required' });
  } else {
    try {
      const ports = await prisma.port.findMany({
        where: {
          AND: [
            { countryCode: String(countryCode).toUpperCase() },
            {
              OR: [
                { name: { contains: String(name), mode: 'insensitive' } },
                { nameWoDiacritics: { contains: String(name), mode: 'insensitive' } }
              ]
            }
          ]
        },
        take: parseInt(String(limit)),
        orderBy: { name: 'asc' }
      });
      res.json(ports);
    } catch (error) {
      console.error('Port search error:', error);
      res.status(500).json({ error: 'Failed to search ports' });
    }
  }
};

app.get('/api/ports', searchPorts);

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
}); 