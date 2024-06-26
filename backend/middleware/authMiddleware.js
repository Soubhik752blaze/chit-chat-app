const jwt = require('jsonwebtoken');
const User = require("../models/userModel");

const protect = async (req, res, next) => {
    let token;
  
    //if token is present
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
        // console.log(1);
      try {
        token = req.headers.authorization.split(" ")[1];
  
        //decodes token id
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
        req.user = await User.findById(decoded.id).select("-password");
  
        next();
      } catch (error) {
        res.status(401).json({
            message: 'Not authorized, User needs to Relogin.'
        });
    }
  
    //if no token
    if (!token) {
        res.status(400).json({
            message: 'Not authorized, no token!!'
        });
    }
  }
};
  
  module.exports = { protect };