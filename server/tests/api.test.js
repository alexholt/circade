require('chai');
const request = require('supertest');
const app = require('../index');
const assert = require('assert');
const { deleteUser } = require('../db');

describe('User API endpoints', () => {
  const user = {
    email: 'hello@example.com',
    password: '123AbaDisksIo',
  };

  const userRequest = data => request(app).put('/user').send(data).expect('Content-Type', /json/);

  it('should reject invalid emails when attempting to create a user', (done) => {
      userRequest({email: 'blah'})
      .expect(400)
      .then(res => {
        assert.equal(res.body.status, 'invalid request');
        assert.equal(res.body.field, 'email');
        done();
      })
      .catch(err => done(err));
  });

  it('should reject invalid passwords when attempting to create a user', (done) => {
    userRequest({email: 'hello@example.com', password: '123'})
      .expect(400)
      .then(res => {
        assert.equal(res.body.status, 'invalid request');
        assert.equal(res.body.field, 'password');
        done();
      })
      .catch(err => done(err));
  });

  it('should create a user', (done) => {
    userRequest(user)
      .expect(200)
      .then(async (res) => {
        assert.equal(res.body.status, 'success');
        await deleteUser(user.email, user.password);
        done();
      })
      .catch(err => done(err));
  });

  it('should reject the creation of a user if they already exist', (done) => {
    const firstRequest = userRequest(user)
      .expect(200)
      .then(async (res) => {
        assert.equal(res.body.status, 'success');
        done();
      })
      .catch(err => done(err));

    firstRequest.then(res => {
      userRequest(user).expect(400).then(async (res) => {
        assert.equal(res.body.status, 'failure');
        await deleteUser(user.email, user.password);
        done();
      });
    });
  });

});