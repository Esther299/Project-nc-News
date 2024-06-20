const db = require('../db/connection');


exports.removeCommentById = (comment_id) => {
  return db
    .query('DELETE FROM comments WHERE comment_id = $1;', [comment_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: 'comment does not exist' });
      }
    });
};

exports.updateVotesByCommentId = (comment_id, newVote) => {
  const { inc_votes } = newVote;
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.checkCommentExists = (comment_id) => {
  return db
    .query('SELECT * FROM comments WHERE comment_id = $1', [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'comment does not exist',
        });
      }
    });
};