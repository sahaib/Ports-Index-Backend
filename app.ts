import express from 'express';
import cors from 'cors';
import { rateLimiter, validateApiKey, securityHeaders } from './middleware/security';
import { env } from './config/env';
import { portRoutes } from './src/routes/ports';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logging';
import { monitorAuth } from './middleware/authMonitoring';

const app = express();

// Parse JSON bodies
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: env.ALLOWED_ORIGINS.split(','),
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
  maxAge: 86400
}));

// Security middleware
app.use(securityHeaders);
app.use(rateLimiter);

// API routes with authentication
app.use('/api', validateApiKey, portRoutes);

// Error handling
app.use(errorHandler);

app.use(requestLogger);
app.use(monitorAuth);

export default app; 