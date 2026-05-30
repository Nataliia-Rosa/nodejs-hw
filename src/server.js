import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';

import { connectMongoDB } from './db/connectMongoDB.js';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const bootstrap = async () => {
  await connectMongoDB();

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.get('/', (req, res) => {
    res.json({
      message: 'Server is running',
    });
  });

  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(cookieParser());
  app.use(logger);

  app.use(authRouter);
  app.use(notesRouter);

  app.use(notFoundHandler);
  app.use(errors());
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap();
