const Member = require("../models/memberModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (member, statusCode, res) => {
  const token = signToken(member._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  member.password = undefined;

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      member,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newMember = await Member.create(req.body);

  createSendToken(newMember, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const member = await Member.findOne({ email }).select("+password");

  if (!member || !(await member.correctPassword(password, member.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(member, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization.split(" ")[1] &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshMember = await Member.findById(decoded.id);

  if (!freshMember) {
    return next(
      new AppError("The member belonging to this token does not exist", 401)
    );
  }

  if (freshMember.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "Member recently changed password! Please log in again.",
        401
      )
    );
  }

  req.member = freshMember;
  next();
});
