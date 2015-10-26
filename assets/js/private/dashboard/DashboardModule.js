var DashboardModule = angular.module('DashboardModule', ['toastr', 'ngRoute']);


DashboardModule.config(function($routeProvider, $locationProvider) {
  $routeProvider

  // route for the home page
  .when('/', {
      templateUrl : '/templates/test.html',
      controller  : 'mainController'
  })

  .when('/courses', {
      templateUrl : '/templates/courses.html',
      controller  : 'CoursesController'
  });

  // use the HTML5 History API
  //$locationProvider.html5Mode(true);
});


DashboardModule.service( 'CoursesService', function( $resource ) {
    this.getCourses = function() {
      return $resource( 'http://localhost:1337/courses', {} )
          .query({}).$promise.then( function( response ) {
              return response;
          } );
    };
} );


// create the controller and inject Angular's $scope
DashboardModule.controller('mainController', function($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!\n';
});
