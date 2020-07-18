import request from 'supertest';

import { TaskModel } from './../models/task';
import { app } from './../app';

import { userOne, userTwo, taskOne, setupDatabase } from './fixtures/db';

// Task tests ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks

describe('Task tests', () => {
  beforeEach(setupDatabase);

  test('Should create task for a user', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        description: 'From my test',
      })
      .expect(201);
    const task = await TaskModel.findById(response.body._id);

    expect(task).not.toBeNull();
    expect(task).toMatchObject({
      owner: userOne._id,
      description: 'From my test',
      completed: false,
    });
  });

  test('Should get all tasks for a user', async () => {
    const response = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    expect(response.body).toHaveLength(2);
  });

  test('Should not delete other users tasks', async () => {
    await request(app)
      .delete(`/tasks/${taskOne._id}`)
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send()
      .expect(404);
    const task = await TaskModel.findById(taskOne._id);

    expect(task).not.toBeNull();
  });
});
