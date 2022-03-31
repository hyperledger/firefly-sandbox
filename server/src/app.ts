import * as express from 'express';
import apiRouter from './routers/api';

export const app = express();

app.use('/api', apiRouter);
