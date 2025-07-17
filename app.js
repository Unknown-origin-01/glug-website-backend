require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose')

const userRoutes = require("./routes/user")
const adminRoutes = require("./routes/admin")

const app = express()
app.use(express.json())

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err)=>{console.log(err)})

app.use("/api/user", userRoutes)
app.use("/api/admin", adminRoutes)

app.listen(process.env.PORT, ()=>{
    console.log(`Server started at PORT: ${process.env.PORT}`)
})