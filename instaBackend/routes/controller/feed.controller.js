const userModel = require('../users');
const postModel = require('../posts');

feedController = async  (req, res)=>{
    const cmtUsers = [];
    const user = await userModel.findOne({
      username: req.session.passport.user
    });
    const posts = await postModel.find().populate("user");
    for(const post of posts) {
      const cmtUser = await postModel.findById({
        _id : post._id
      }).populate('comments');
       cmtUsers.push(cmtUser);
    }
   
    res.render('feed', {
      footer: true,
      post: posts,
      user,
      profileImage: user.profileImage,
    });
  
    // res.send(posts)
  }

  module.exports = { feedController }