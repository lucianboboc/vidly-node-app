require('dotenv').config();
const bcrypt = require('bcrypt');
const express = require("express");
const router = express.Router();
const {User, validateUser} = require("../models/users");
const _ = require("lodash");
const Joi = require("joi");

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({error: "Invalid credentials"});

    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).json({error: "Invalid credentials"});

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).json({error: "Invalid credentials"});

    // authenticate user, create login token
    const token = user.generateAuthToken();

    res.status(200).json({token: token});
});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(6).max(255).required(),
    });

    return schema.validate(req);
}

module.exports = router;