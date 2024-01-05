const postModel = require('../posts');

postUpdateController =  async function (req, res) {

    const updatePost = await postModel.findOneAndUpdate({
        _id: req.body.postId
      }, {
        caption: req.body.caption
      }, {
        new: true
      } // To return the updated document
    );
    if (req.file) {
      updatePost.picture = req.file.filename;
    }
    await updatePost.save();
    res.redirect("/feed");
  }

  module.exports = { postUpdateController };