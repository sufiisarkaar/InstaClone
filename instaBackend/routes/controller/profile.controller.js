const userModel = require('../users');
profileController = async (req, res)=>{
    const user = await userModel.findOne({
      username: req.session.passport.user
    }).populate("posts");
  
    res.render('profile', {
      footer: true,
      user: user,
      profileImage: user.profileImage
    });
  }

  module.exports = { profileController };