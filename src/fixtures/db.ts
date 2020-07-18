import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { UserModel } from './../users/model';
import { TaskModel } from './../tasks/model';

export const userOneId = new mongoose.Types.ObjectId();
export const userOne = {
  _id: userOneId,
  name: 'Mike',
  email: 'mike@example.com',
  password: 'Welcome152!',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET || ''),
    },
  ],
};

export const userTwoId = new mongoose.Types.ObjectId();
export const userTwo = {
  _id: userTwoId,
  name: 'Arthur',
  email: 'arthur@example.com',
  password: 'BlueHouse12@4',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET || ''),
    },
  ],
};

export const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First test task',
  completed: false,
  owner: userOne._id,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second test task',
  completed: true,
  owner: userOne._id,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third test task',
  completed: false,
  owner: userTwo._id,
};

export const setupDatabase = async () => {
  await UserModel.deleteMany({});
  await TaskModel.deleteMany({});
  await new UserModel(userOne).save();
  await new UserModel(userTwo).save();
  await new TaskModel(taskOne).save();
  await new TaskModel(taskTwo).save();
  await new TaskModel(taskThree).save();
};
