const postModel = require('../posts');

const deleteCommentController = async (req, res) => {
    const deleteCommentId = req.params.commentId;
    const postId = req.params.postId;

    const findPost = await postModel.findById(postId);

    const updatedComments = findPost.comments.filter(comment => comment._id != deleteCommentId);

    findPost.comments = updatedComments;
    await findPost.save();
    res.redirect("/feed");
};

module.exports = {
    deleteCommentController
};