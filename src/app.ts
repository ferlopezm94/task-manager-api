import express from 'express';

import './db/mongoose';
import { UserModel } from './models/user';
import { TaskModel } from './models/task';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('', (_req, res) => {
  res.send('Task Manager REST API');
});

// Users

app.post('/users', async (req, res) => {
  const user = new UserModel(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(400).send(error);
  }
});

app.get('/users', async (_req, res) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(500).send();
  }
});

app.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await UserModel.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(500).send();
  }
});

app.patch('/users/:id', async (req, res) => {
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid to perform the updates sent.' });
  }

  try {
    const _id = req.params.id;
    const user = await UserModel.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(400).send(error);
  }
});

// Tasks

app.post('/tasks', async (req, res) => {
  const task = new TaskModel(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(400).send(error);
  }
});

app.get('/tasks', async (_req, res) => {
  try {
    const tasks = await TaskModel.find({});
    res.send(tasks);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(500).send();
  }
});

app.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await TaskModel.findById(_id);

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(500).send();
  }
});

app.listen(port, () => console.log(`Server is up and running on port ${port}`));
