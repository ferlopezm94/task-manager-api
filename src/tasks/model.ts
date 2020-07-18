import mongoose from 'mongoose';

interface Task extends mongoose.Document {
  description: string;
  completed: boolean;
}

const TaskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

export const TaskModel = mongoose.model<Task>('Task', TaskSchema);
