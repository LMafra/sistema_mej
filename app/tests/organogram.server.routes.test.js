'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Organogram = mongoose.model('Organogram'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, organogram;

/**
 * Organogram routes tests
 */
describe('Organogram CRUD tests', function() {
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

		// Save a user to the test db and create new Organogram
		user.save(function() {
			organogram = {
				name: 'Organogram Name'
			};

			done();
		});
	});

	it('should be able to save Organogram instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organogram
				agent.post('/organograms')
					.send(organogram)
					.expect(200)
					.end(function(organogramSaveErr, organogramSaveRes) {
						// Handle Organogram save error
						if (organogramSaveErr) done(organogramSaveErr);

						// Get a list of Organograms
						agent.get('/organograms')
							.end(function(organogramsGetErr, organogramsGetRes) {
								// Handle Organogram save error
								if (organogramsGetErr) done(organogramsGetErr);

								// Get Organograms list
								var organograms = organogramsGetRes.body;

								// Set assertions
								(organograms[0].user._id).should.equal(userId);
								(organograms[0].name).should.match('Organogram Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Organogram instance if not logged in', function(done) {
		agent.post('/organograms')
			.send(organogram)
			.expect(401)
			.end(function(organogramSaveErr, organogramSaveRes) {
				// Call the assertion callback
				done(organogramSaveErr);
			});
	});

	it('should not be able to save Organogram instance if no name is provided', function(done) {
		// Invalidate name field
		organogram.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organogram
				agent.post('/organograms')
					.send(organogram)
					.expect(400)
					.end(function(organogramSaveErr, organogramSaveRes) {
						// Set message assertion
						(organogramSaveRes.body.message).should.match('Please fill Organogram name');
						
						// Handle Organogram save error
						done(organogramSaveErr);
					});
			});
	});

	it('should be able to update Organogram instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organogram
				agent.post('/organograms')
					.send(organogram)
					.expect(200)
					.end(function(organogramSaveErr, organogramSaveRes) {
						// Handle Organogram save error
						if (organogramSaveErr) done(organogramSaveErr);

						// Update Organogram name
						organogram.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Organogram
						agent.put('/organograms/' + organogramSaveRes.body._id)
							.send(organogram)
							.expect(200)
							.end(function(organogramUpdateErr, organogramUpdateRes) {
								// Handle Organogram update error
								if (organogramUpdateErr) done(organogramUpdateErr);

								// Set assertions
								(organogramUpdateRes.body._id).should.equal(organogramSaveRes.body._id);
								(organogramUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Organograms if not signed in', function(done) {
		// Create new Organogram model instance
		var organogramObj = new Organogram(organogram);

		// Save the Organogram
		organogramObj.save(function() {
			// Request Organograms
			request(app).get('/organograms')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Organogram if not signed in', function(done) {
		// Create new Organogram model instance
		var organogramObj = new Organogram(organogram);

		// Save the Organogram
		organogramObj.save(function() {
			request(app).get('/organograms/' + organogramObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', organogram.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Organogram instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organogram
				agent.post('/organograms')
					.send(organogram)
					.expect(200)
					.end(function(organogramSaveErr, organogramSaveRes) {
						// Handle Organogram save error
						if (organogramSaveErr) done(organogramSaveErr);

						// Delete existing Organogram
						agent.delete('/organograms/' + organogramSaveRes.body._id)
							.send(organogram)
							.expect(200)
							.end(function(organogramDeleteErr, organogramDeleteRes) {
								// Handle Organogram error error
								if (organogramDeleteErr) done(organogramDeleteErr);

								// Set assertions
								(organogramDeleteRes.body._id).should.equal(organogramSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Organogram instance if not signed in', function(done) {
		// Set Organogram user 
		organogram.user = user;

		// Create new Organogram model instance
		var organogramObj = new Organogram(organogram);

		// Save the Organogram
		organogramObj.save(function() {
			// Try deleting Organogram
			request(app).delete('/organograms/' + organogramObj._id)
			.expect(401)
			.end(function(organogramDeleteErr, organogramDeleteRes) {
				// Set message assertion
				(organogramDeleteRes.body.message).should.match('User is not logged in');

				// Handle Organogram error error
				done(organogramDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Organogram.remove().exec();
		done();
	});
});