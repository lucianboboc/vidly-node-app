require('dotenv').config();
const {describe, test, expect} = require('@jest/globals');
const {User} = require('../../../models/users');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('config');

describe('user.generateAuthToken', () => {
	test('should return a valid JWT', () => {
		const payload = {_id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true}
		const user = new User(payload);
		const token = user.generateAuthToken();
		const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
		expect(decoded).toMatchObject(payload);
	});
});

