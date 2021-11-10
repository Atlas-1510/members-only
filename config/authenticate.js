module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error", "You must log in to view that content");
      res.redirect("/login");
    }
  },
  ensureAdmin: function (req, res, next) {
    if (req.user.isAdmin) {
      return next();
    } else {
      req.flash("error", "You must be an admin to do that");
      res.redirect("/");
    }
  },
};
