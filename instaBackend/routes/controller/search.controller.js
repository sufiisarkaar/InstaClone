const userModel = require('../users');
searchController = async (req, res)=>{
    const user = await userModel.findOne({
      username: req.session.passport.user
    });
    res.render('search', {
      footer: true,
      profileImage: user.profileImage
  
    });
  };

  module.exports = { searchController };