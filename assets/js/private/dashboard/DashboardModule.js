var DashboardModule = angular.module('DashboardModule', ['toastr', 'ngRoute']);

DashboardModule.config(function($routeProvider, $locationProvider) {
  $routeProvider

  // route for the home page
  .when('/', {
      templateUrl : '/templates/taxi.html',
      controller  : 'TaxiWorkController'
  })

  .when('/courses', {
      templateUrl : '/templates/courses.html',
      controller  : 'CoursesController'
  })

  .when('/courses/edit', {
      templateUrl : '/templates/courses_edit.html',
      controller  : 'CourseEditController'
  })

  .when('/courses/create', {
      templateUrl : '/templates/course_create.html',
      controller  : 'CourseCreateController'
  })

  .when('/courses/cancel', {
      templateUrl : '/templates/course_create.html',
      controller  : 'CourseCancelController'
  })

  .when('/courses/planning', {
      templateUrl : '/templates/courses.html',
      controller  : 'PlanningCoursesController'
  })

  .when('/clients', {
      templateUrl : '/templates/clients.html',
      controller  : 'ClientsController'
  })

  .when('/taxi', {
      templateUrl : '/templates/taxi.html',
      controller  : 'TaxiController'
  })

  .when('/taxi/in_work', {
      templateUrl : '/templates/taxi.html',
      controller  : 'TaxiWorkController'
  })

  .when('/map', {
      templateUrl : '/templates/map.html',
      controller  : 'MapController'
  });

  // use the HTML5 History API
  //$locationProvider.html5Mode(true);
});
