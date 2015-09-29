'use strict';

(function() {
	// Junior companies Controller Spec
	describe('Junior companies Controller Tests', function() {
		// Initialize global variables
		var JuniorCompaniesController,
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

			// Initialize the Junior companies controller.
			JuniorCompaniesController = $controller('JuniorCompaniesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Junior company object fetched from XHR', inject(function(JuniorCompanies) {
			// Create sample Junior company using the Junior companies service
			var sampleJuniorCompany = new JuniorCompanies({
				name: 'New Junior company'
			});

			// Create a sample Junior companies array that includes the new Junior company
			var sampleJuniorCompanies = [sampleJuniorCompany];

			// Set GET response
			$httpBackend.expectGET('junior-companies').respond(sampleJuniorCompanies);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.juniorCompanies).toEqualData(sampleJuniorCompanies);
		}));

		it('$scope.findOne() should create an array with one Junior company object fetched from XHR using a juniorCompanyId URL parameter', inject(function(JuniorCompanies) {
			// Define a sample Junior company object
			var sampleJuniorCompany = new JuniorCompanies({
				name: 'New Junior company'
			});

			// Set the URL parameter
			$stateParams.juniorCompanyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/junior-companies\/([0-9a-fA-F]{24})$/).respond(sampleJuniorCompany);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.juniorCompany).toEqualData(sampleJuniorCompany);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(JuniorCompanies) {
			// Create a sample Junior company object
			var sampleJuniorCompanyPostData = new JuniorCompanies({
				name: 'New Junior company'
			});

			// Create a sample Junior company response
			var sampleJuniorCompanyResponse = new JuniorCompanies({
				_id: '525cf20451979dea2c000001',
				name: 'New Junior company'
			});

			// Fixture mock form input values
			scope.name = 'New Junior company';

			// Set POST response
			$httpBackend.expectPOST('junior-companies', sampleJuniorCompanyPostData).respond(sampleJuniorCompanyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Junior company was created
			expect($location.path()).toBe('/junior-companies/' + sampleJuniorCompanyResponse._id);
		}));

		it('$scope.update() should update a valid Junior company', inject(function(JuniorCompanies) {
			// Define a sample Junior company put data
			var sampleJuniorCompanyPutData = new JuniorCompanies({
				_id: '525cf20451979dea2c000001',
				name: 'New Junior company'
			});

			// Mock Junior company in scope
			scope.juniorCompany = sampleJuniorCompanyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/junior-companies\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/junior-companies/' + sampleJuniorCompanyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid juniorCompanyId and remove the Junior company from the scope', inject(function(JuniorCompanies) {
			// Create new Junior company object
			var sampleJuniorCompany = new JuniorCompanies({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Junior companies array and include the Junior company
			scope.juniorCompanies = [sampleJuniorCompany];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/junior-companies\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleJuniorCompany);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.juniorCompanies.length).toBe(0);
		}));
	});
}());