import express from 'express';

import './utils/mongoose';
import tasksController from './tasks/controller';
import usersController from './users/controller';

export const app = express();

app.use(express.json());
app.use(tasksController);
app.use(usersController);

app.get('', (_req, res) => {
  res.send('Task Manager REST API');
});
