'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Perfomance = mongoose.model('Perfomance'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, perfomance;

/**
 * Perfomance routes tests
 */
describe('Perfomance CRUD tests', function() {
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

		// Save a user to the test db and create new Perfomance
		user.save(function() {
			perfomance = {
				name: 'Perfomance Name'
			};

			done();
		});
	});

	it('should be able to save Perfomance instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Perfomance
				agent.post('/perfomances')
					.send(perfomance)
					.expect(200)
					.end(function(perfomanceSaveErr, perfomanceSaveRes) {
						// Handle Perfomance save error
						if (perfomanceSaveErr) done(perfomanceSaveErr);

						// Get a list of Perfomances
						agent.get('/perfomances')
							.end(function(perfomancesGetErr, perfomancesGetRes) {
								// Handle Perfomance save error
								if (perfomancesGetErr) done(perfomancesGetErr);

								// Get Perfomances list
								var perfomances = perfomancesGetRes.body;

								// Set assertions
								(perfomances[0].user._id).should.equal(userId);
								(perfomances[0].name).should.match('Perfomance Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Perfomance instance if not logged in', function(done) {
		agent.post('/perfomances')
			.send(perfomance)
			.expect(401)
			.end(function(perfomanceSaveErr, perfomanceSaveRes) {
				// Call the assertion callback
				done(perfomanceSaveErr);
			});
	});

	it('should not be able to save Perfomance instance if no name is provided', function(done) {
		// Invalidate name field
		perfomance.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Perfomance
				agent.post('/perfomances')
					.send(perfomance)
					.expect(400)
					.end(function(perfomanceSaveErr, perfomanceSaveRes) {
						// Set message assertion
						(perfomanceSaveRes.body.message).should.match('Please fill Perfomance name');
						
						// Handle Perfomance save error
						done(perfomanceSaveErr);
					});
			});
	});

	it('should be able to update Perfomance instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Perfomance
				agent.post('/perfomances')
					.send(perfomance)
					.expect(200)
					.end(function(perfomanceSaveErr, perfomanceSaveRes) {
						// Handle Perfomance save error
						if (perfomanceSaveErr) done(perfomanceSaveErr);

						// Update Perfomance name
						perfomance.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Perfomance
						agent.put('/perfomances/' + perfomanceSaveRes.body._id)
							.send(perfomance)
							.expect(200)
							.end(function(perfomanceUpdateErr, perfomanceUpdateRes) {
								// Handle Perfomance update error
								if (perfomanceUpdateErr) done(perfomanceUpdateErr);

								// Set assertions
								(perfomanceUpdateRes.body._id).should.equal(perfomanceSaveRes.body._id);
								(perfomanceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Perfomances if not signed in', function(done) {
		// Create new Perfomance model instance
		var perfomanceObj = new Perfomance(perfomance);

		// Save the Perfomance
		perfomanceObj.save(function() {
			// Request Perfomances
			request(app).get('/perfomances')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Perfomance if not signed in', function(done) {
		// Create new Perfomance model instance
		var perfomanceObj = new Perfomance(perfomance);

		// Save the Perfomance
		perfomanceObj.save(function() {
			request(app).get('/perfomances/' + perfomanceObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', perfomance.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Perfomance instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Perfomance
				agent.post('/perfomances')
					.send(perfomance)
					.expect(200)
					.end(function(perfomanceSaveErr, perfomanceSaveRes) {
						// Handle Perfomance save error
						if (perfomanceSaveErr) done(perfomanceSaveErr);

						// Delete existing Perfomance
						agent.delete('/perfomances/' + perfomanceSaveRes.body._id)
							.send(perfomance)
							.expect(200)
							.end(function(perfomanceDeleteErr, perfomanceDeleteRes) {
								// Handle Perfomance error error
								if (perfomanceDeleteErr) done(perfomanceDeleteErr);

								// Set assertions
								(perfomanceDeleteRes.body._id).should.equal(perfomanceSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Perfomance instance if not signed in', function(done) {
		// Set Perfomance user 
		perfomance.user = user;

		// Create new Perfomance model instance
		var perfomanceObj = new Perfomance(perfomance);

		// Save the Perfomance
		perfomanceObj.save(function() {
			// Try deleting Perfomance
			request(app).delete('/perfomances/' + perfomanceObj._id)
			.expect(401)
			.end(function(perfomanceDeleteErr, perfomanceDeleteRes) {
				// Set message assertion
				(perfomanceDeleteRes.body.message).should.match('User is not logged in');

				// Handle Perfomance error error
				done(perfomanceDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Perfomance.remove().exec();
		done();
	});
});