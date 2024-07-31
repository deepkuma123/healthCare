const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;
const User = require("../models/userModel");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];

  try {
    // Verify the token
    // console.log(token);
    const decoded = jwt.verify(token, jwtSecret);

    // Fetch user from the database using the ID from the token
    const user = await User.findOne({
      phoneNumber: decoded.phoneNumber,
    }).exec();

    console.log({ user });
    // If the user is not found, respond with 403 Forbidden
    if (!user) {
      return res.status(403).json({ success: false, msg: "User not found" });
    }

    // Attach user to request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.log(err);
    // If token is invalid or other errors occur, respond with 403 Forbidden
    return res.status(403).json({ success: false, msg: err.message });
  }
};

module.exports = authenticateToken;
