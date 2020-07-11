import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import validator from 'validator';

type Token = {
  token: string;
};

export interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  age: number;
  tokens: Token[];
  generateAuthToken(): string;
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
    unique: true,
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

UserSchema.methods.toJSON = function () {
  const user = this as User;
  const userObject = user.toObject() as User;

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

UserSchema.methods.generateAuthToken = async function () {
  const user = this as User;
  const token = jwt.sign({ _id: user._id.toString() }, 'mysecret');

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

UserSchema.statics.findByCredentials = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error('Unable to login.');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login.');
  }

  return user;
};

// Hash the plain text password before saving
UserSchema.pre('save', async function (next) {
  const user = this as User;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

interface IUserModel extends mongoose.Model<User> {
  findByCredentials(email: string, password: string): User;
}

export const UserModel = mongoose.model<User, IUserModel>('User', UserSchema);
