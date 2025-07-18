const fs = require("fs");
require("dotenv").config();
const mongoose = require("mongoose");
const Member = require("./../models/memberModel");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.log(err);
  });

const members = JSON.parse(fs.readFileSync(`${__dirname}/team.json`, "utf-8"));

const importData = async () => {
  try {
    await Member.create(members, { validateBeforeSave: false });
    console.log("Data successfully loaded!");
  } catch (error) {
    console.error("Error loading data:", error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Member.deleteMany();
    console.log("Data successfully deleted!");
  } catch (error) {
    console.error("Error deleting data:", error);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
