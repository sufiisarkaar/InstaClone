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
    user
  });

  // res.send(posts)
});

router.get('/profile', async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  }).populate("posts");

  res.render('profile', {
    footer: true,
    user: user
  });
});

router.get('/search', isLoggedIn, function (req, res) {
  res.render('search', {
    footer: true
  });
});

router.get('/edit', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  res.render('edit', {
    footer: true,
    user: user
  });
});

router.get('/upload', isLoggedIn, function (req, res) {
  res.render('upload', {
    footer: true
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
    bio: req.body.bio
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


router.get('/username/:username', async (req,res)=>{
  const regex = new RegExp(`^${req.params.username}`,'i');
const findUser = await userModel.find({
name : regex 
});
res.json(findUser);
});


router.get('/like/post/:id', async (req,res)=>{
  const users = await userModel.findOne({ username : req.session.passport.user });
  const post = await postModel.findOne({ _id : req.params.id});
  if(post.likes.indexOf(users._id) === -1){
    post.likes.push(users._id);
  }else{
    post.likes.splice(post.likes.indexOf(users._id), 1);
  }

  await post.save();
  res.redirect("/feed");
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

module.exports = router;