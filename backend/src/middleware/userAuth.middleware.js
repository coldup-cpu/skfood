const jwt = require("jsonwebtoken");

function userAuthMiddlewareForAuth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // if (decoded) return res.json("True");
    console.log("From MiddleWare: ", decoded._id)
    res.userId = decoded._id

    next()
  } catch (error) {
    res.status(500).json("Good Try Mate, But better Next Time :)");
  }
}


module.exports = {userAuthMiddlewareForAuth}