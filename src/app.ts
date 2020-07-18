import express from 'express';

import './db/mongoose';
import taskRouter from './routers/task';
import usersController from './users/controller';

export const app = express();

app.use(express.json());
app.use(taskRouter);
app.use(usersController);

app.get('', (_req, res) => {
  res.send('Task Manager REST API');
});
