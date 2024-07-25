const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
    try {
        const { name, department, age, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({ name, department, age, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login and generate a token
router.post("/login", async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await UserModel.findOne({ name });
        if (!user) return res.status(400).json({ error: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: "Invalid password" });

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET,{
            expiresIn:'4h',
        });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
