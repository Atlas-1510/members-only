module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error", "You must log in to view that content");
      res.redirect("/login");
    }
  },
};
