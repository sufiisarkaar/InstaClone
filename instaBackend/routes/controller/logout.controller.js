logoutController = function (req, res, next) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/login');
    });
  };

  module.exports = { logoutController };
