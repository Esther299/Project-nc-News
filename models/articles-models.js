const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'article does not exist' });
      }
      return rows[0];
    });
};

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        CAST(COUNT(comments.comment_id) AS INT) AS comment_count
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id 
        GROUP BY articles.article_id ORDER BY articles.created_at DESC; `
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        console.log(rows, '<---articles')
        return Promise.reject({
          status: 404,
          msg: 'article does not exist',
        });
      }
    });
}

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


exports.createCommentByArticleId = (article_id, author, body ) => {
  return db
    .query(
      `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [body, author, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

