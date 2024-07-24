const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/curd", { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
    name: String,
    department: String,
    age: Number
});

const UserModel = mongoose.model("users", UserSchema);

// Create a new user
app.post("/createUser", (req, res) => {
    const newUser = new UserModel(req.body);
    newUser.save()
        .then(user => res.status(201).json(user))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Read all users
app.get("/getUsers", (req, res) => {
    UserModel.find({})
        .then(users => res.json({ users: users }))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Read a single user by ID
app.get("/getUser/:id", (req, res) => {
    UserModel.findById(req.params.id)
        .then(user => {
            if (user) res.json(user);
            else res.status(404).json({ error: "User not found" });
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Update a user by ID
app.put("/updateUser/:id", (req, res) => {
    UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(user => {
            if (user) res.json(user);
            else res.status(404).json({ error: "User not found" });
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Delete a user by ID
app.delete("/deleteUser/:id", (req, res) => {
    UserModel.findByIdAndDelete(req.params.id)
        .then(user => {
            if (user) res.json({ message: "User deleted successfully" });
            else res.status(404).json({ error: "User not found" });
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Insert data from JSON file
app.post("/insertUsersFromFile", (req, res) => {
    const filePath = path.join(__dirname, 'users.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const users = JSON.parse(data);
        UserModel.insertMany(users)
            .then(result => res.status(201).json({ message: "Users inserted successfully", data: result }))
            .catch(err => res.status(500).json({ error: err.message }));
    });
});

app.listen(3000, () => {
    console.log("Server is Running");
});
