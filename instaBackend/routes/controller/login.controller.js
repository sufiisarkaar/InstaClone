const passport = require('passport');

loginController = passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login"
  }), function (req, res) {
    // res.render('upload', {
    //   footer: true
    // });
    res.send({"message":"login__Successfully"})
  };

  module.exports = { loginController }