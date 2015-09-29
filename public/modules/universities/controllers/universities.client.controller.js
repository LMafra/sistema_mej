'use strict';

// Universities controller
angular.module('universities').controller('UniversitiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Universities',
	function($scope, $stateParams, $location, Authentication, Universities) {
		$scope.authentication = Authentication;

		// Create new University
		$scope.create = function() {
			// Create new University object
			var university = new Universities ({
				name: this.name
			});

			// Redirect after save
			university.$save(function(response) {
				$location.path('universities/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing University
		$scope.remove = function(university) {
			if ( university ) { 
				university.$remove();

				for (var i in $scope.universities) {
					if ($scope.universities [i] === university) {
						$scope.universities.splice(i, 1);
					}
				}
			} else {
				$scope.university.$remove(function() {
					$location.path('universities');
				});
			}
		};

		// Update existing University
		$scope.update = function() {
			var university = $scope.university;

			university.$update(function() {
				$location.path('universities/' + university._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Universities
		$scope.find = function() {
			$scope.universities = Universities.query();
		};

		// Find existing University
		$scope.findOne = function() {
			$scope.university = Universities.get({ 
				universityId: $stateParams.universityId
			});
		};
	}
]);