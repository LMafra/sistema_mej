'use strict';

// Organograms controller
angular.module('organograms').controller('OrganogramsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Organograms',
	function($scope, $stateParams, $location, Authentication, Organograms) {
		$scope.authentication = Authentication;

		// Create new Organogram
		$scope.create = function() {
			// Create new Organogram object
			var organogram = new Organograms ({
				name: this.name
			});

			// Redirect after save
			organogram.$save(function(response) {
				$location.path('organograms/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Organogram
		$scope.remove = function(organogram) {
			if ( organogram ) { 
				organogram.$remove();

				for (var i in $scope.organograms) {
					if ($scope.organograms [i] === organogram) {
						$scope.organograms.splice(i, 1);
					}
				}
			} else {
				$scope.organogram.$remove(function() {
					$location.path('organograms');
				});
			}
		};

		// Update existing Organogram
		$scope.update = function() {
			var organogram = $scope.organogram;

			organogram.$update(function() {
				$location.path('organograms/' + organogram._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Organograms
		$scope.find = function() {
			$scope.organograms = Organograms.query();
		};

		// Find existing Organogram
		$scope.findOne = function() {
			$scope.organogram = Organograms.get({ 
				organogramId: $stateParams.organogramId
			});
		};

	}
]);