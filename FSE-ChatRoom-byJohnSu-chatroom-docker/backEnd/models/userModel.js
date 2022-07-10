/**
 * User: single user information schema.
 * 1. username
 * 2. password
 * 3. CreateAt
 * 4. tokens
 */
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userModel = mongoose.Schema({
    username: {
        type: String,
        trim: true,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

// Password matching function
userModel.methods.matchPassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

// Allow user model generate JWT token
userModel.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_PASS, {
        expiresIn: "30d",
    });
    // Store token into DB for user
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

// Encoding password before saving to DB
userModel.pre("save", async function (next) {
    if (this.isModified("password")) {
        // 透過 bcrypt 處理密碼，獲得 hashed password
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

const User = mongoose.model("User", userModel);
export default User;
