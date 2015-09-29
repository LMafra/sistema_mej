'use strict';

(function() {
	// Perfomances Controller Spec
	describe('Perfomances Controller Tests', function() {
		// Initialize global variables
		var PerfomancesController,
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

			// Initialize the Perfomances controller.
			PerfomancesController = $controller('PerfomancesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Perfomance object fetched from XHR', inject(function(Perfomances) {
			// Create sample Perfomance using the Perfomances service
			var samplePerfomance = new Perfomances({
				name: 'New Perfomance'
			});

			// Create a sample Perfomances array that includes the new Perfomance
			var samplePerfomances = [samplePerfomance];

			// Set GET response
			$httpBackend.expectGET('perfomances').respond(samplePerfomances);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.perfomances).toEqualData(samplePerfomances);
		}));

		it('$scope.findOne() should create an array with one Perfomance object fetched from XHR using a perfomanceId URL parameter', inject(function(Perfomances) {
			// Define a sample Perfomance object
			var samplePerfomance = new Perfomances({
				name: 'New Perfomance'
			});

			// Set the URL parameter
			$stateParams.perfomanceId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/perfomances\/([0-9a-fA-F]{24})$/).respond(samplePerfomance);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.perfomance).toEqualData(samplePerfomance);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Perfomances) {
			// Create a sample Perfomance object
			var samplePerfomancePostData = new Perfomances({
				name: 'New Perfomance'
			});

			// Create a sample Perfomance response
			var samplePerfomanceResponse = new Perfomances({
				_id: '525cf20451979dea2c000001',
				name: 'New Perfomance'
			});

			// Fixture mock form input values
			scope.name = 'New Perfomance';

			// Set POST response
			$httpBackend.expectPOST('perfomances', samplePerfomancePostData).respond(samplePerfomanceResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Perfomance was created
			expect($location.path()).toBe('/perfomances/' + samplePerfomanceResponse._id);
		}));

		it('$scope.update() should update a valid Perfomance', inject(function(Perfomances) {
			// Define a sample Perfomance put data
			var samplePerfomancePutData = new Perfomances({
				_id: '525cf20451979dea2c000001',
				name: 'New Perfomance'
			});

			// Mock Perfomance in scope
			scope.perfomance = samplePerfomancePutData;

			// Set PUT response
			$httpBackend.expectPUT(/perfomances\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/perfomances/' + samplePerfomancePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid perfomanceId and remove the Perfomance from the scope', inject(function(Perfomances) {
			// Create new Perfomance object
			var samplePerfomance = new Perfomances({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Perfomances array and include the Perfomance
			scope.perfomances = [samplePerfomance];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/perfomances\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePerfomance);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.perfomances.length).toBe(0);
		}));
	});
}());