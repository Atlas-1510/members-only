const { body, check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcryptjs = require("bcryptjs");

// Display sign-up form on GET
exports.sign_up_get = [
  function (req, res, next) {
    res.render("signup", { title: "Sign Up" });
  },
];

// Handle sign-up form on POST
exports.sign_up_post = [
  function (req, res, next) {
    next();
  },
  body("firstName")
    .isAlphanumeric()
    .withMessage("First name: Only characters a-z, A-Z, and 0-9 are allowed.")
    .isLength({ max: 100 })
    .withMessage("First name: length must be less than 100 characters.")
    .trim()
    .escape(),
  body("lastName")
    .isAlphanumeric()
    .withMessage("Last name: Only characters a-z, A-Z, and 0-9 are allowed.")
    .isLength({ max: 100 })
    .withMessage("Last name: Length must be less than 100 characters.")
    .trim()
    .escape(),
  body("email")
    .isEmail()
    .withMessage("Email: Must be a valid email address.")
    .isLength({ max: 100 })
    .withMessage("Email: Must be less than 100 characters.")
    .normalizeEmail(),
  body("password")
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
    const errors = validationResult(req);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      membershipStatus: false,
    });
    if (!errors.isEmpty()) {
      Object.assign(user, { confirmPassword: req.body.confirmPassword });
      res.render("signup", {
        user: user,
        errors: errors.array(),
      });
    } else {
      bcryptjs.hash(req.body.password, 10, function (err, hashedPassword) {
        if (err) {
          return next(err);
        } else {
          user.password = hashedPassword;
          user.save((err) => {
            if (err) {
              return next(err);
            } else {
              res.redirect("/");
            }
          });
        }
      });
    }
  },
];
