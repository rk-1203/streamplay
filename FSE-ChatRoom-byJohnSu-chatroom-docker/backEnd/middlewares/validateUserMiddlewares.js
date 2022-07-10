import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// Token validation
const validUser = asyncHandler(async (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_PASS);
    const user = await User.findOne({
        _id: decoded._id,
        "tokens.token": token,
    });

    // if user not find then -> throw an error.
    if (!user) {
        res.status(401);
        res.sendFile("../public/invalid.html");
        throw new Error("Not authorized, invlid token.");
    }
    // Store user info and token to request session
    req.token = token;
    req.user = user;
    next();
});

export { validUser };
