const {
	describe,
	beforeEach,
	afterEach,
	test,
	expect
} = require('@jest/globals');
const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/users');
const mongoose = require("mongoose");

describe('/api/genres', () => {
	let server;
	beforeEach( () => { server = require('../../index'); });
	afterEach(async () => {
		await Genre.deleteMany({});
			// mongoose.connection.close();
		server.close();
	});

	describe('GET /', () => {
		test('should return all genres', async () => {
			await Genre.collection.insertMany([
				{name: 'genre1'},
				{name: 'genre2'},
			]);
			const res = await request(server).get('/api/genres');
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
			expect(res.body.some(g=>g.name === 'genre1')).toBe(true);
		});
	});

	describe('GET /:id', () => {
		test('should return one genre', async () => {
			const genre = new Genre({name: 'genre1'});
			await genre.save();

			const res = await request(server).get('/api/genres/' + genre._id);
			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({_id: genre._id.toHexString(), name: 'genre1'})
		});

		test('should return 404 if id is not found', async () => {
			const res = await request(server).get('/api/genres/' + '23434r34dds');
			expect(res.status).toBe(404);
		});
	});

	describe('POST /', () => {
		let token;
		let name;
		beforeEach(async () => {
			token = new User().generateAuthToken();
			name = 'genre1';
		})

		const exec = async () => {
			return await request(server)
				.post('/api/genres')
				.set('x-auth-token', token)
				.send({name});
		};

		test('should return 401 if client is not logged in', async () => {
			token = '';
			const res = await exec();
			expect(res.status).toBe(401);
		});

		test('should return 400 if genre is less than 5 characters', async () => {
			name = '1234';
			const res = await exec();
			expect(res.status).toBe(400);
		});

		test('should return 400 if genre is more than 50 characters', async () => {
			name = Array(65).join('a');
			const res = await exec();
			expect(res.status).toBe(400);
		});

		test('should save the genre if it is valid', async () => {
			await exec();
			const genre = await Genre.find({name: 'genre1'});
			expect(genre).not.toBeNull();
		});

		test('should return the genre if it is valid', async () => {
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('_id')
			expect(res.body).toHaveProperty('name', 'genre1');
		});
	});

	describe('DELETE /', () => {
		let token;
		beforeEach(async () => {
			token = new User({isAdmin: true}).generateAuthToken();
		});

		const exec = async (id) => {
			return await request(server)
				.delete('/api/genres/' + id)
				.set('x-auth-token', token);
		};

		test('should return 401 if no auto token is provided', async () => {
			token = '';
			const res = await exec();
			expect(res.status).toBe(401);
		});

		test('should return 404 if the object id is not valid', async () => {
			const objectId = '32rdefs';
			const res = await exec(objectId);
			expect(res.status).toBe(404);
		});

		test('should return 404 if the object is not found', async () => {
			const objectId = new mongoose.Types.ObjectId().toHexString();
			const res = await exec(objectId);
			expect(res.status).toBe(404);
		});

		test('should return 200 if the object was deleted successfully', async () => {
			const genre = new Genre({name: 'genre1'});
			genre.save();
			const res = await exec(genre._id);
			expect(res.status).toBe(200);
		});
	});
});

