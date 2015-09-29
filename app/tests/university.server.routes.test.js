'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	University = mongoose.model('University'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, university;

/**
 * University routes tests
 */
describe('University CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new University
		user.save(function() {
			university = {
				name: 'University Name'
			};

			done();
		});
	});

	it('should be able to save University instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new University
				agent.post('/universities')
					.send(university)
					.expect(200)
					.end(function(universitySaveErr, universitySaveRes) {
						// Handle University save error
						if (universitySaveErr) done(universitySaveErr);

						// Get a list of Universities
						agent.get('/universities')
							.end(function(universitiesGetErr, universitiesGetRes) {
								// Handle University save error
								if (universitiesGetErr) done(universitiesGetErr);

								// Get Universities list
								var universities = universitiesGetRes.body;

								// Set assertions
								(universities[0].user._id).should.equal(userId);
								(universities[0].name).should.match('University Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save University instance if not logged in', function(done) {
		agent.post('/universities')
			.send(university)
			.expect(401)
			.end(function(universitySaveErr, universitySaveRes) {
				// Call the assertion callback
				done(universitySaveErr);
			});
	});

	it('should not be able to save University instance if no name is provided', function(done) {
		// Invalidate name field
		university.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new University
				agent.post('/universities')
					.send(university)
					.expect(400)
					.end(function(universitySaveErr, universitySaveRes) {
						// Set message assertion
						(universitySaveRes.body.message).should.match('Please fill University name');
						
						// Handle University save error
						done(universitySaveErr);
					});
			});
	});

	it('should be able to update University instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new University
				agent.post('/universities')
					.send(university)
					.expect(200)
					.end(function(universitySaveErr, universitySaveRes) {
						// Handle University save error
						if (universitySaveErr) done(universitySaveErr);

						// Update University name
						university.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing University
						agent.put('/universities/' + universitySaveRes.body._id)
							.send(university)
							.expect(200)
							.end(function(universityUpdateErr, universityUpdateRes) {
								// Handle University update error
								if (universityUpdateErr) done(universityUpdateErr);

								// Set assertions
								(universityUpdateRes.body._id).should.equal(universitySaveRes.body._id);
								(universityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Universities if not signed in', function(done) {
		// Create new University model instance
		var universityObj = new University(university);

		// Save the University
		universityObj.save(function() {
			// Request Universities
			request(app).get('/universities')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single University if not signed in', function(done) {
		// Create new University model instance
		var universityObj = new University(university);

		// Save the University
		universityObj.save(function() {
			request(app).get('/universities/' + universityObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', university.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete University instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new University
				agent.post('/universities')
					.send(university)
					.expect(200)
					.end(function(universitySaveErr, universitySaveRes) {
						// Handle University save error
						if (universitySaveErr) done(universitySaveErr);

						// Delete existing University
						agent.delete('/universities/' + universitySaveRes.body._id)
							.send(university)
							.expect(200)
							.end(function(universityDeleteErr, universityDeleteRes) {
								// Handle University error error
								if (universityDeleteErr) done(universityDeleteErr);

								// Set assertions
								(universityDeleteRes.body._id).should.equal(universitySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete University instance if not signed in', function(done) {
		// Set University user 
		university.user = user;

		// Create new University model instance
		var universityObj = new University(university);

		// Save the University
		universityObj.save(function() {
			// Try deleting University
			request(app).delete('/universities/' + universityObj._id)
			.expect(401)
			.end(function(universityDeleteErr, universityDeleteRes) {
				// Set message assertion
				(universityDeleteRes.body.message).should.match('User is not logged in');

				// Handle University error error
				done(universityDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		University.remove().exec();
		done();
	});
});