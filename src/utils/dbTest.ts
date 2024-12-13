import { logger } from '../utils/logger';
import { testDatabaseConnection as apiTestConnection } from '../api/db';

export async function testDatabaseConnection() {
  try {
    const connected = await apiTestConnection();
    if (connected) {
      logger.info('✅ Database connected successfully');
    } else {
      logger.error('❌ Database connection failed');
    }
    return connected;
  } catch (error) {
    logger.error('❌ Database connection failed:', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    return false;
  }
} 