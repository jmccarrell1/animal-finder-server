const express = require('express');
const request = require('supertest');
const sinon = require('sinon');
const randomstring = require('randomstring');
const db = require('./db-handler');
const cache = require('../src/components/cache');
const route = require('../src/routes/dog-route');
const logger = require('../src/components/logger');
const Animal = require('../src/data/models/animal');

describe('GET /dogs', async () => {
  let app;

  before(async () => {
    await db.connect();
    app = express();
    route(app);
  });

  beforeEach(async () => {
    cache.flush();
    await db.connect();
  });

  after(async () => {
    cache.flush();
    await db.closeDatabase();
  });

  afterEach(async () => {
    cache.flush();
  });

  it('should respond with status 200 json format', async () => {
    await request(app)
      .get('/api/dogs')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('should return dogs from cache', async () => {
    const rand = randomstring.generate;
    cache.set('/api/dogs', rand);

    await request(app)
      .get('/api/dogs')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        res.body === rand;
      });
  });

  it('should set cache and return dog from db', async () => {
    const animal = await Animal.create({});
    const path = `/api/dogs/${animal._id.toString()}`;

    await request(app)
      .get(path)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        res.body._id === animal._id.toString();
      })
      .expect(() => {
        cache.get(path)._id === animal._id;
      });
  });

  it('should search for dogs and return error during processing', async () => {
    const animalStub = sinon.stub(Animal, 'find').throws('test error');
    const logStub = sinon.stub(logger, 'error');

    await request(app)
      .get('/api/dogs')
      .expect(500)
      .expect('error during processing')
      .expect(() => {
        logStub.calledOnce;
      })
      .expect(() => {
        logStub.args[0][0].name === 'test error';
      });

    logStub.restore();
    animalStub.restore();
  });

  describe('GET /dogs/:id', () => {
    it('should return dog from cache', async () => {
      const rand = randomstring.generate;
      cache.set('/api/dogs/1', rand);

      await request(app)
        .get('/api/dogs/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          res.body === rand;
        });
    });
  });

  it('should search for dog and return error during processing', async () => {
    const animalStub = sinon.stub(Animal, 'find').throws('test error');
    const logStub = sinon.stub(logger, 'error');

    await request(app)
      .get('/api/dogs/1')
      .expect(500)
      .expect('error during processing')
      .expect(() => {
        logStub.calledOnce;
      })
      .expect(() => {
        logStub.args[0][0].name === 'test error';
      });

    logStub.restore();
    animalStub.restore();
  });
});
