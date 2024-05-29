const db = require('../db/connection');

exports.checkUserExists = (author) => {
  return db
    .query('SELECT * FROM users WHERE username = $1', [author])
      .then(({ rows }) => {
        console.log(rows, '<--- users')
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'user does not exist' });
      }
    });
};

