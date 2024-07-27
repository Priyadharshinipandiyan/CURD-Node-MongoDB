const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const UserModel = require('../models/userModel');
const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });

// Register a new user with image upload
router.post("/register", upload.single('image'), async (req, res) => {
    try {
        const { name, department, age, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            name,
            department,
            age,
            password: hashedPassword,
            image: req.file ? req.file.path : null // Save image path
        });
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

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '4h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upload an image (alternative endpoint if needed)
router.post("/upload", upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    res.status(200).json({
        message: "File uploaded successfully",
        file: req.file
    });
});

module.exports = router;
