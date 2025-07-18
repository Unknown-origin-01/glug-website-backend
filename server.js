require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.log(err);
  });

const app = require("./app");

app.listen(process.env.PORT, () => {
  console.log(`Server started at PORT: ${process.env.PORT}`);
});
