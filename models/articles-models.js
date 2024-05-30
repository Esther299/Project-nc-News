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
      return rows[0]
    });
};

exports.checkTopicExists = (topic) => {
  return db.query(`SELECT * FROM articles WHERE topic = $1`, [topic]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({status:404, msg: 'article does not exist'})
    }
  })
}

exports.selectAllArticles = (topic) => {
  let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        CAST(COUNT(comments.comment_id) AS INT) AS comment_count
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id `;

  let queryValues = [];

  if (topic) {
    sqlQuery += 'WHERE topic = $1 ';
    queryValues.push(topic);
  }

  sqlQuery +=
    'GROUP BY articles.article_id ORDER BY articles.created_at DESC; ';

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
      `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`,
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
