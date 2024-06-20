const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.body, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id 
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'article does not exist',
        });
      }
      return rows[0];
    });
};

exports.selectAllArticles = (topic, sort_by, order_by) => {
  let sqlQuery = `
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
               CAST(COUNT(comments.comment_id) AS INT) AS comment_count
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id 
    `;

  let queryValues = [];
  const validSortBy = [
    'title',
    'topic',
    'author',
    'created_at',
    'votes',
    'article_img_url',
    'comment_count',
  ];
  const validOrderBy = ['ASC', 'DESC'];

  let sortBy = 'created_at';
  let orderBy = 'DESC';

  if (topic) {
    sqlQuery += 'WHERE articles.topic = $1 ';
    queryValues.push(topic);
  }

  if (sort_by && !validSortBy.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: 'Bad query request',
    });
  }

  if (sort_by) {
    sortBy = sort_by;
  }

  if (order_by && !validOrderBy.includes(order_by.toUpperCase())) {
    return Promise.reject({
      status: 400,
      msg: 'Bad query request',
    });
  }

  if (order_by) {
    orderBy = order_by.toUpperCase();
  }

  sqlQuery += `GROUP BY articles.article_id `;
  sqlQuery += `ORDER BY ${sortBy} ${orderBy} `;
  sqlQuery += ';';

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'article does not exist',
        });
      }
    });
};

exports.selectCommentByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.createCommentByArticleId = (article_id, author, body) => {
  if (author && typeof author !== 'string') {
    return Promise.reject({ status: 400, msg: 'Bad user request' });
  }
  if (body && typeof body !== 'string') {
    return Promise.reject({ status: 400, msg: 'Bad body request' });
  }
  return db
    .query(
      `INSERT INTO comments (body, author, article_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [body, author, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateVotesByArticleId = (article_id, newVote) => {
  const { inc_votes } = newVote;
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.createArticle = (author, title, body, topic, article_img_url) => {
  console.log(author, title, body, topic, article_img_url);
  if (author && typeof author !== 'string') {
    return Promise.reject({ status: 400, msg: 'Bad user request' });
  }
  if (
    (body && typeof body !== 'string') ||
    (title && typeof title !== 'string') ||
    (topic && typeof topic !== 'string') ||
    (article_img_url && typeof article_img_url !== 'string')
  ) {
    return Promise.reject({ status: 400, msg: 'Bad article request' });
  }
  return db
    .query(
      `INSERT INTO articles (author, title, body, topic, article_img_url, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [author, title, body, topic, article_img_url]
    )
    .then((result) => {
      console.log(result);
      return result.rows[0];
    })
};
