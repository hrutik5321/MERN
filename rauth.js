var express = require("express");
const { check } = require("express-validator");
var router = express.Router();

const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

//👉SIGNUP Route
router.post(
  "/signup",
  [
    check("name", "name Shold be atleast 3 character").isLength({ min: 3 }),
    check("email", "Email Is Required").isEmail(),
    check("password", "Password Should Be Atleast 5 Character").isLength({
      min: 5,
    }),
  ],
  signup
);

//👉SIGNIN Route
router.post(
  "/signin",
  [
    check("email", "Email Is Required").isEmail(),
    check("password", "Password Field Required").isLength({
      min: 5,
    }),
  ],
  signin
);

//👉SignOute route
router.get("/signout", signout);
router.get("/test", isSignedIn, (req, res) => {
  res.json(req.auth);
});

module.exports = router;
