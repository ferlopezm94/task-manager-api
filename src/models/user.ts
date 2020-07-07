import mongoose from 'mongoose';
import validator from 'validator';

interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  age: number;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator(value: string) {
        return validator.isEmail(value);
      },
      message: 'Email is invalid',
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate: {
      validator(value: string) {
        return !value.toLowerCase().includes('password');
      },
      message: 'Password cannot contain "password"',
    },
  },
  age: {
    type: Number,
    default: 0,
    validate: {
      validator(value: number) {
        return value >= 0;
      },
      message: 'Age must be a positive number',
    },
  },
});

export const UserModel = mongoose.model<User>('User', UserSchema);
