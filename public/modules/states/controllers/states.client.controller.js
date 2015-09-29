'use strict';

// States controller
angular.module('states').controller('StatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'States', 'Countries',
	function($scope, $stateParams, $location, Authentication, States, Countries) {
		$scope.authentication = Authentication;

		//Select of Country
		$scope.selectCountry = Countries.query();

		// Create new State
		$scope.create = function() {
			// Create new State object
			var state = new States ({
				country: this.country,
				name: this.name
			});

			// Redirect after save
			state.$save(function(response) {
				$location.path('states/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing State
		$scope.remove = function(state) {
			if ( state ) { 
				state.$remove();

				for (var i in $scope.states) {
					if ($scope.states [i] === state) {
						$scope.states.splice(i, 1);
					}
				}
			} else {
				$scope.state.$remove(function() {
					$location.path('states');
				});
			}
		};

		// Update existing State
		$scope.update = function() {
			var state = $scope.state;

			state.$update(function() {
				$location.path('states/' + state._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of States
		$scope.find = function() {
			$scope.states = States.query();
		};

		// Find existing State
		$scope.findOne = function() {
			$scope.state = States.get({ 
				stateId: $stateParams.stateId
			});
		};
		
	}
]);