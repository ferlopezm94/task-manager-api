import mongoose from 'mongoose';

export interface Task extends mongoose.Document {
  description: string;
  completed: boolean;
  owner: mongoose.Schema.Types.ObjectId;
}
