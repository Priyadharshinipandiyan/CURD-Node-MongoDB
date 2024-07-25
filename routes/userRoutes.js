const express = require('express');
const UserModel = require('../models/userModel');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Example protected route
router.get("/", authenticateToken, (req, res) => {
    UserModel.find({})
        .then(users => res.json({ users }))
        .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
