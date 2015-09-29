'use strict';

// Degrees controller
angular.module('degrees').controller('DegreesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Degrees', 'Universities',
	function($scope, $stateParams, $location, Authentication, Degrees, Universities) {
		$scope.authentication = Authentication;

		//Select University
		$scope.selectUniversity = Universities.query();


		// Create new Degree
		$scope.create = function() {
			// Create new Degree object
			var degree = new Degrees ({
				university: this.university,
				name: this.name
			});

			// Redirect after save
			degree.$save(function(response) {
				$location.path('degrees/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Degree
		$scope.remove = function(degree) {
			if ( degree ) { 
				degree.$remove();

				for (var i in $scope.degrees) {
					if ($scope.degrees [i] === degree) {
						$scope.degrees.splice(i, 1);
					}
				}
			} else {
				$scope.degree.$remove(function() {
					$location.path('degrees');
				});
			}
		};

		// Update existing Degree
		$scope.update = function() {
			var degree = $scope.degree;

			degree.$update(function() {
				$location.path('degrees/' + degree._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Degrees
		$scope.find = function() {
			$scope.degrees = Degrees.query();
		};

		// Find existing Degree
		$scope.findOne = function() {
			$scope.degree = Degrees.get({ 
				degreeId: $stateParams.degreeId
			});
		};
	}
]);