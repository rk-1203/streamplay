import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// New registration Entry.
const registerUser = asyncHandler(async (request, response) => {
    const { username, password } = request.body;
    if (!username || !password) {
        response.status(400);
        throw new Error("Please enter all required fields.");
    }
    const userExists = await User.findOne({ username });
    if (userExists) {
        response.status(400);
        throw new Error("User already exists.");
    }
    const newUser = await User.create({
        username,
        password,
    });
    const newUserToken = await newUser.generateAuthToken();
    // New user created seccessfully -> create new JWT token and send to user
    if (newUser) {
        response.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            token: newUserToken,
        });
    } else {
        response.status(400);
        throw new Error("Failed to register new user.");
    }
});

// User Login
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    // Verify User and generate token
    if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error("Invalid username or password.");
    }
    const token = await user.generateAuthToken();
    res.status(201);
    res.send({ user, token });
});

// User authentication
const authUser = asyncHandler(async (req, res) => {
    res.status(201);
});

// User logout
const logoutUser = asyncHandler(async (req, res) => {
    // Filter off current token.
    req.user.tokens = req.user.tokens.filter(
        (token) => token.token !== req.token
    );
    // Save the updated user information back to DB.
    await req.user.save();
    console.log("User logout");
    res.status(201).send();
});

export { registerUser, loginUser, logoutUser, authUser };
