const app = require('../app');
const request = require('supertest');
const data = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const endpointsFile = require('../endpoints.json');

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
});

describe('GET api', () => {
  test('GET:200 sends an object describing all the available endpoints on your API', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        const { endpointsData } = body;
        expect(endpointsData).toEqual(endpointsFile);
      });
  });
});

describe('GET api articles by article Id', () => {
  test('GET:200 sends a single article to the client', () => {
    return request(app)
      .get('/api/articles/3')
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 3,
          title: 'Eight pug gifs that remind me of mitch',
          body: 'some gifs',
          author: 'icellusedkars',
          topic: 'mitch',
          created_at: '2020-11-03T08:12:00.000Z',
          votes: 0,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });

  test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('article does not exist');
      });
  });

  test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/not-an-article')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
      });
  });
});

describe('GET api articles', () => {
  test('GET:200 sends an array of articles to the client with the correct properties', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(article).not.toHaveProperty('body');
        });
      });
  });
});

describe('GET api comments by article Id', () => {
  test('GET:200 sends a single comment of article id enpoint to the client', () => {
    return request(app)
      .get('/api/articles/9/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: 9,
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });

  test('GET:200 sends an empty array to the client when there are no comments for that article', () => {
    return request(app)
      .get('/api/articles/7/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(0);
        expect(comments).toEqual([]);
      });
  });

  test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/9999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('article does not exist');
      });
  });

  test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/not-an-article/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
      });
  });
});

describe('POST api comments by article Id', () => {
  test('POST:201 inserts a new comment to the db by article id and sends the new comment back to the client', () => {
    const newComment = {
      author: 'butter_bridge',
      body: 'Hello there Northcoders!',
    };
    return request(app)
      .post('/api/articles/9/comments')
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.comment_id).toBe(19);
        expect(comment.author).toBe('butter_bridge');
        expect(comment.body).toBe('Hello there Northcoders!');
        expect(comment.article_id).toBe(9);
      });
  });

  test('POST:400 responds with an appropriate status and error message when provided with a bad comment (no comment body)', () => {
    return request(app)
      .post('/api/articles/9/comments')
      .send({
        author: 'butter_bridge',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
      });
  });

  test('POST:404 sends an appropriate status and error message when given a valid but non-existent user', () => {
    const newComment = {
      author: 'Esther',
      body: 'Hello there Northcoders!',
    };
    return request(app)
      .post('/api/articles/9/comments')
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('user does not exist');
      });
  });

  test('POST:404 sends an appropriate status and error message when given a valid but non-existent article id', () => {
    const newComment = {
      author: 'butter_bridge',
      body: 'Hello there Northcoders!',
    };
    return request(app)
      .post('/api/articles/99999/comments')
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('article does not exist');
      });
  });

  test('POST:400 sends an appropriate status and error message when given an invalid id', () => {
    const newComment = {
      author: 'butter_bridge',
      body: 'Hello there Northcoders!',
    };
    return request(app)
      .get('/api/articles/not-an-article/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
      });
  });
});