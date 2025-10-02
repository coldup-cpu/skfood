const menuModel = require("../model/menu.model")
const orderModel = require("../model/oder.model")

const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

async function seeLunchMenu(req, res){
    try {
        const seeMenu = await menuModel.find({
            mealType:"lunch"
        })
        res.json(seeMenu)
    } catch (error) {
    res.json({'message': `Somwthing went worng ${error}`})
    }
}

async function seeDinnerMenu(req, res){
        try {
        const seeMenu = await menuModel.find({
            mealType:"dinner"
        })
        res.json(seeMenu)
    } catch (error) {
    res.json({'message': `Somwthing went worng error`})
    }
}

async function prepareYourThali(req, res){
    try {
        
    } catch (error) {
    res.json({'message': `Somwthing went worng error`})
    }
}

async function orderPreparedThali(req, res) {
  try {
    const { mealType, listOfSabjis, optionForRoti, noOfRoti } = req.body;

    // ✅ Input validation
    if (!mealType || !Array.isArray(listOfSabjis) || typeof noOfRoti !== 'number') {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // Special sabji check
    const specialSabjis = await menuModel.exists({
      mealType,
      listOfSabjis: {
        $elemMatch: { name: { $in: listOfSabjis }, isSpecial: true },
      },
    });

    const mealDoc = await menuModel.findOne({ mealType });
    const basePrice = mealDoc ? mealDoc.basePrice : 60;

    const specialPrice = specialSabjis ? 20 : 0;
    const priceForRoti = noOfRoti * 10;
    const totalPrice = basePrice + specialPrice + priceForRoti;

    const options = {
      amount: totalPrice * 100, // Rs → paise
      currency: "INR",
      receipt: "receipt#1",
    }; 

    const order = await razorpay.orders.create(options);
    res.json(order); // send order back to frontend

  } catch (error) {
    console.error('Cashfree order error', error);
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
}

async function myAllOrders(req, res){
    try {
        const orders = await orderModel.find({userId: res.userId})
        res.json(orders)
    } catch (error) {
    res.json({'message': `Somwthing went worng ${error}`})
    }
}

async function confirmedOrders(req, res){
    try {
        // console.log(req.userId)
        console.log("",res.userId)
        const allConfirmedOrders = await orderModel.find({userId: res.userId, status:"Confirmed"});
        res.json(allConfirmedOrders)
    } catch (error) {
    res.json({'message': `Something went worng ${error}`})
    }
}

async function myOrderwithId(req, res){
    try {
        const { id } = req.params;
        const order = await orderModel.findOne({_id:id})
        res.json(order)
    } catch (error) {
    res.json({'message': `Something went worng ${error}`})
    }
}

module.exports = {
    seeLunchMenu,
    seeDinnerMenu,
    prepareYourThali,
    orderPreparedThali,
    myAllOrders,
    confirmedOrders,
    myOrderwithId
}