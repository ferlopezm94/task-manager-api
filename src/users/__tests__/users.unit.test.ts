import request from 'supertest';

import { UserModel } from './../model';
import { userOne, userOneId, setupDatabase } from './../../__tests__/fixtures/db';
import { app } from './../../app';

// User tests ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated

describe('User tests', () => {
  beforeEach(setupDatabase);

  test('Should signup a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'John',
        email: 'john@example.com',
        password: 'MyPass123!',
      })
      .expect(201);

    // Assert that the database was changed correctly
    const user = await UserModel.findById(response.body.user._id);
    expect(user).not.toBeNull();
    expect(user?.password).not.toBe('MyPass123!');

    // Assertions about the response
    expect(response.body).toMatchObject({
      user: {
        name: 'John',
        email: 'john@example.com',
      },
      token: user?.tokens[0].token,
    });
  });

  test('Should login existing user', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: userOne.email,
        password: userOne.password,
      })
      .expect(200);

    // Assert that the database was changed correctly
    const user = await UserModel.findById(userOneId);
    expect(user?.tokens).toHaveLength(2);
    expect(user?.tokens[1].token).toBe(response.body.token);
  });

  test('Should not login nonexisting user', async () => {
    await request(app)
      .post('/users/login')
      .send({
        email: 'nonexisting@example.com',
        password: 'mypassword1234!',
      })
      .expect(400);
  });

  test('Should get profile for user', async () => {
    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);
  });

  test('Should not get profile for unauthenticated user', async () => {
    await request(app).get('/users/me').send().expect(401);
  });

  test('Should delete account for user', async () => {
    await request(app)
      .delete('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    const user = await UserModel.findById(userOneId);
    expect(user).toBeNull();
  });

  test('Should not delete account for unauthenticated user', async () => {
    await request(app).delete('/users/me').send().expect(401);
  });

  test('Should upload avatar image', async () => {
    await request(app)
      .post('/users/me/avatar')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('avatar', 'src/__tests__/fixtures/profile-pic.jpg')
      .expect(200);

    const user = await UserModel.findById(userOneId);
    expect(user?.avatar).toEqual(expect.any(Buffer));
  });

  test('Should update valid user fields', async () => {
    await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        name: 'John',
      })
      .expect(200);

    const user = await UserModel.findById(userOneId);
    expect(user?.name).toBe('John');
  });

  test('Should not update invalid user fields', async () => {
    await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        location: 'San Francisco',
      })
      .expect(400);
  });
});
