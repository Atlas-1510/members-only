const express = require("express");
const router = express.Router();
const memberController = require("./../controllers/member");
const { ensureAuthenticated } = require("../config/authenticate");

/* GET member sign-up page. */
router.get("/signup", ensureAuthenticated, memberController.member_signup_get);

/* POST member sign-up page. */
router.post(
  "/signup",
  ensureAuthenticated,
  memberController.member_signup_post
);

/* GET revoke membership page. */
router.get(
  "/revokeMembership",
  ensureAuthenticated,
  memberController.member_revoke_membership_get
);

/* POST revoke membership page. */
router.post(
  "/revokeMembership",
  ensureAuthenticated,
  memberController.member_revoke_membership_post
);

module.exports = router;
