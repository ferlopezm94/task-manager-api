import express from 'express';

import { auth } from './../middleware/auth';
import { UserModel } from './../models/user';

const router = express.Router();

router.post('/users', async (req, res) => {
  const user = new UserModel(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    console.log('error :>> ', error);
    res.status(400).send(error);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await UserModel.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    console.log('error :>> ', error);
    res.status(400).send();
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.send();
  } catch (error) {
    console.log('error :>> ', error);
    res.status(500).send();
  }
});

router.post('/users/logout-all', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    console.log('error :>> ', error);
    res.status(500).send();
  }
});

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

router.get('/users/:id', async (req, res) => {
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

router.patch('/users/:id', async (req, res) => {
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid to perform the updates sent.' });
  }

  try {
    const _id = req.params.id;
    const user = await UserModel.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    // eslint-disable-next-line
    // @ts-ignore
    updates.forEach(update => (user[update] = req.body[update]));
    await user.save();

    res.send(user);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(400).send(error);
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(500).send();
  }
});

export default router;
