'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	JuniorCompany = mongoose.model('JuniorCompany'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, juniorCompany;

/**
 * Junior company routes tests
 */
describe('Junior company CRUD tests', function() {
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

		// Save a user to the test db and create new Junior company
		user.save(function() {
			juniorCompany = {
				name: 'Junior company Name'
			};

			done();
		});
	});

	it('should be able to save Junior company instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Junior company
				agent.post('/junior-companies')
					.send(juniorCompany)
					.expect(200)
					.end(function(juniorCompanySaveErr, juniorCompanySaveRes) {
						// Handle Junior company save error
						if (juniorCompanySaveErr) done(juniorCompanySaveErr);

						// Get a list of Junior companies
						agent.get('/junior-companies')
							.end(function(juniorCompaniesGetErr, juniorCompaniesGetRes) {
								// Handle Junior company save error
								if (juniorCompaniesGetErr) done(juniorCompaniesGetErr);

								// Get Junior companies list
								var juniorCompanies = juniorCompaniesGetRes.body;

								// Set assertions
								(juniorCompanies[0].user._id).should.equal(userId);
								(juniorCompanies[0].name).should.match('Junior company Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Junior company instance if not logged in', function(done) {
		agent.post('/junior-companies')
			.send(juniorCompany)
			.expect(401)
			.end(function(juniorCompanySaveErr, juniorCompanySaveRes) {
				// Call the assertion callback
				done(juniorCompanySaveErr);
			});
	});

	it('should not be able to save Junior company instance if no name is provided', function(done) {
		// Invalidate name field
		juniorCompany.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Junior company
				agent.post('/junior-companies')
					.send(juniorCompany)
					.expect(400)
					.end(function(juniorCompanySaveErr, juniorCompanySaveRes) {
						// Set message assertion
						(juniorCompanySaveRes.body.message).should.match('Please fill Junior company name');
						
						// Handle Junior company save error
						done(juniorCompanySaveErr);
					});
			});
	});

	it('should be able to update Junior company instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Junior company
				agent.post('/junior-companies')
					.send(juniorCompany)
					.expect(200)
					.end(function(juniorCompanySaveErr, juniorCompanySaveRes) {
						// Handle Junior company save error
						if (juniorCompanySaveErr) done(juniorCompanySaveErr);

						// Update Junior company name
						juniorCompany.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Junior company
						agent.put('/junior-companies/' + juniorCompanySaveRes.body._id)
							.send(juniorCompany)
							.expect(200)
							.end(function(juniorCompanyUpdateErr, juniorCompanyUpdateRes) {
								// Handle Junior company update error
								if (juniorCompanyUpdateErr) done(juniorCompanyUpdateErr);

								// Set assertions
								(juniorCompanyUpdateRes.body._id).should.equal(juniorCompanySaveRes.body._id);
								(juniorCompanyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Junior companies if not signed in', function(done) {
		// Create new Junior company model instance
		var juniorCompanyObj = new JuniorCompany(juniorCompany);

		// Save the Junior company
		juniorCompanyObj.save(function() {
			// Request Junior companies
			request(app).get('/junior-companies')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Junior company if not signed in', function(done) {
		// Create new Junior company model instance
		var juniorCompanyObj = new JuniorCompany(juniorCompany);

		// Save the Junior company
		juniorCompanyObj.save(function() {
			request(app).get('/junior-companies/' + juniorCompanyObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', juniorCompany.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Junior company instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Junior company
				agent.post('/junior-companies')
					.send(juniorCompany)
					.expect(200)
					.end(function(juniorCompanySaveErr, juniorCompanySaveRes) {
						// Handle Junior company save error
						if (juniorCompanySaveErr) done(juniorCompanySaveErr);

						// Delete existing Junior company
						agent.delete('/junior-companies/' + juniorCompanySaveRes.body._id)
							.send(juniorCompany)
							.expect(200)
							.end(function(juniorCompanyDeleteErr, juniorCompanyDeleteRes) {
								// Handle Junior company error error
								if (juniorCompanyDeleteErr) done(juniorCompanyDeleteErr);

								// Set assertions
								(juniorCompanyDeleteRes.body._id).should.equal(juniorCompanySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Junior company instance if not signed in', function(done) {
		// Set Junior company user 
		juniorCompany.user = user;

		// Create new Junior company model instance
		var juniorCompanyObj = new JuniorCompany(juniorCompany);

		// Save the Junior company
		juniorCompanyObj.save(function() {
			// Try deleting Junior company
			request(app).delete('/junior-companies/' + juniorCompanyObj._id)
			.expect(401)
			.end(function(juniorCompanyDeleteErr, juniorCompanyDeleteRes) {
				// Set message assertion
				(juniorCompanyDeleteRes.body.message).should.match('User is not logged in');

				// Handle Junior company error error
				done(juniorCompanyDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		JuniorCompany.remove().exec();
		done();
	});
});