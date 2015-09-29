'use strict';

(function() {
	// Degrees Controller Spec
	describe('Degrees Controller Tests', function() {
		// Initialize global variables
		var DegreesController,
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

			// Initialize the Degrees controller.
			DegreesController = $controller('DegreesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Degree object fetched from XHR', inject(function(Degrees) {
			// Create sample Degree using the Degrees service
			var sampleDegree = new Degrees({
				name: 'New Degree'
			});

			// Create a sample Degrees array that includes the new Degree
			var sampleDegrees = [sampleDegree];

			// Set GET response
			$httpBackend.expectGET('degrees').respond(sampleDegrees);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.degrees).toEqualData(sampleDegrees);
		}));

		it('$scope.findOne() should create an array with one Degree object fetched from XHR using a degreeId URL parameter', inject(function(Degrees) {
			// Define a sample Degree object
			var sampleDegree = new Degrees({
				name: 'New Degree'
			});

			// Set the URL parameter
			$stateParams.degreeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/degrees\/([0-9a-fA-F]{24})$/).respond(sampleDegree);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.degree).toEqualData(sampleDegree);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Degrees) {
			// Create a sample Degree object
			var sampleDegreePostData = new Degrees({
				name: 'New Degree'
			});

			// Create a sample Degree response
			var sampleDegreeResponse = new Degrees({
				_id: '525cf20451979dea2c000001',
				name: 'New Degree'
			});

			// Fixture mock form input values
			scope.name = 'New Degree';

			// Set POST response
			$httpBackend.expectPOST('degrees', sampleDegreePostData).respond(sampleDegreeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Degree was created
			expect($location.path()).toBe('/degrees/' + sampleDegreeResponse._id);
		}));

		it('$scope.update() should update a valid Degree', inject(function(Degrees) {
			// Define a sample Degree put data
			var sampleDegreePutData = new Degrees({
				_id: '525cf20451979dea2c000001',
				name: 'New Degree'
			});

			// Mock Degree in scope
			scope.degree = sampleDegreePutData;

			// Set PUT response
			$httpBackend.expectPUT(/degrees\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/degrees/' + sampleDegreePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid degreeId and remove the Degree from the scope', inject(function(Degrees) {
			// Create new Degree object
			var sampleDegree = new Degrees({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Degrees array and include the Degree
			scope.degrees = [sampleDegree];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/degrees\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDegree);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.degrees.length).toBe(0);
		}));
	});
}());