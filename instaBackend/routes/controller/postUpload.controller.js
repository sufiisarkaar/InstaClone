const userModel = require('../users');
postUploadController = async function (req, res) {
    const user = await userModel.findOne({
      username: req.session.passport.user
    });
    res.render('upload', {
      footer: true,
      profileImage: user.profileImage
  
    });
  };

  module.exports = { postUploadController };