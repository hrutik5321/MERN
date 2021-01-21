const { validationResult } = require("express-validator");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

//👉SIGNUP Route
exports.signup = (req, res) => {
  //Validating Result
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  //Saving User In DataBase After Validation
  const user = new User(req.body);
  user.save((err, users) => {
    if (err) {
      return res.status(400).json({
        error: "Not Able To Save In DB",
      });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  });
};

//👉SignOute route
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User Signout Successfully",
  });
};

//👉SignIn route

exports.signin = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User Email Not Found",
      });
    }
    if (!user.autheticate(password)) {
      return res.status(401).json({
        error: "Password Does Not Match",
      });
    }
    //create a token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to front end
    //deconstruct user
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

/******Protected Routes******* */
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

/*******Custom Middleware***** */

exports.isAuthenticated = (req, res, next) => {
  //(req.profile) is set from front end and (req.auth) is from signin
  let checker = req.profile && req.auth && req.profile._id === req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "Access Denied",
    });
  }

  next();
};

exports.isAdmin = (req, res, next) => {
  //for admin role is equal to 1 not 0
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You Are Not Admin, Access Denied",
    });
  }

  next();
};
