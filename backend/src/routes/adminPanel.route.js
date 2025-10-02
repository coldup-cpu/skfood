const express = require('express');
const router = express.Router()
const multer = require("multer")
const adminPanel = require("../controllers/adminPanel.controller")

const upload = multer({
    storage: multer.memoryStorage()
})

// router.get("/menuHistoryLog", adminPanel.analytics)

router.get("/menuHistoryLog", adminPanel.menuHistoryLog)                                 //✅
router.post("/imageUpload", upload.single("imageFile"), adminPanel.imageUpload)         //✅
router.put("/createMeal", adminPanel.createMenu )                                      //✅


router.get("/orderwithId/:id", adminPanel.orderwithId)              //✅
router.get("/confirmedOrders", adminPanel.confirmedOrders)         //✅
router.get("/allOrders", adminPanel.allOrders)                    //✅

module.exports = router