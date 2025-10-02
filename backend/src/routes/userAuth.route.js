const express = require('express');
const router = express.Router()
const auth = require("../controllers/userAuth.controller")

router.post("/signup", auth.signup)
router.post("/login", auth.login)

router.get("/google", auth.googleAuth)
router.get("/google/callback", auth.googleAuthCallback)

router.get("/profile", auth.profile)
router.post("/logout", auth.logout)

module.exports = router