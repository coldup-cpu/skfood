const jwt = require("jsonwebtoken");

function authMiddlewareForFileStorage(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // if (decoded) return res.json("True");
    console.log(decoded._id)
    res.userInfo = decoded._id
    next()
  } catch (error) {
    res.status(500).json("Good Try Mate, But better Next Time :)");
  }
}


module.exports = {authMiddlewareForFileStorage}