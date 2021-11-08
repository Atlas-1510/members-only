var express = require("express");
var router = express.Router();

const MainController = require("../controllers/Main");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

/* GET sign-up page. */
router.get("/signup", MainController.sign_up_get);

/* POST sign-up page. */
router.post("/signup", MainController.sign_up_post);

/* GET log-in page */
router.get("/login", MainController.log_in_get);

/* POST log-in page */
router.post("/login", MainController.log_in_post);

/* GET log-out page */
router.get("/logout", MainController.log_out_get);

module.exports = router;
