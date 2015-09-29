'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	State = mongoose.model('State'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, state;

/**
 * State routes tests
 */
describe('State CRUD tests', function() {
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

		// Save a user to the test db and create new State
		user.save(function() {
			state = {
				name: 'State Name'
			};

			done();
		});
	});

	it('should be able to save State instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new State
				agent.post('/states')
					.send(state)
					.expect(200)
					.end(function(stateSaveErr, stateSaveRes) {
						// Handle State save error
						if (stateSaveErr) done(stateSaveErr);

						// Get a list of States
						agent.get('/states')
							.end(function(statesGetErr, statesGetRes) {
								// Handle State save error
								if (statesGetErr) done(statesGetErr);

								// Get States list
								var states = statesGetRes.body;

								// Set assertions
								(states[0].user._id).should.equal(userId);
								(states[0].name).should.match('State Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save State instance if not logged in', function(done) {
		agent.post('/states')
			.send(state)
			.expect(401)
			.end(function(stateSaveErr, stateSaveRes) {
				// Call the assertion callback
				done(stateSaveErr);
			});
	});

	it('should not be able to save State instance if no name is provided', function(done) {
		// Invalidate name field
		state.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new State
				agent.post('/states')
					.send(state)
					.expect(400)
					.end(function(stateSaveErr, stateSaveRes) {
						// Set message assertion
						(stateSaveRes.body.message).should.match('Please fill State name');
						
						// Handle State save error
						done(stateSaveErr);
					});
			});
	});

	it('should be able to update State instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new State
				agent.post('/states')
					.send(state)
					.expect(200)
					.end(function(stateSaveErr, stateSaveRes) {
						// Handle State save error
						if (stateSaveErr) done(stateSaveErr);

						// Update State name
						state.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing State
						agent.put('/states/' + stateSaveRes.body._id)
							.send(state)
							.expect(200)
							.end(function(stateUpdateErr, stateUpdateRes) {
								// Handle State update error
								if (stateUpdateErr) done(stateUpdateErr);

								// Set assertions
								(stateUpdateRes.body._id).should.equal(stateSaveRes.body._id);
								(stateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of States if not signed in', function(done) {
		// Create new State model instance
		var stateObj = new State(state);

		// Save the State
		stateObj.save(function() {
			// Request States
			request(app).get('/states')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single State if not signed in', function(done) {
		// Create new State model instance
		var stateObj = new State(state);

		// Save the State
		stateObj.save(function() {
			request(app).get('/states/' + stateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', state.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete State instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new State
				agent.post('/states')
					.send(state)
					.expect(200)
					.end(function(stateSaveErr, stateSaveRes) {
						// Handle State save error
						if (stateSaveErr) done(stateSaveErr);

						// Delete existing State
						agent.delete('/states/' + stateSaveRes.body._id)
							.send(state)
							.expect(200)
							.end(function(stateDeleteErr, stateDeleteRes) {
								// Handle State error error
								if (stateDeleteErr) done(stateDeleteErr);

								// Set assertions
								(stateDeleteRes.body._id).should.equal(stateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete State instance if not signed in', function(done) {
		// Set State user 
		state.user = user;

		// Create new State model instance
		var stateObj = new State(state);

		// Save the State
		stateObj.save(function() {
			// Try deleting State
			request(app).delete('/states/' + stateObj._id)
			.expect(401)
			.end(function(stateDeleteErr, stateDeleteRes) {
				// Set message assertion
				(stateDeleteRes.body.message).should.match('User is not logged in');

				// Handle State error error
				done(stateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		State.remove().exec();
		done();
	});
});