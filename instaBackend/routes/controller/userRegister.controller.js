const userModel = require('../users');
userRegisterController = function (req, res) {
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
  };

  module.exports = { userRegisterController }