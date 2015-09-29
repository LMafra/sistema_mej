'use strict';

(function() {
	// Dimensions Controller Spec
	describe('Dimensions Controller Tests', function() {
		// Initialize global variables
		var DimensionsController,
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

			// Initialize the Dimensions controller.
			DimensionsController = $controller('DimensionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Dimension object fetched from XHR', inject(function(Dimensions) {
			// Create sample Dimension using the Dimensions service
			var sampleDimension = new Dimensions({
				name: 'New Dimension'
			});

			// Create a sample Dimensions array that includes the new Dimension
			var sampleDimensions = [sampleDimension];

			// Set GET response
			$httpBackend.expectGET('dimensions').respond(sampleDimensions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dimensions).toEqualData(sampleDimensions);
		}));

		it('$scope.findOne() should create an array with one Dimension object fetched from XHR using a dimensionId URL parameter', inject(function(Dimensions) {
			// Define a sample Dimension object
			var sampleDimension = new Dimensions({
				name: 'New Dimension'
			});

			// Set the URL parameter
			$stateParams.dimensionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/dimensions\/([0-9a-fA-F]{24})$/).respond(sampleDimension);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dimension).toEqualData(sampleDimension);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Dimensions) {
			// Create a sample Dimension object
			var sampleDimensionPostData = new Dimensions({
				name: 'New Dimension'
			});

			// Create a sample Dimension response
			var sampleDimensionResponse = new Dimensions({
				_id: '525cf20451979dea2c000001',
				name: 'New Dimension'
			});

			// Fixture mock form input values
			scope.name = 'New Dimension';

			// Set POST response
			$httpBackend.expectPOST('dimensions', sampleDimensionPostData).respond(sampleDimensionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Dimension was created
			expect($location.path()).toBe('/dimensions/' + sampleDimensionResponse._id);
		}));

		it('$scope.update() should update a valid Dimension', inject(function(Dimensions) {
			// Define a sample Dimension put data
			var sampleDimensionPutData = new Dimensions({
				_id: '525cf20451979dea2c000001',
				name: 'New Dimension'
			});

			// Mock Dimension in scope
			scope.dimension = sampleDimensionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/dimensions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/dimensions/' + sampleDimensionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid dimensionId and remove the Dimension from the scope', inject(function(Dimensions) {
			// Create new Dimension object
			var sampleDimension = new Dimensions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Dimensions array and include the Dimension
			scope.dimensions = [sampleDimension];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/dimensions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDimension);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.dimensions.length).toBe(0);
		}));
	});
}());