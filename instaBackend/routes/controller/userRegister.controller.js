const userModel = require('../users');
userRegisterController = async function (req, res) {
    const userData = new userModel({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
    });
    const user =  await userModel.register(userData, req.body.password)
    .then(() => {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/profile")
      })
    });
    // res.send({message : "user_created", user : user });
  };

  module.exports = { userRegisterController }