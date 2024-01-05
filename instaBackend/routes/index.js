var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('./multer');
const { feedController } = require('./controller/feed.controller');
const { profileController } = require('./controller/profile.controller');
const { searchController } = require('./controller/search.controller');
const { userEditController } = require('./controller/userEdit.Controller');
const { userRegisterController } = require('./controller/userRegister.controller');
const { loginController } = require('./controller/login.controller');
const { logoutController } = require('./controller/logout.controller');
const { postUploadController } = require('./controller/postUpload.controller');
const { profileUpdateController } = require('./controller/profileUpdate.controller');
const { postController } = require('./controller/post.controller');
const { postLikeController } = require('./controller/postLike.controller');
const { postUpdateController } = require('./controller/postUpdate.controller');
const { postDeleteController } = require('./controller/postDelete.controller');
const { deleteCommentController } = require('./controller/deleteComment.controller');
passport.use(new localStrategy(userModel.authenticate()));
router.get('/', function (req, res) {
  res.render('index', {
    footer: false
  });
});

router.get('/login', function (req, res) {
  res.render('login', {
    footer: false
  });
});

router.get('/feed', isLoggedIn, feedController );

router.get('/profile', isLoggedIn, profileController);

router.get('/search', isLoggedIn, searchController);

router.get('/edit', isLoggedIn, userEditController);

router.get('/upload', isLoggedIn, postUploadController);

router.post('/register', userRegisterController);


router.post('/login', loginController);


router.get('/logout', logoutController);

router.post('/update', isLoggedIn, upload.single("image"), profileUpdateController );


router.post('/upload', isLoggedIn,upload.single("image"),  postController );


router.get('/username/:username', isLoggedIn, async (req, res) => {
  const regex = new RegExp(`^${req.params.username}`, 'i');
  const findUser = await userModel.find({
    name: regex
  });
  res.json(findUser);
});


router.get('/like/post/:id', isLoggedIn, postLikeController);

router.post('/updatePost', isLoggedIn, upload.single("updateimage"), postUpdateController);


router.get('/deletePost/:id', isLoggedIn, postDeleteController);

router.get('/editPost/:id', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  const post = await postModel.findOne({
    _id: req.params.id
  });

  res.render('editpost', {
    footer: true,
    profileImage: user.profileImage,
    post: post
  });
});

router.get('/followingUser/:id', isLoggedIn, async function (req, res) {
  const postUserID = req.params.id;

  const postuser = await userModel.findOne({
    _id: postUserID
  });

  const currentUserUpdateField = await userModel.findOne({
    username: req.session.passport.user
  });

  postuser.followers.push(currentUserUpdateField._id);
  currentUserUpdateField.following.push(postUserID);
  await currentUserUpdateField.save();
  await postuser.save();
  res.redirect("/feed");
});


router.get('/unfollowingUser/:id', isLoggedIn, async function (req, res) {
  const postUserID = req.params.id;

  try {
    // Find the user to unfollow
    const postuser = await userModel.findOne({
      _id: postUserID
    });

    // Find the current user
    const currentUserUpdateField = await userModel.findOne({
      username: req.session.passport.user
    });

    // Remove the postuser from the followers list of the current user
    currentUserUpdateField.following = currentUserUpdateField.following.filter(
      (followedUserId) => followedUserId.toString() !== postUserID
    );

    // Remove the current user from the following list of the postuser
    postuser.followers = postuser.followers.filter(
      (followerId) => followerId.toString() !== currentUserUpdateField._id.toString()
    );

    // Save the changes
    await currentUserUpdateField.save();
    await postuser.save();

    res.redirect("/feed");
  } catch (error) {
    console.error("Error during unfollow:", error);
    res.status(500).send("Internal Server Error");
  }
});




router.get('/followingUserViaProfile/:id', isLoggedIn, async function (req, res) {
  const postUserID = req.params.id;

  const postuser = await userModel.findOne({
    _id: postUserID
  });

  const currentUserUpdateField = await userModel.findOne({
    username: req.session.passport.user
  });

  postuser.followers.push(currentUserUpdateField._id);
  currentUserUpdateField.following.push(postUserID);
  await currentUserUpdateField.save();
  await postuser.save();
  res.redirect(`/usersProfile/${postUserID}`);
});


router.get('/unfollowingUserViaProfile/:id', isLoggedIn, async function (req, res) {
  const postUserID = req.params.id;

  try {
    // Find the user to unfollow
    const postuser = await userModel.findOne({
      _id: postUserID
    });

    // Find the current user
    const currentUserUpdateField = await userModel.findOne({
      username: req.session.passport.user
    });

    // Remove the postuser from the followers list of the current user
    currentUserUpdateField.following = currentUserUpdateField.following.filter(
      (followedUserId) => followedUserId.toString() !== postUserID
    );

    // Remove the current user from the following list of the postuser
    postuser.followers = postuser.followers.filter(
      (followerId) => followerId.toString() !== currentUserUpdateField._id.toString()
    );

    // Save the changes
    await currentUserUpdateField.save();
    await postuser.save();

    res.redirect(`/usersProfile/${postUserID}`);
  } catch (error) {
    console.error("Error during unfollow:", error);
    res.status(500).send("Internal Server Error");
  }
});





router.get('/usersprofile/:id', isLoggedIn, async function (req, res) {
  const userProfile = await userModel.findOne({
    _id: req.params.id
  }).populate('posts');

  const user = await userModel.findOne({
    username: req.session.passport.user
  });


  res.render('usersprofile', {
    userProfile: userProfile,
    profileImage: user.profileImage,
    user: user,
    footer: true,
  })
});


router.post('/comment/:postId', isLoggedIn, async function (req, res) {
  const userId = req.user._id;
  const postId = req.params.postId;
  const post = await postModel.findById(postId).populate('user');
  const newComment = {
    user: userId,
    comment: req.body.comment, 
    userProfile : req.user.profileImage,
    postUser : req.user
  };

 

  post.comments.push(newComment);
  await post.save();
  res.redirect('/feed');
});


router.get('/deleteComment/:postId/:commentId', isLoggedIn , deleteCommentController )

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

module.exports = router;