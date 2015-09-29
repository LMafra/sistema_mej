'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Degree = mongoose.model('Degree'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, degree;

/**
 * Degree routes tests
 */
describe('Degree CRUD tests', function() {
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

		// Save a user to the test db and create new Degree
		user.save(function() {
			degree = {
				name: 'Degree Name'
			};

			done();
		});
	});

	it('should be able to save Degree instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Degree
				agent.post('/degrees')
					.send(degree)
					.expect(200)
					.end(function(degreeSaveErr, degreeSaveRes) {
						// Handle Degree save error
						if (degreeSaveErr) done(degreeSaveErr);

						// Get a list of Degrees
						agent.get('/degrees')
							.end(function(degreesGetErr, degreesGetRes) {
								// Handle Degree save error
								if (degreesGetErr) done(degreesGetErr);

								// Get Degrees list
								var degrees = degreesGetRes.body;

								// Set assertions
								(degrees[0].user._id).should.equal(userId);
								(degrees[0].name).should.match('Degree Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Degree instance if not logged in', function(done) {
		agent.post('/degrees')
			.send(degree)
			.expect(401)
			.end(function(degreeSaveErr, degreeSaveRes) {
				// Call the assertion callback
				done(degreeSaveErr);
			});
	});

	it('should not be able to save Degree instance if no name is provided', function(done) {
		// Invalidate name field
		degree.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Degree
				agent.post('/degrees')
					.send(degree)
					.expect(400)
					.end(function(degreeSaveErr, degreeSaveRes) {
						// Set message assertion
						(degreeSaveRes.body.message).should.match('Please fill Degree name');
						
						// Handle Degree save error
						done(degreeSaveErr);
					});
			});
	});

	it('should be able to update Degree instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Degree
				agent.post('/degrees')
					.send(degree)
					.expect(200)
					.end(function(degreeSaveErr, degreeSaveRes) {
						// Handle Degree save error
						if (degreeSaveErr) done(degreeSaveErr);

						// Update Degree name
						degree.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Degree
						agent.put('/degrees/' + degreeSaveRes.body._id)
							.send(degree)
							.expect(200)
							.end(function(degreeUpdateErr, degreeUpdateRes) {
								// Handle Degree update error
								if (degreeUpdateErr) done(degreeUpdateErr);

								// Set assertions
								(degreeUpdateRes.body._id).should.equal(degreeSaveRes.body._id);
								(degreeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Degrees if not signed in', function(done) {
		// Create new Degree model instance
		var degreeObj = new Degree(degree);

		// Save the Degree
		degreeObj.save(function() {
			// Request Degrees
			request(app).get('/degrees')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Degree if not signed in', function(done) {
		// Create new Degree model instance
		var degreeObj = new Degree(degree);

		// Save the Degree
		degreeObj.save(function() {
			request(app).get('/degrees/' + degreeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', degree.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Degree instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Degree
				agent.post('/degrees')
					.send(degree)
					.expect(200)
					.end(function(degreeSaveErr, degreeSaveRes) {
						// Handle Degree save error
						if (degreeSaveErr) done(degreeSaveErr);

						// Delete existing Degree
						agent.delete('/degrees/' + degreeSaveRes.body._id)
							.send(degree)
							.expect(200)
							.end(function(degreeDeleteErr, degreeDeleteRes) {
								// Handle Degree error error
								if (degreeDeleteErr) done(degreeDeleteErr);

								// Set assertions
								(degreeDeleteRes.body._id).should.equal(degreeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Degree instance if not signed in', function(done) {
		// Set Degree user 
		degree.user = user;

		// Create new Degree model instance
		var degreeObj = new Degree(degree);

		// Save the Degree
		degreeObj.save(function() {
			// Try deleting Degree
			request(app).delete('/degrees/' + degreeObj._id)
			.expect(401)
			.end(function(degreeDeleteErr, degreeDeleteRes) {
				// Set message assertion
				(degreeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Degree error error
				done(degreeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Degree.remove().exec();
		done();
	});
});