'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Federation = mongoose.model('Federation'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, federation;

/**
 * Federation routes tests
 */
describe('Federation CRUD tests', function() {
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

		// Save a user to the test db and create new Federation
		user.save(function() {
			federation = {
				name: 'Federation Name'
			};

			done();
		});
	});

	it('should be able to save Federation instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Federation
				agent.post('/federations')
					.send(federation)
					.expect(200)
					.end(function(federationSaveErr, federationSaveRes) {
						// Handle Federation save error
						if (federationSaveErr) done(federationSaveErr);

						// Get a list of Federations
						agent.get('/federations')
							.end(function(federationsGetErr, federationsGetRes) {
								// Handle Federation save error
								if (federationsGetErr) done(federationsGetErr);

								// Get Federations list
								var federations = federationsGetRes.body;

								// Set assertions
								(federations[0].user._id).should.equal(userId);
								(federations[0].name).should.match('Federation Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Federation instance if not logged in', function(done) {
		agent.post('/federations')
			.send(federation)
			.expect(401)
			.end(function(federationSaveErr, federationSaveRes) {
				// Call the assertion callback
				done(federationSaveErr);
			});
	});

	it('should not be able to save Federation instance if no name is provided', function(done) {
		// Invalidate name field
		federation.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Federation
				agent.post('/federations')
					.send(federation)
					.expect(400)
					.end(function(federationSaveErr, federationSaveRes) {
						// Set message assertion
						(federationSaveRes.body.message).should.match('Please fill Federation name');
						
						// Handle Federation save error
						done(federationSaveErr);
					});
			});
	});

	it('should be able to update Federation instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Federation
				agent.post('/federations')
					.send(federation)
					.expect(200)
					.end(function(federationSaveErr, federationSaveRes) {
						// Handle Federation save error
						if (federationSaveErr) done(federationSaveErr);

						// Update Federation name
						federation.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Federation
						agent.put('/federations/' + federationSaveRes.body._id)
							.send(federation)
							.expect(200)
							.end(function(federationUpdateErr, federationUpdateRes) {
								// Handle Federation update error
								if (federationUpdateErr) done(federationUpdateErr);

								// Set assertions
								(federationUpdateRes.body._id).should.equal(federationSaveRes.body._id);
								(federationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Federations if not signed in', function(done) {
		// Create new Federation model instance
		var federationObj = new Federation(federation);

		// Save the Federation
		federationObj.save(function() {
			// Request Federations
			request(app).get('/federations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Federation if not signed in', function(done) {
		// Create new Federation model instance
		var federationObj = new Federation(federation);

		// Save the Federation
		federationObj.save(function() {
			request(app).get('/federations/' + federationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', federation.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Federation instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Federation
				agent.post('/federations')
					.send(federation)
					.expect(200)
					.end(function(federationSaveErr, federationSaveRes) {
						// Handle Federation save error
						if (federationSaveErr) done(federationSaveErr);

						// Delete existing Federation
						agent.delete('/federations/' + federationSaveRes.body._id)
							.send(federation)
							.expect(200)
							.end(function(federationDeleteErr, federationDeleteRes) {
								// Handle Federation error error
								if (federationDeleteErr) done(federationDeleteErr);

								// Set assertions
								(federationDeleteRes.body._id).should.equal(federationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Federation instance if not signed in', function(done) {
		// Set Federation user 
		federation.user = user;

		// Create new Federation model instance
		var federationObj = new Federation(federation);

		// Save the Federation
		federationObj.save(function() {
			// Try deleting Federation
			request(app).delete('/federations/' + federationObj._id)
			.expect(401)
			.end(function(federationDeleteErr, federationDeleteRes) {
				// Set message assertion
				(federationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Federation error error
				done(federationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Federation.remove().exec();
		done();
	});
});