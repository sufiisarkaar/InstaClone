const postModel = require('../posts');
postDeleteController =  async function (req, res) {
    const deleteUser = await postModel.findOneAndDelete({
      _id: req.params.id
    });
    if (deleteUser) {
      res.redirect("/feed");
    }
  
  
  };

  module.exports = { postDeleteController };