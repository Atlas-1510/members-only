const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// Display member sign-up form
exports.member_signup_get = (req, res, next) => {
  if (!req.user.isMember) {
    res.render("member_signup");
  } else {
    res.render("member_signup_undo");
  }
};

// Handle member sign-up form submission
exports.member_signup_post = [
  body("password").exists().withMessage("Password is required").bail(),
  (req, res, next) => {
    const errors = validationResult(req)
      .array()
      .map((obj) => obj.msg);
    if (errors.length > 0) {
      res.render("member_signup", { errors });
    } else {
      User.findOne({ email: req.user.email }).exec((err, user) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(
            new Error("Somehow a user got here without being logged in??")
          );
        }
        if (req.body.password === process.env.MEMBER_SIGNUP_PW) {
          user.isMember = true;
          user.save().then(() => {
            req.flash("info", "You are now a member");
            res.redirect("/");
          });
        } else {
          req.flash("error", "Incorrect password");
          res.redirect("/member/signup");
        }
      });
    }
  },
];

// Display member revoke membership
exports.member_revoke_membership_get = (req, res, next) => {
  res.render("member_signup_undo");
};

// Handle member revoking membership
exports.member_revoke_membership_post = [
  (req, res, next) => {
    if (req.body.revokeMembership === "true") {
      User.findOneAndUpdate({ _id: req.user.id }, { isMember: false }).then(
        () => {
          req.flash("info", "Your membership has been revoked");
          res.redirect("/");
        }
      );
    } else {
      res.redirect("/");
    }
  },
];
