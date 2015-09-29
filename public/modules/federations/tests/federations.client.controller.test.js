'use strict';

(function() {
	// Federations Controller Spec
	describe('Federations Controller Tests', function() {
		// Initialize global variables
		var FederationsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Federations controller.
			FederationsController = $controller('FederationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Federation object fetched from XHR', inject(function(Federations) {
			// Create sample Federation using the Federations service
			var sampleFederation = new Federations({
				name: 'New Federation'
			});

			// Create a sample Federations array that includes the new Federation
			var sampleFederations = [sampleFederation];

			// Set GET response
			$httpBackend.expectGET('federations').respond(sampleFederations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.federations).toEqualData(sampleFederations);
		}));

		it('$scope.findOne() should create an array with one Federation object fetched from XHR using a federationId URL parameter', inject(function(Federations) {
			// Define a sample Federation object
			var sampleFederation = new Federations({
				name: 'New Federation'
			});

			// Set the URL parameter
			$stateParams.federationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/federations\/([0-9a-fA-F]{24})$/).respond(sampleFederation);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.federation).toEqualData(sampleFederation);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Federations) {
			// Create a sample Federation object
			var sampleFederationPostData = new Federations({
				name: 'New Federation'
			});

			// Create a sample Federation response
			var sampleFederationResponse = new Federations({
				_id: '525cf20451979dea2c000001',
				name: 'New Federation'
			});

			// Fixture mock form input values
			scope.name = 'New Federation';

			// Set POST response
			$httpBackend.expectPOST('federations', sampleFederationPostData).respond(sampleFederationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Federation was created
			expect($location.path()).toBe('/federations/' + sampleFederationResponse._id);
		}));

		it('$scope.update() should update a valid Federation', inject(function(Federations) {
			// Define a sample Federation put data
			var sampleFederationPutData = new Federations({
				_id: '525cf20451979dea2c000001',
				name: 'New Federation'
			});

			// Mock Federation in scope
			scope.federation = sampleFederationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/federations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/federations/' + sampleFederationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid federationId and remove the Federation from the scope', inject(function(Federations) {
			// Create new Federation object
			var sampleFederation = new Federations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Federations array and include the Federation
			scope.federations = [sampleFederation];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/federations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFederation);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.federations.length).toBe(0);
		}));
	});
}());