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
  })

  .when('/courses/edit', {
      templateUrl : '/templates/courses_edit.html',
      controller  : 'CourseEditController'
  })

  .when('/clients', {
      templateUrl : '/templates/clients.html',
      controller  : 'ClientsController'
  });

  // use the HTML5 History API
  //$locationProvider.html5Mode(true);
});


DashboardModule.controller('mainController', function($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!\n';
});
