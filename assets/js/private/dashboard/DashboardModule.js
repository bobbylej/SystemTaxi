var DashboardModule = angular.module('DashboardModule', ['toastr', 'ngRoute']);


DashboardModule.config(function($routeProvider, $locationProvider) {
  $routeProvider

  // route for the home page
  .when('/', {
      templateUrl : '/templates/test.html',
      controller  : 'mainController'
  })

  // route for the about page
  .when('/about', {
      templateUrl : '/templates/test.html',
      controller  : 'aboutController'
  })

  // route for the contact page
  .when('/contact', {
      templateUrl : '/templates/test.html',
      controller  : 'contactController'
  })

  .when('/courses', {
      templateUrl : '/templates/courses.html',
      controller  : 'CoursesController'
  });

  // use the HTML5 History API
  //$locationProvider.html5Mode(true);
});

DashboardModule.factory( 'CoursesFactory', function( $resource ) {
    var getCourses = function() {
      return $resource( '/courses', {} )
          .query({}).$promise.then( function( response ) {
              return response;
          } );
    };

    return {
      getCourses: getCourses
    };
} );

DashboardModule.service( 'CoursesService', function( $resource ) {
    this.getCourses = function() {
      return $resource( '/courses', {} )
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

    DashboardModule.controller('aboutController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    });

    DashboardModule.controller('contactController', function($scope) {
        $scope.message = 'Contact us! JK. This is just a demo.';
    });

    console.log( DashboardModule );
