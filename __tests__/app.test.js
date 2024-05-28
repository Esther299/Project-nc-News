const app = require('../app');
const request = require('supertest');
const data = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');


beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('GET api topics', () => {
  test('GET:200 sends an array of topics to the client, each of which should have the properties of slug and description', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(Array.isArray(topics)).toBe(true);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  // xtest('GET:404 responds with a message when sent a incorrect endpoint', () => {
  //   return request(app)
  //     .get('/api/banana')
  //     .expect(404)
  //     .then((response) => {
  //       expect(response.body.msg).toBe('endpoint does not exist');
  //     });
  // });
});

describe(('GET api'), () => {
  test('GET:200 sends an object describing all the available endpoints on your API', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({body}) => {
        const { endpointsData } = body;
        for (const key in endpointsData) {
          if (key.endsWith('api')) {
            expect(endpointsData[key]).toEqual(
            expect.objectContaining({
              description: expect.any(String),
            })
          );
          }
          else { 
            expect(endpointsData[key]).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                queries: expect.any(Array),
                exampleResponse: expect.any(Object)
              })
            );
          }
        }
      });
  });
});
