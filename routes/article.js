const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/authenticate");
const articleController = require("../controllers/article");

/* GET Create article page */
router.get(
  "/create",
  ensureAuthenticated,
  articleController.create_article_get
);

/* POST Create article page */
router.post(
  "/create",
  ensureAuthenticated,
  articleController.create_article_post
);

module.exports = router;
