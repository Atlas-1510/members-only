const { body, check, validationResult } = require("express-validator");
const User = require("../models/User");
const Article = require("../models/Article");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Display home page on GET
exports.home_get = [
  function (req, res, next) {
    Article.find()
      .populate("author")
      .exec((err, articles) => {
        if (err) {
          return next(err);
        } else {
          res.render("index", { articles });
        }
      });
  },
];

// Display sign-up form on GET
exports.sign_up_get = [
  function (req, res, next) {
    res.render("signup");
  },
];

// Handle sign-up form on POST
exports.sign_up_post = [
  body("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First name is required.")
    .bail()
    .isAlphanumeric()
    .withMessage("First name: Only characters a-z, A-Z, and 0-9 are allowed.")
    .isLength({ max: 100 })
    .withMessage("First name: length must be less than 100 characters.")
    .trim()
    .escape(),
  body("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Last name is required.")
    .bail()
    .isAlphanumeric()
    .withMessage("Last name: Only characters a-z, A-Z, and 0-9 are allowed.")
    .isLength({ max: 100 })
    .withMessage("Last name: Length must be less than 100 characters.")
    .trim()
    .escape(),
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Email: Must be a valid email address.")
    .isLength({ max: 100 })
    .withMessage("Email: Must be less than 100 characters.")
    .normalizeEmail(),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required.")
    .bail()
    .isAlphanumeric()
    .withMessage("Password: Only characters a-z, A-Z, and 0-9 are allowed.")
    .matches(/\d/)
    .withMessage("Password: Must contain a number.")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password: Length must be 8-100 characters.")
    .trim()
    .escape(),
  check(
    "confirmPassword",
    "Password input and password confirmation input must match."
  )
    .exists()
    .custom((value, { req }) => value === req.body.password),
  function (req, res, next) {
    const errors = validationResult(req)
      .array()
      .map((obj) => obj.msg);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      isMember: false,
    });
    if (errors.length > 0) {
      Object.assign(user, { confirmPassword: req.body.confirmPassword });
      res.render("signup", {
        user,
        errors,
      });
    } else {
      // Check if account with that email already exists
      User.findOne({ email: req.body.email }).exec((err, existingUser) => {
        if (existingUser) {
          Object.assign(user, { confirmPassword: req.body.confirmPassword });
          res.render("signup", {
            user,
            errors: ["Email is already registered"],
          });
        } else {
          bcrypt.hash(req.body.password, 10, function (err, hashedPassword) {
            if (err) {
              return next(err);
            } else {
              user.password = hashedPassword;
              user.save((err) => {
                if (err) {
                  return next(err);
                } else {
                  req.flash(
                    "info",
                    "You are now registered and ready to log in."
                  );
                  res.redirect("/login");
                }
              });
            }
          });
        }
      });
    }
  },
];

// Display log-in form on GET
exports.log_in_get = [
  function (req, res, next) {
    res.render("login");
  },
];

// Handle log-in form on POST
exports.log_in_post = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: true,
  })(req, res, next);
};

// Logout on GET
exports.log_out_get = (req, res, next) => {
  req.logout();
  req.flash("info", "You are now logged out");
  res.redirect("/");
};

// Display dashboard on GET
exports.dashboard_get = (req, res, next) => {
  res.render("dashboard");
};
