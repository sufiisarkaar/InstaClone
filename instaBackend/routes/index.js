var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('./multer');
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

router.get('/feed', async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  const posts = await postModel.find().populate("user");
  res.render('feed', {
    footer: true,
    post: posts,
    user,
    profileImage: user.profileImage

  });

  // res.send(posts)
});

router.get('/profile', async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  }).populate("posts");

  res.render('profile', {
    footer: true,
    user: user,
    profileImage: user.profileImage
  });
});

router.get('/search', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  res.render('search', {
    footer: true,
    profileImage: user.profileImage

  });
});

router.get('/edit', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  res.render('edit', {
    footer: true,
    user: user,
    profileImage: user.profileImage

  });
});

router.get('/upload', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  res.render('upload', {
    footer: true,
    profileImage: user.profileImage

  });
});

router.post('/register', function (req, res) {
  const userData = new userModel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
  });
  userModel.register(userData, req.body.password).then(() => {
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile")
    })
  })
});


router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login"
}), function (req, res) {
  res.render('upload', {
    footer: true
  });
});


router.get('/logout', function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});




router.post('/update', upload.single("image"), async (req, res) => {
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
});


router.post('/upload', isLoggedIn, upload.single("image"), async (req, res) => {
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
});


router.get('/username/:username', async (req, res) => {
  const regex = new RegExp(`^${req.params.username}`, 'i');
  const findUser = await userModel.find({
    name: regex
  });
  res.json(findUser);
});


router.get('/like/post/:id', async (req, res) => {
  const users = await userModel.findOne({
    username: req.session.passport.user
  });
  const post = await postModel.findOne({
    _id: req.params.id
  });
  if (post.likes.indexOf(users._id) === -1) {
    post.likes.push(users._id);
  } else {
    post.likes.splice(post.likes.indexOf(users._id), 1);
  }

  await post.save();
  res.redirect("/feed");
});
router.post('/updatePost', upload.single("updateimage"), async function (req, res) {

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
  console.log(updatePost._id == req.body.postId);

});


router.get('/deletePost/:id', async function (req, res) {
  const deleteUser = await postModel.findOneAndDelete({
    _id: req.params.id
  });
  if (deleteUser) {
    res.redirect("/feed");
    console.log("deletepost", req.params.id);
  }


})

router.get('/editPost/:id', async function (req, res) {
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

router.get('/followingUser/:id', async function (req, res) {
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


router.get('/unfollowingUser/:id', async function (req, res) {
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





function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

module.exports = router;