import mongoose from 'mongoose';

type Token = {
  token: string;
};

export interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  age: number;
  tokens: Token[];
  avatar?: Buffer;
  generateAuthToken(): string;
}
