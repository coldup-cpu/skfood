const express = require('express');
const router = express.Router()
const userPanel = require("../controllers/userPanel.controller")

router.get("/seeLunchMenu",userPanel.seeLunchMenu)                     //✅
router.get("/seeDinnerMenu",userPanel.seeDinnerMenu)                  //✅
// router.get("/prepareYourThali",userPanel.prepareYourThali)        //
router.post("/orderPreparedThali",userPanel.orderPreparedThali)     //


router.get("/myAllOrders",userPanel.myAllOrders)                //✅
router.get("/confirmedOrders",userPanel.confirmedOrders)       //✅
router.get("/myOrderwithId/:id",userPanel.myOrderwithId)      //✅
    
module.exports = router