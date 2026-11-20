import 'dotenv/config';
import express from 'express';
import {pool} from './db/index.js'

import userRouter from './routes/user.routes.js'
import urlRouter from './routes/url.routes.js'
import { authenticationMiddleware } from './middlewares/auth.middleware.js';
const app = express();

const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(authenticationMiddleware)



app.get('/', (req, res)=>{
    return res.status(200).json({
        status : 'Server is up and running'
    })

});

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    return res.status(200).json({
      status: 'healthy',
      database: 'connected',
    });
  } catch (error) {
    console.error('Health check failed:', error);

    return res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
    });
  }
});
app.use(urlRouter)

app.use('/user', userRouter)


const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

let isShuttingDown = false;

async function shutdown(signal) {
  if (isShuttingDown) return;

  isShuttingDown = true;
  console.log(`${signal} received. Starting graceful shutdown...`);

  // Safety timeout: don't allow shutdown to hang indefinitely.
  const forceExitTimer = setTimeout(() => {
    console.error('Graceful shutdown timed out.');
    process.exit(1);
  }, 10000);

  forceExitTimer.unref();

  // First stop accepting requests and wait for active requests.
  server.close(async (error) => {
    if (error) {
      console.error('HTTP server shutdown error:', error);
      process.exitCode = 1;
    }

    try {
      // Then close PostgreSQL connections.
      await pool.end();
      console.log('PostgreSQL connection pool closed.');
    } catch (dbError) {
      console.error('Database shutdown error:', dbError);
      process.exitCode = 1;
    } finally {
      clearTimeout(forceExitTimer);
      console.log('Application shutdown complete.');
    }
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
