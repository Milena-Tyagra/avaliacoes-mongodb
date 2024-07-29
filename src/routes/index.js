const express = require("express")
const app = express()
const cors = require("cors")

const userRoutes = require("./userRoutes")
const ratingRoutes = require("./ratingRoutes")
const authRoutes = require("./authRoutes")

app.use(cors())
app.use(express.json())

app.use("/api/users", userRoutes)
app.use("/api/ratings", ratingRoutes)
app.use("/api/auth", authRoutes)

module.exports = app