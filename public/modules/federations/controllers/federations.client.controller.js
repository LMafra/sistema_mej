'use strict';

// Federations controller
angular.module('federations').controller('FederationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Federations',
	function($scope, $stateParams, $location, Authentication, Federations) {
		$scope.authentication = Authentication;

		// Create new Federation
		$scope.create = function() {
			// Create new Federation object
			var federation = new Federations ({
				name: this.name
			});

			// Redirect after save
			federation.$save(function(response) {
				$location.path('federations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Federation
		$scope.remove = function(federation) {
			if ( federation ) { 
				federation.$remove();

				for (var i in $scope.federations) {
					if ($scope.federations [i] === federation) {
						$scope.federations.splice(i, 1);
					}
				}
			} else {
				$scope.federation.$remove(function() {
					$location.path('federations');
				});
			}
		};

		// Update existing Federation
		$scope.update = function() {
			var federation = $scope.federation;

			federation.$update(function() {
				$location.path('federations/' + federation._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Federations
		$scope.find = function() {
			$scope.federations = Federations.query();
		};

		// Find existing Federation
		$scope.findOne = function() {
			$scope.federation = Federations.get({ 
				federationId: $stateParams.federationId
			});
		};
	}
]);