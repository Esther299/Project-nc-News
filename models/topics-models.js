const db = require('../db/connection');

exports.selectAllTopics = () => {
  return db.query('SELECT * FROM topics;').then(({ rows }) => {
    return rows;
  });
};

exports.checkTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'topic does not exist' });
      }
    });
};

exports.createTopic = (slug, description) => {
  if (
    (slug && typeof slug !== 'string') ||
    (description && typeof description !== 'string')
  ) {
    return Promise.reject({ status: 400, msg: 'Bad topic request' });
  }
  return db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`,
      [slug, description]
    )
    .then((result) => {
      return result.rows[0];
    });
};
