const menuModel = require("../model/menu.model")
const historyMenuModel = require("../model/historyMenu.model")
const ordersModel = require("../model/oder.model")
const myservices = require("../services/imageStorage.service")
const {v4:uuid} = require("uuid")
const orderModel = require("../model/oder.model") 

async function menuHistoryLog(req, res){
    try{
        const allMenu = await historyMenuModel.find().sort({ createdAt: -1 }).limit(5);
        res.json(allMenu)
    }
    catch(error){
        res.json({"message": `something went wrong ${error}`})
    }
}

async function imageUpload(req,res){
    try{
        const uploading = await myservices.imageFileUpload(req.file.buffer, uuid())
        res.json(uploading.thumbnailUrl)
    }
    catch(error){
        res.json({"meesage": `Something Went Wrong: ${error}`})
    }
}

async function createMenu(req, res){
    //from menuHistoryLog

    try{
        const {mealType, basePrice, listOfSabjis, isNewMeal} = req.body
        const creatingMenu =await menuModel.updateOne(
            {mealType},
            {$set: {
                listOfSabjis,
                basePrice
            }},
            {upsert:true}
        )
        if (isNewMeal) {
            await historyMenuModel.create({
                mealType,
                listOfSabjis,
                basePrice,
            })
        }

        res.json(creatingMenu)

        
    }catch(error){
        res.status(500).json({message: `Something went Wrong: ${error}`})
    }
}

async function allOrders(req, res){
    try {
        const orders = await ordersModel.find();
        res.json(orders)
    } catch (error) {
        res.json({"message": `Somwthing went worng ${error}`})
    }
}

async function confirmedOrders(req, res){
    try {
        const allConfirmedOrders = await orderModel.find({ status: "Confirmed" });
        res.json(allConfirmedOrders)
    } catch (error) {
    res.json({'message': `Something went worng ${error}`})
    }
}

async function orderwithId(req, res){
    try {
        const { id } = req.params;
        const order = await orderModel.findOne({_id:id})
        res.json(order)
    } catch (error) {
    res.json({'message': `Somwthing went worng ${error}`})
    }
}


module.exports = {
    createMenu,
    menuHistoryLog, 
    imageUpload,
    allOrders, 
    confirmedOrders, 
    orderwithId
    }