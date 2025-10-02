const express = require('express');
const app = express()

const cookieParser = require("cookie-parser");
// const cors = require("cors");

const adminAuth = require("./routes/adminAuth.route")
const adminPanel = require("./routes/adminPanel.route")
const userAuth = require("./routes/userAuth.route")
const userPanel = require("./routes/userPanel.route")
const {userAuthMiddlewareForAuth} = require("./middleware/userAuth.middleware")

// app.use(cors({
//   origin: "http://localhost:5500",
//   credentials: true,                // cookies/jwt bhejne ke liye
// }));

app.use(cookieParser());
app.use(express.json())


//my Routes Goes from here :>
app.use("/api/admin", adminAuth)   //Admin ✅
app.use("/api/admin", adminPanel)   //Admin

app.use("/api/userAuth", userAuth)  //User ✅
app.use("/api/userPanel",userAuthMiddlewareForAuth, userPanel) //User



    
module.exports = app
