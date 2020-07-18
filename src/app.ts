import express from 'express';

import './db/mongoose';
import userRouter from './routers/user';
import taskRouter from './routers/task';

export const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.get('', (_req, res) => {
  res.send('Task Manager REST API');
});
