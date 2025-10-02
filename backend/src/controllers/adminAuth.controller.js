const bcrypt = require('bcrypt');
const adminModel = require("../model/admin.model")
const jwt = require("jsonwebtoken")
async function adminLogin(req, res){
    try {
    let { email, password } = req.body;
    email=  email.toLowerCase()

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail)
      return res.status(400).json({ message: "Please Enter a Vaild Email" });
    if(!password.trim()) return res.status(400).json({message: "Please Enter a Password"})

    const theAdmin = await adminModel.findOne({ email });
    if (!theAdmin)
      return res.status(400).json({ message: "Invalid email or password" });

    // const makePw =  await bcrypt.hash(password, 10)
    // console.log(makePw)

    const validPassword = await bcrypt.compare(password, theAdmin.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid email or password" });
    const token = jwt.sign({ _id: theAdmin._id }, process.env.JWT_SECRET, {expiresIn: "90d"});
    res.cookie("token", token);
    return res
      .status(200)
      .json({ message: `Login Successfull!`, token });
  } catch (error) {
    res.status(500).json({ message: `Someting Went Wrong ${error}`});
  }
}

function adminLogout(req, res){
  res.clearCookie("token");
  res.status(200).json({ message: "Admin Logout Successfully!!!" });

}

module.exports = {adminLogin, adminLogout}