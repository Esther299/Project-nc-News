const {
  removeCommentById,
  updateVotesByCommentId,
  checkCommentExists,
} = require('../models/comments-models');

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVoteByCommentId = (req, res, next) => {
  const newVote = req.body;
  const { comment_id } = req.params;
  checkCommentExists(comment_id)
    .then(() => {
      return updateVotesByCommentId(comment_id, newVote);
    })
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
