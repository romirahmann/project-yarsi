const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const generateToken = (userData) => {
  return jwt.sign(userData, SECRET_KEY, { expiresIn: "24h" });
};

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "No Token Provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ error: "Failed to autheticate token" });
    }

    req.user = decoded;
    next;
  });
};

const accessControl = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next;
};

module.exports = {
  generateToken,
  verifyToken,
  accessControl,
};
