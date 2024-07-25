require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Database connection
mongoose.connect("mongodb://127.0.0.1:27017/curd", { useNewUrlParser: true, useUnifiedTopology: true });

// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
