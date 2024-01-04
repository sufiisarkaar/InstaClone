const userModel = require('../users');

profileUpdateController =  async (req, res) => {
    const user = await userModel.findOneAndUpdate({
      username: req.session.passport.user
    }, {
      username: req.body.username,
      name: req.body.name,
      bio: req.body.bio,
  
    }, {
      new: true
    });
  
  
    if (req.file) {
      user.profileImage = req.file.filename;
    }
    await user.save();
    res.redirect("/profile");
  };

  module.exports = { profileUpdateController }
    