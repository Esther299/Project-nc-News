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

describe('/api/articles/:article_id', () => {
  test('GET:200 sends a single article to the client', () => {
    return request(app)
      .get('/api/articles/3')
      .expect(200)
      .then(({body}) => {
        const { article } = body
        expect(article.article_id).toBe(3);
        expect(article.title).toBe('Eight pug gifs that remind me of mitch');
        expect(article.body).toBe('some gifs');
        expect(article.topic).toBe('mitch');
        expect(article.created_at).toBe('2020-11-03T08:12:00.000Z');
        expect(article.votes).toBe(0);
        expect(article.article_img_url).toBe(
          'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        );
      });
  });
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe('article does not exist');
      });
  });
  test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/not-an-article')
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('Bad request');
      });
  });
})