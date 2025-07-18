const express = require("express");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

// const userRoutes = require("./routes/memberRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();
app.use(express.json());

// app.use("/api/user", userRoutes);
app.use("/api/admin", memberRoutes);

// app.all("*", (req, res, next) => {
//   return next(new AppError(`The url ${req.originalUrl} is not valid`, 404));
// });

app.use(globalErrorHandler);

module.exports = app;
