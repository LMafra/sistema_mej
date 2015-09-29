'use strict';

(function() {
	// States Controller Spec
	describe('States Controller Tests', function() {
		// Initialize global variables
		var StatesController,
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

			// Initialize the States controller.
			StatesController = $controller('StatesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one State object fetched from XHR', inject(function(States) {
			// Create sample State using the States service
			var sampleState = new States({
				name: 'New State'
			});

			// Create a sample States array that includes the new State
			var sampleStates = [sampleState];

			// Set GET response
			$httpBackend.expectGET('states').respond(sampleStates);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.states).toEqualData(sampleStates);
		}));

		it('$scope.findOne() should create an array with one State object fetched from XHR using a stateId URL parameter', inject(function(States) {
			// Define a sample State object
			var sampleState = new States({
				name: 'New State'
			});

			// Set the URL parameter
			$stateParams.stateId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/states\/([0-9a-fA-F]{24})$/).respond(sampleState);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.state).toEqualData(sampleState);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(States) {
			// Create a sample State object
			var sampleStatePostData = new States({
				name: 'New State'
			});

			// Create a sample State response
			var sampleStateResponse = new States({
				_id: '525cf20451979dea2c000001',
				name: 'New State'
			});

			// Fixture mock form input values
			scope.name = 'New State';

			// Set POST response
			$httpBackend.expectPOST('states', sampleStatePostData).respond(sampleStateResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the State was created
			expect($location.path()).toBe('/states/' + sampleStateResponse._id);
		}));

		it('$scope.update() should update a valid State', inject(function(States) {
			// Define a sample State put data
			var sampleStatePutData = new States({
				_id: '525cf20451979dea2c000001',
				name: 'New State'
			});

			// Mock State in scope
			scope.state = sampleStatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/states\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/states/' + sampleStatePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid stateId and remove the State from the scope', inject(function(States) {
			// Create new State object
			var sampleState = new States({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new States array and include the State
			scope.states = [sampleState];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/states\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleState);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.states.length).toBe(0);
		}));
	});
}());