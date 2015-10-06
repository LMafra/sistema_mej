'use strict';

(function() {
	// Organograms Controller Spec
	describe('Organograms Controller Tests', function() {
		// Initialize global variables
		var OrganogramsController,
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

			// Initialize the Organograms controller.
			OrganogramsController = $controller('OrganogramsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Organogram object fetched from XHR', inject(function(Organograms) {
			// Create sample Organogram using the Organograms service
			var sampleOrganogram = new Organograms({
				name: 'New Organogram'
			});

			// Create a sample Organograms array that includes the new Organogram
			var sampleOrganograms = [sampleOrganogram];

			// Set GET response
			$httpBackend.expectGET('organograms').respond(sampleOrganograms);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.organograms).toEqualData(sampleOrganograms);
		}));

		it('$scope.findOne() should create an array with one Organogram object fetched from XHR using a organogramId URL parameter', inject(function(Organograms) {
			// Define a sample Organogram object
			var sampleOrganogram = new Organograms({
				name: 'New Organogram'
			});

			// Set the URL parameter
			$stateParams.organogramId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/organograms\/([0-9a-fA-F]{24})$/).respond(sampleOrganogram);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.organogram).toEqualData(sampleOrganogram);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Organograms) {
			// Create a sample Organogram object
			var sampleOrganogramPostData = new Organograms({
				name: 'New Organogram'
			});

			// Create a sample Organogram response
			var sampleOrganogramResponse = new Organograms({
				_id: '525cf20451979dea2c000001',
				name: 'New Organogram'
			});

			// Fixture mock form input values
			scope.name = 'New Organogram';

			// Set POST response
			$httpBackend.expectPOST('organograms', sampleOrganogramPostData).respond(sampleOrganogramResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Organogram was created
			expect($location.path()).toBe('/organograms/' + sampleOrganogramResponse._id);
		}));

		it('$scope.update() should update a valid Organogram', inject(function(Organograms) {
			// Define a sample Organogram put data
			var sampleOrganogramPutData = new Organograms({
				_id: '525cf20451979dea2c000001',
				name: 'New Organogram'
			});

			// Mock Organogram in scope
			scope.organogram = sampleOrganogramPutData;

			// Set PUT response
			$httpBackend.expectPUT(/organograms\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/organograms/' + sampleOrganogramPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid organogramId and remove the Organogram from the scope', inject(function(Organograms) {
			// Create new Organogram object
			var sampleOrganogram = new Organograms({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Organograms array and include the Organogram
			scope.organograms = [sampleOrganogram];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/organograms\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOrganogram);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.organograms.length).toBe(0);
		}));
	});
}());