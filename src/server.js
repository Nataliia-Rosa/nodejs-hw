import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

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
  // app.use(logger);

  app.use('/auth', authRouter);
  app.use('/notes', notesRouter);
  app.use('/users', userRouter);

  app.use(errors());
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap();
