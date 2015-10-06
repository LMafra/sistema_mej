'use strict';

// Organograms controller
angular.module('organograms').controller('OrganogramsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Organograms', 'Date',
	function($scope, $stateParams, $location, Authentication, Organograms, Dates) {
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

  		$scope.today = function() {
  		  $scope.dt = new Date();
  		};
  		$scope.today();

  		$scope.clear = function () {
  		  $scope.dt = null;
  		};

  		// Disable weekend selection
  		$scope.disabled = function(date, mode) {
  		  return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  		};

  		$scope.toggleMin = function() {
  		  $scope.minDate = $scope.minDate ? null : new Date();
  		};
  		$scope.toggleMin();
  		$scope.maxDate = new Date(2020, 5, 22);

  		$scope.open = function($event) {
  		  $scope.status.opened = true;
  		};

  		$scope.dateOptions = {
  		  formatYear: 'yy',
  		  startingDay: 1
  		};

  		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  		$scope.format = $scope.formats[0];

  		$scope.status = {
  		  opened: false
  		};

  		var tomorrow = new Date();
  		tomorrow.setDate(tomorrow.getDate() + 1);
  		var afterTomorrow = new Date();
  		afterTomorrow.setDate(tomorrow.getDate() + 2);
  		$scope.events =
  		  [
  		    {
  		      date: tomorrow,
  		      status: 'full'
  		    },
  		    {
  		      date: afterTomorrow,
  		      status: 'partially'
  		    }
  		  ];
		
  		$scope.getDayClass = function(date, mode) {
  		  	if (mode === 'day') {
  		    	var dayToCheck = new Date(date).setHours(0,0,0,0);
				for (var i=0;i<$scope.events.length;i++){
        			var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
					if (dayToCheck === currentDay) {
						return $scope.events[i].status;
  		      		}
   				}
  		  	}
  		  	return '';
  		};
	});
]);