'use strict';

// Junior companies controller
angular.module('junior-companies').controller('JuniorCompaniesController', ['$scope', '$stateParams', '$location', 'Authentication', 'JuniorCompanies','Federations',
	function($scope, $stateParams, $location, Authentication, JuniorCompanies, Federations) {
		$scope.authentication = Authentication;

		//incluindo o select de federação
		$scope.selectFederation = Federations.query();

		// Create new Junior company
		$scope.create = function() {
			// Create new Junior company object
			var juniorCompany = new JuniorCompanies ({
				federation : this.federation,
				name: this.name
			});



			// Redirect after save
			juniorCompany.$save(function(response) {
				$location.path('junior-companies/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Junior company
		$scope.remove = function(juniorCompany) {
			if ( juniorCompany ) { 
				juniorCompany.$remove();

				for (var i in $scope.juniorCompanies) {
					if ($scope.juniorCompanies [i] === juniorCompany) {
						$scope.juniorCompanies.splice(i, 1);
					}
				}
			} else {
				$scope.juniorCompany.$remove(function() {
					$location.path('junior-companies');
				});
			}
		};

		// Update existing Junior company
		$scope.update = function() {
			var juniorCompany = $scope.juniorCompany;

			juniorCompany.$update(function() {
				$location.path('junior-companies/' + juniorCompany._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Junior companies
		$scope.find = function() {
			$scope.juniorCompanies = JuniorCompanies.query();
		};

		// Find existing Junior company
		$scope.findOne = function() {
			$scope.juniorCompany = JuniorCompanies.get({ 
				juniorCompanyId: $stateParams.juniorCompanyId
			});
		};
	}
]);