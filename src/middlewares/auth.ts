import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { User } from './../users/interface';
import { UserModel } from './../users/model';

declare module 'express-serve-static-core' {
  interface Request {
    user: User;
    token: string;
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as Payload;
    const user = await UserModel.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.log('auth error :>> ', error.message);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};
