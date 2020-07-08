import express from 'express';

import { TaskModel } from './../models/task';

const router = express.Router();

router.post('/tasks', async (req, res) => {
  const task = new TaskModel(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(400).send(error);
  }
});

router.get('/tasks', async (_req, res) => {
  try {
    const tasks = await TaskModel.find({});
    res.send(tasks);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(500).send();
  }
});

router.get('/tasks/:id', async (req, res) => {
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

router.patch('/tasks/:id', async (req, res) => {
  const allowedUpdates = ['description', 'completed'];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid to perform the updates sent.' });
  }

  try {
    const _id = req.params.id;
    const task = await TaskModel.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(400).send(error);
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await TaskModel.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(500).send();
  }
});

export default router;
