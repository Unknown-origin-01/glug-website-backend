const Member = require("../models/memberModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllMembers = catchAsync(async (req, res) => {
  const members = await Member.find();

  res.status(200).json({
    status: "success",
    data: {
      members,
    },
  });
});
