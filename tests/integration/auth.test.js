const {
	describe,
	beforeEach,
	afterEach,
	test,
	expect
} = require('@jest/globals');
const request = require('supertest');
const {User} = require('../../models/users');
const {Genre} = require("../../models/genre");

describe('auth middleware', () => {
	let token;
	let server;
	beforeEach( () => {
		server = require('../../index');
		token = new User().generateAuthToken();
	});
	afterEach( async () => {
		await Genre.deleteMany({});
		server.close()
	});

	const exec = async () => {
		return await request(server)
			.post('/api/genres')
			.set('x-auth-token', token)
			.send({name: 'genre1'});
	};

	test('should return 401 if no token is provided', async () => {
		token = '';
		const res = await exec();
		expect(res.status).toBe(401);
	});

	test('should return 400 if token is invalid', async () => {
		token = 'awr324fsdfwfgwewegf';
		const res = await exec();
		expect(res.status).toBe(400);
	});
});