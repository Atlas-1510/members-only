const express = require("express");
const router = express.Router();
const mainController = require("../controllers/main");
const { ensureAuthenticated } = require("./../config/authenticate");

/* GET home page. */
router.get("/", mainController.home_get);

/* GET sign-up page. */
router.get("/signup", mainController.sign_up_get);

/* POST sign-up page. */
router.post("/signup", mainController.sign_up_post);

/* GET log-in page */
router.get("/login", mainController.log_in_get);

/* POST log-in page */
router.post("/login", mainController.log_in_post);

/* GET log-out page */
router.get("/logout", mainController.log_out_get);

/* GET dashboard page */
router.get("/dashboard", ensureAuthenticated, mainController.dashboard_get);

module.exports = router;
