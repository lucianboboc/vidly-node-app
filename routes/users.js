const bcrypt = require('bcrypt');
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {User, validateUser} = require("../models/users");
const _ = require("lodash");

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(400).json({error: "User not found"});

    res.json({user});
});

router.post("/", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send("Invalid user");

    const userCount = await User.findOne({email: req.body.email}).countDocuments();
    if (userCount > 0) return res.status(400).send("User already registered");

    const user = new User(_.pick(req.body, "name", "email", "password"));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const resultUser = _.pick(user, ["_id", "name", "email"]);

    const token = user.generateAuthToken();
    res.status(201).header('x-auth-token', token).json({resultUser});
});

module.exports = router;