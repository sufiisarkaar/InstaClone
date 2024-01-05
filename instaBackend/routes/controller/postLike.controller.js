const userModel = require('../users');
const postModel = require('../posts');
postLikeController = async (req, res) => {
    const users = await userModel.findOne({
      username: req.session.passport.user
    });
    const post = await postModel.findOne({
      _id: req.params.id
    });
    if (post.likes.indexOf(users._id) === -1) {
      post.likes.push(users._id);
    } else {
      post.likes.splice(post.likes.indexOf(users._id), 1);
    }
  
    await post.save();
    res.redirect("/feed");
  };

  module.exports = { postLikeController }