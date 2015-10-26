angular.module('SignupEmployeeModule').controller('SignupEmployeeController', ['$scope', '$http', 'toastr', function($scope, $http, toastr){

	// set-up loading state
	$scope.signupForm = {
		loading: false
	}

	$scope.submitSignupForm = function(){

		// Set the loading state (i.e. show loading spinner)
		$scope.signupForm.loading = true;

		// Submit request to Sails.
		$http.post('/signup_employee', {
			login: $scope.signupForm.login,
			haslo: $scope.signupForm.password,
			imie: $scope.signupForm.name,
			nazwisko: $scope.signupForm.subname,
			telefon: $scope.signupForm.telefon,
			pesel: $scope.signupForm.pesel,
			data_urodzenia: $scope.signupForm.data_urodzenia,
			miasto: $scope.signupForm.miasto,
			kod_pocztowy: $scope.signupForm.kod_pocztowy,
			ulica: $scope.signupForm.ulica,
			nr_budynku: $scope.signupForm.nr_budynku,
			nr_lokalu: $scope.signupForm.nr_lokalu,
		})
		.then(function onSuccess(sailsResponse){
			window.location = '/';
		})
		.catch(function onError(sailsResponse){

		// Handle known error type(s).
		// If using sails-disk adpater -- Handle Duplicate Key
		var loginAlreadyInUse = sailsResponse.status == 409;

		if (loginAlreadyInUse) {
			toastr.error('That login has already been taken, please try again.', 'Error');
			return;
		}

		})
		.finally(function eitherWay(){
			$scope.signupForm.loading = false;
		})
	}

	$scope.submitLoginForm = function (){

    // Set the loading state (i.e. show loading spinner)
    $scope.loginForm.loading = true;

    // Submit request to Sails.
    $http.put('/login_employee', {
      login: $scope.loginForm.login,
      haslo: $scope.loginForm.password
    })
    .then(function onSuccess (){
      // Refresh the page now that we've been logged in.
      window.location = '/';
    })
    .catch(function onError(sailsResponse) {

      // Handle known error type(s).
      // Invalid username / password combination.
      if (sailsResponse.status === 400 || 404) {
        // $scope.loginForm.topLevelErrorMessage = 'Invalid email/password combination.';
        //
        toastr.error('Invalid login/password combination.', 'Error', {
          closeButton: true
        });
        return;
      }

				toastr.error('An unexpected error occurred, please try again.', 'Error', {
					closeButton: true
				});
				return;

    })
    .finally(function eitherWay(){
      $scope.loginForm.loading = false;
    });
  };

}]);
