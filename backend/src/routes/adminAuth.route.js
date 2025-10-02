const express = require('express');
const router = express.Router()
const auth = require("../controllers/adminAuth.controller")

router.post("/login", auth.adminLogin)
router.post("/logout", auth.adminLogout)

module.exports = router