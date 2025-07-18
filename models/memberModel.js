const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const AppError = require("../utils/appError");

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Member name is required"],
  },
  email: {
    type: String,
    required: [true, "Member email is required"],
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    required: [true, "Member role is required"],
  },
  password: {
    type: String,
    required: [true, "Member password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Member password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
    select: false,
  },
  description: {
    type: String,
    required: [true, "Member description is required"],
    maxlength: [500, "Description must be less than 500 characters"],
  },
  passwordChangedAt: Date,
  PasswordResetToken: String,
  PasswordResetTokenExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

memberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

memberSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

memberSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

memberSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
