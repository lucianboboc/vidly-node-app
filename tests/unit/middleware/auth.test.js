const {
	describe,
	beforeEach,
	afterEach,
	test,
	expect
} = require('@jest/globals');
const {User} = require('../../../models/users');
const auth = require('../../../middleware/auth');
const mongoose = require("mongoose");

describe('auth middleware', () => {
	test('should populate the req.user with the payload of a valid JWT', () => {
		const user = {
			_id: new mongoose.Types.ObjectId().toHexString(),
			isAdmin: true
		};
		const token = new User(user).generateAuthToken();
		const req = {
			header: jest.fn().mockReturnValue(token)
		};
		const res = {};
		const next = jest.fn();

		auth(req, res, next);
		expect(req.user).toBeDefined();
		expect(req.user).toMatchObject(user);
		expect(next.mock.calls.length).toBe(1);
	});
});