const mongoose = require('mongoose');

function connectDB(){
    try{
        mongoose.connect(process.env.MONGODB_URI, console.log("✅ DB Conected Succesufully!"))
    }
    catch(error){
        console.log(`Database Connection Error: ${error}`)
    }
}

module.exports = connectDB