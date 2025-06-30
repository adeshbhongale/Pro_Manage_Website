const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access!" });
    }

    const decodeToken = jwt.verify(token, process.env.SECRET_CODE);
    req.userId = decodeToken.userId;
    req.email = decodeToken.email;
    req.name = decodeToken.name;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ errorMessage: "Invalid Token!" });
  }
};

module.exports = verifyToken;
