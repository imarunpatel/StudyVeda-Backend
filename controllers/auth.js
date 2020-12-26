const User = require("../model/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  // create user
  let user = await User.create({
    name,
    email,
    password,
  });
  res.status(200).json({
    success: true,
    msg: "Registered Successfully..!",
    data: user,
  });

  sendTokenResponse(user, 200, res);
};

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('email not found')
    return res.status(400).json({
      success: false,
      msg: "Please provide an email and password",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  const isMatch = user ? await user.matchPassword(password) : false;

  if (!isMatch) {
    // return next(new ErrorResponse('Invalid Credentials', 401));
    return res.status(401).json({
      success: false,
      msg: 'Invalid Credentials'
    })
  }

  sendTokenResponse(user, 200, res);
});


exports.verifyUser = async(req, res, next) => {
  var token = req.body.token;
  if(!token){
    return res.status(401).json({
      success: false,
      message: "No token provided"
    })
  }

  jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to Authenticate User'
      });
    }
     return res.status(200).json({
        user: decoded,
        success: true,
        message: 'User is Valid'
      });
  })
}

exports.getUsers = async (req, res, next) => {
  let users = await User.find();

  res.status(201).json({
    success: true,
    length: users.length,
    data: users,
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    name: user.name,
    email: user.email
  });
};
