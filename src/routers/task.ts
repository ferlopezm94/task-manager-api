import express from 'express';

import { TaskModel } from './../models/task';
import { auth } from './../middleware/auth';
const router = express.Router();

router.post('/tasks', auth, async (req, res) => {
  const task = new TaskModel({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(400).send(error);
  }
});

router.get('/tasks', auth, async (req, res) => {
  const match: { completed?: boolean } = {};
  const { completed, limit, skip } = req.query;

  if (completed) {
    match.completed = completed === 'true';
  }

  try {
    await req.user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(limit as string),
          skip: parseInt(skip as string),
        },
      })
      .execPopulate();
    // eslint-disable-next-line
    // @ts-ignore
    res.send(req.user.tasks);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(500).send();
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await TaskModel.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(500).send();
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const allowedUpdates = ['description', 'completed'];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid to perform the updates sent.' });
  }

  try {
    const _id = req.params.id;
    const task = await TaskModel.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    // eslint-disable-next-line
    // @ts-ignore
    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(400).send(error);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await TaskModel.findOneAndDelete({ _id, owner: req.user._id });

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
