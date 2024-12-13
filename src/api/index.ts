import express from 'express';
import { nearbyPortsRouter } from './routes/nearbyPorts';

export const app = express();
app.use('/api/ports', nearbyPortsRouter); 