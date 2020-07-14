import express from 'express';

import './db/mongoose';
import userRouter from './routers/user';
import taskRouter from './routers/task';

const app = express();
const port = process.env.PORT || '';

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.get('', (_req, res) => {
  res.send('Task Manager REST API');
});

app.listen(port, () => console.log(`Server is up and running on port ${port}`));
