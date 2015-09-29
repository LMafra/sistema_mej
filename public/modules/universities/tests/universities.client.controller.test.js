'use strict';

(function() {
	// Universities Controller Spec
	describe('Universities Controller Tests', function() {
		// Initialize global variables
		var UniversitiesController,
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

			// Initialize the Universities controller.
			UniversitiesController = $controller('UniversitiesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one University object fetched from XHR', inject(function(Universities) {
			// Create sample University using the Universities service
			var sampleUniversity = new Universities({
				name: 'New University'
			});

			// Create a sample Universities array that includes the new University
			var sampleUniversities = [sampleUniversity];

			// Set GET response
			$httpBackend.expectGET('universities').respond(sampleUniversities);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.universities).toEqualData(sampleUniversities);
		}));

		it('$scope.findOne() should create an array with one University object fetched from XHR using a universityId URL parameter', inject(function(Universities) {
			// Define a sample University object
			var sampleUniversity = new Universities({
				name: 'New University'
			});

			// Set the URL parameter
			$stateParams.universityId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/universities\/([0-9a-fA-F]{24})$/).respond(sampleUniversity);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.university).toEqualData(sampleUniversity);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Universities) {
			// Create a sample University object
			var sampleUniversityPostData = new Universities({
				name: 'New University'
			});

			// Create a sample University response
			var sampleUniversityResponse = new Universities({
				_id: '525cf20451979dea2c000001',
				name: 'New University'
			});

			// Fixture mock form input values
			scope.name = 'New University';

			// Set POST response
			$httpBackend.expectPOST('universities', sampleUniversityPostData).respond(sampleUniversityResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the University was created
			expect($location.path()).toBe('/universities/' + sampleUniversityResponse._id);
		}));

		it('$scope.update() should update a valid University', inject(function(Universities) {
			// Define a sample University put data
			var sampleUniversityPutData = new Universities({
				_id: '525cf20451979dea2c000001',
				name: 'New University'
			});

			// Mock University in scope
			scope.university = sampleUniversityPutData;

			// Set PUT response
			$httpBackend.expectPUT(/universities\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/universities/' + sampleUniversityPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid universityId and remove the University from the scope', inject(function(Universities) {
			// Create new University object
			var sampleUniversity = new Universities({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Universities array and include the University
			scope.universities = [sampleUniversity];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/universities\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleUniversity);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.universities.length).toBe(0);
		}));
	});
}());