import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import notesRouter from './routes/notesRoutes.js';

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(logger);
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Notes API is running',
  });
});

app.use(notesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
