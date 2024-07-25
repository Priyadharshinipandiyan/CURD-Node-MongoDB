const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    department: String,
    age: Number,
    password: String
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
