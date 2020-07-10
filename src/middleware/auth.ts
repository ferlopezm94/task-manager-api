import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { User, UserModel } from './../models/user';

declare module 'express-serve-static-core' {
  interface Request {
    user: User;
  }
}

interface Payload {
  _id: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.header('Authorization');

    if (!token) {
      throw new Error();
    }

    token = token.replace('Bearer ', '');
    const decoded = jwt.verify(token, 'mysecret') as Payload;
    const user = await UserModel.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('error :>> ', error);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};
