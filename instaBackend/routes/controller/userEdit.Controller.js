const userModel = require('../users');
userEditController = async function (req, res) {
    const user = await userModel.findOne({
      username: req.session.passport.user
    });
    res.render('edit', {
      footer: true,
      user: user,
      profileImage: user.profileImage
  
    });
  };

  module.exports = { userEditController }