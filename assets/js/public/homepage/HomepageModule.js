var homepageModule = angular.module('HomepageModule', ['toastr', 'compareTo', 'ngRoute']);

homepageModule.config(function($routeProvider, $locationProvider) {
  $routeProvider

  // route for the home page
  .when('/', {
      templateUrl : '../../../templates/test.html',
      controller  : 'mainController'
  })

  // route for the about page
  .when('/about', {
      templateUrl : '../../../templates/test.html',
      controller  : 'aboutController'
  })

  // route for the contact page
  .when('/contact', {
      templateUrl : '../../../templates/test.html',
      controller  : 'contactController'
  });


  // use the HTML5 History API
  //$locationProvider.html5Mode(true);
});

// create the controller and inject Angular's $scope
    homepageModule.controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    });

    homepageModule.controller('aboutController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    });

    homepageModule.controller('contactController', function($scope) {
        $scope.message = 'Contact us! JK. This is just a demo.';
    });
