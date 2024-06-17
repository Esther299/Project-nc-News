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
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 3,
            title: 'Eight pug gifs that remind me of mitch',
            body: 'some gifs',
            author: 'icellusedkars',
            topic: 'mitch',
            created_at: '2020-11-03T08:12:00.000Z',
            votes: 0,
            article_img_url:
              'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
          })
        );
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

  test('POST:201 inserts a new comment even with extra properties in the request body', () => {
    const newComment = {
      author: 'butter_bridge',
      body: 'Hello there Northcoders!',
      extraProperty: 2,
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

  test('POST:400 sends an appropriate status and error message when provided with a bad comment (no comment body)', () => {
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

  test('POST:400 sends an appropriate status and error message when provided with invalid property types', () => {
    const newComment = {
      author: 123,
      body: 'Hello there Northcoders!',
    };
    return request(app)
      .post('/api/articles/9/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad user request');
      });
  });

  test('POST:400 sends an appropriate status and error message when provided with invalid property types', () => {
    const newComment = {
      author: 'butter_bridge',
      body: 123,
    };
    return request(app)
      .post('/api/articles/9/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad body request');
      });
  });

  test('POST:400 sends an appropriate status and error message when given a valid but non-existent user', () => {
    const newComment = {
      author: 'Esther',
      body: 'Hello there Northcoders!',
    };
    return request(app)
      .post('/api/articles/9/comments')
      .send(newComment)
      .expect(400)
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
      .post('/api/articles/not-an-article/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
      });
  });
});

describe('PATCH api articles by Id', () => {
  test('PATCH:200 updates the votes of an article in the db by its id when adding a positive number', () => {
    const newVote = {
      inc_votes: 1,
    };
    return request(app)
      .patch('/api/articles/3')
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.votes).toBe(1);
      });
  });

  test('PATCH:200 updates the votes of an article in the db by its id when adding a negative number', () => {
    const newVote = {
      inc_votes: -100,
    };
    return request(app)
      .patch('/api/articles/3')
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.votes).toBe(-100);
      });
  });

  test('PATCH:200 updates the votes of an article in the db by its id when adding a negative number', () => {
    const newVote = {
      inc_votes: 1,
      extraProperty: 'This is an extra property',
    };
    return request(app)
      .patch('/api/articles/3')
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.votes).toBe(1);
      });
  });

  test('PATCH:400 sends an appropriate status and error message when the provided vote property is incorrect', () => {
    const newVote = {
      votes: 1,
    };
    return request(app)
      .patch('/api/articles/3')
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
      });
  });

  test('PATCH:400 sends an appropriate status and error message when the provided vote type value is incorrect', () => {
    const newVote = {
      inc_votes: 'banana',
    };
    return request(app)
      .patch('/api/articles/3')
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
      });
  });

  test('PATCH:404 sends an appropriate status and error message when given a valid but non-existent article id', () => {
    const newVote = {
      inc_votes: 1,
    };
    return request(app)
      .patch('/api/articles/99999')
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('article does not exist');
      });
  });

  test('PATCH:400 sends an appropriate status and error message when given an invalid id', () => {
    const newVote = {
      inc_votes: 1,
    };
    return request(app)
      .patch('/api/articles/not-an-article')
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
      });
  });
});

describe('DELETE api comments by Id', () => {
  test('DELETE:204 deletes the specified comment and sends no body back', () => {
    return request(app).delete('/api/comments/3').expect(204);
  });

  test('DELETE:404 responds with an appropriate status and error message when given a non-existent id', () => {
    return request(app)
      .delete('/api/comments/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('comment does not exist');
      });
  });

  test('DELETE:400 responds with an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .delete('/api/comments/not-a-number')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
      });
  });
});

describe('GET api users', () => {
  test('GET:200 sends an array of users to the client, each of which should have the properties of username, name and avatar_url', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe('GET api articles queries', () => {
  describe('Topic query', () => {
    test('GET:200 sends an array of articles queried by topic', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(Array.isArray(articles)).toBe(true);
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article.topic).toBe('mitch');
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
    test('GET:200 sends an empty array when there are no articles with that topic', () => {
      return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(Array.isArray(articles)).toBe(true);
          expect(articles).toHaveLength(0);
          expect(articles).toEqual([]);
        });
    });
    // test('GET:400 sends an appropriate status and error message when given a non existing topic', () => {
    //   return request(app)
    //     .get('/api/articles?topic=banana')
    //     .expect(400)
    //     .then(({ body }) => {
    //       expect(body.msg).toBe('Bad query request');
    //     });
    // });
  });
  describe('Comment_count query by Id', () => {
    test('GET:200 sends an that adds the comment_count when queried', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.comment_count).toBe(11);
        });
    });
  });
});

describe('GET api articles sort queries', () => {
  describe('Sort by', () => {
    test('GET:200 defaults to sort by created_at', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(13);
          expect(articles).toBeSortedBy('created_at', { descending: true });
        });
    });

    test('GET:200 sends an array of articles sorted by any valid column', () => {
      const validColumns = [
        'title',
        'topic',
        'author',
        'body',
        'created_at',
        'article_img_url',
        'comment_count',
      ];
      for (const validColumn of validColumns) {
        return request(app)
          .get(`/api/articles?sort_by=${validColumn}`)
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toHaveLength(13);
            expect(articles).toBeSortedBy(validColumn, { descending: true });
          });
      }
    });

    test('GET:400 sends a message of "Bad query request" when passed an invalid sort by query', () => {
      return request(app)
        .get('/api/articles?sort_by=banana')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad query request');
        });
    });
  });

  describe('Order by', () => {
    test('GET:200 defaults to order by descending', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(13);
          expect(articles).toBeSorted({ descending: true });
        });
    });

    test('GET:200 sends an array of articles ordered by the passed query', () => {
      return request(app)
        .get('/api/articles?order_by=asc')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(13);
          expect(articles).toBeSorted({ ascending: true });
        });
    });

    test('GET:400 sends a message of "Bad query request" when passed an invalid order by query', () => {
      return request(app)
        .get('/api/articles?order_by=banana')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad query request');
        });
    });
  });
});

describe('GET api users by username', () => {
  test('GET:200 sends a single user to the client', () => {
    return request(app)
      .get('/api/users/rogersop')
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual(
          expect.objectContaining({
            username: 'rogersop',
            name: 'paul',
            avatar_url:
              'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
          })
        );
      });
  });

  test('GET:404 sends an appropriate status and error message when given a valid but non-existent username', () => {
    return request(app)
      .get('/api/users/not-a-user')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('User not found');
      });
  });
});
