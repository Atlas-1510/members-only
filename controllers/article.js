const { body, validationResult } = require("express-validator");
const Article = require("../models/Article");

// Display create article page GET
exports.create_article_get = (req, res, next) => {
  res.render("article_create");
};

// Handle create article page POST
exports.create_article_post = [
  body("title").exists({ checkFalsy: true }).withMessage("Title is required"),
  body("content")
    .exists({ checkFalsy: true })
    .withMessage("Article content is required"),
  (req, res, next) => {
    // If errors, return and reload
    const errors = validationResult(req)
      .array()
      .map((obj) => obj.msg);
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
      timestamp: Date.now(),
      author: req.user.id,
    });
    if (errors.length > 0) {
      res.render("article_create", { article, errors });
    } else {
      article.save((err) => {
        if (err) {
          return next(err);
        } else {
          req.flash("success", "Your article has been posted.");
          res.redirect("/");
        }
      });
    }
  },
];
