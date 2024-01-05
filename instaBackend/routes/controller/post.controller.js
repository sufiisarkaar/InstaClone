
const postModel = require('../posts');
const userModel = require('../users');



postController = async (req, res) => {
    const user = await userModel.findOne({
      username: req.session.passport.user
    });
    const post = await postModel.create({
      picture: req.file.filename,
      user: user._id,
      caption: req.body.caption
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect("/feed");
  };

  module.exports = { postController };