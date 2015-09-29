'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Dimension = mongoose.model('Dimension'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, dimension;

/**
 * Dimension routes tests
 */
describe('Dimension CRUD tests', function() {
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

		// Save a user to the test db and create new Dimension
		user.save(function() {
			dimension = {
				name: 'Dimension Name'
			};

			done();
		});
	});

	it('should be able to save Dimension instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dimension
				agent.post('/dimensions')
					.send(dimension)
					.expect(200)
					.end(function(dimensionSaveErr, dimensionSaveRes) {
						// Handle Dimension save error
						if (dimensionSaveErr) done(dimensionSaveErr);

						// Get a list of Dimensions
						agent.get('/dimensions')
							.end(function(dimensionsGetErr, dimensionsGetRes) {
								// Handle Dimension save error
								if (dimensionsGetErr) done(dimensionsGetErr);

								// Get Dimensions list
								var dimensions = dimensionsGetRes.body;

								// Set assertions
								(dimensions[0].user._id).should.equal(userId);
								(dimensions[0].name).should.match('Dimension Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Dimension instance if not logged in', function(done) {
		agent.post('/dimensions')
			.send(dimension)
			.expect(401)
			.end(function(dimensionSaveErr, dimensionSaveRes) {
				// Call the assertion callback
				done(dimensionSaveErr);
			});
	});

	it('should not be able to save Dimension instance if no name is provided', function(done) {
		// Invalidate name field
		dimension.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dimension
				agent.post('/dimensions')
					.send(dimension)
					.expect(400)
					.end(function(dimensionSaveErr, dimensionSaveRes) {
						// Set message assertion
						(dimensionSaveRes.body.message).should.match('Please fill Dimension name');
						
						// Handle Dimension save error
						done(dimensionSaveErr);
					});
			});
	});

	it('should be able to update Dimension instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dimension
				agent.post('/dimensions')
					.send(dimension)
					.expect(200)
					.end(function(dimensionSaveErr, dimensionSaveRes) {
						// Handle Dimension save error
						if (dimensionSaveErr) done(dimensionSaveErr);

						// Update Dimension name
						dimension.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Dimension
						agent.put('/dimensions/' + dimensionSaveRes.body._id)
							.send(dimension)
							.expect(200)
							.end(function(dimensionUpdateErr, dimensionUpdateRes) {
								// Handle Dimension update error
								if (dimensionUpdateErr) done(dimensionUpdateErr);

								// Set assertions
								(dimensionUpdateRes.body._id).should.equal(dimensionSaveRes.body._id);
								(dimensionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Dimensions if not signed in', function(done) {
		// Create new Dimension model instance
		var dimensionObj = new Dimension(dimension);

		// Save the Dimension
		dimensionObj.save(function() {
			// Request Dimensions
			request(app).get('/dimensions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Dimension if not signed in', function(done) {
		// Create new Dimension model instance
		var dimensionObj = new Dimension(dimension);

		// Save the Dimension
		dimensionObj.save(function() {
			request(app).get('/dimensions/' + dimensionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', dimension.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Dimension instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dimension
				agent.post('/dimensions')
					.send(dimension)
					.expect(200)
					.end(function(dimensionSaveErr, dimensionSaveRes) {
						// Handle Dimension save error
						if (dimensionSaveErr) done(dimensionSaveErr);

						// Delete existing Dimension
						agent.delete('/dimensions/' + dimensionSaveRes.body._id)
							.send(dimension)
							.expect(200)
							.end(function(dimensionDeleteErr, dimensionDeleteRes) {
								// Handle Dimension error error
								if (dimensionDeleteErr) done(dimensionDeleteErr);

								// Set assertions
								(dimensionDeleteRes.body._id).should.equal(dimensionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Dimension instance if not signed in', function(done) {
		// Set Dimension user 
		dimension.user = user;

		// Create new Dimension model instance
		var dimensionObj = new Dimension(dimension);

		// Save the Dimension
		dimensionObj.save(function() {
			// Try deleting Dimension
			request(app).delete('/dimensions/' + dimensionObj._id)
			.expect(401)
			.end(function(dimensionDeleteErr, dimensionDeleteRes) {
				// Set message assertion
				(dimensionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Dimension error error
				done(dimensionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Dimension.remove().exec();
		done();
	});
});