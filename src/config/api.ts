import express from 'express';
import { findPortByLocode } from '../services/portService';

export const router = express.Router();

router.get('/test-connection', (req, res) => {
  res.json({ status: 'ok' });
});

router.get('/ports/:locode', async (req, res, next) => {
  try {
    const port = await findPortByLocode(req.params.locode);
    res.json({ port });
  } catch (error) {
    next(error);
  }
});

export const API_BASE_URL = 'https://ports-index-backend.vercel.app';
export const API_ENDPOINTS = {
  TEST_CONNECTION: '/api/test-connection',
  FIND_PORT: (locode: string) => `/api/ports/${locode}`,
  SEARCH_PORTS: '/api/ports',
  NEARBY_PORTS: '/api/ports/nearby'
} as const; 