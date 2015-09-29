'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	JuniorCompany = mongoose.model('JuniorCompany');

/**
 * Globals
 */
var user, juniorCompany;

/**
 * Unit tests
 */
describe('Junior company Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			juniorCompany = new JuniorCompany({
				name: 'Junior company Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return juniorCompany.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			juniorCompany.name = '';

			return juniorCompany.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		JuniorCompany.remove().exec();
		User.remove().exec();

		done();
	});
});