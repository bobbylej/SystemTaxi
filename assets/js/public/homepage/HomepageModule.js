var HomepageModule = angular.module('HomepageModule', ['toastr', 'compareTo', 'ngRoute']);

HomepageModule.config(function($routeProvider, $locationProvider) {
  $routeProvider

  .when('/', {
      templateUrl : '/templates/home.html'
  })

  // route for the home page and create course
  .when('/courses/create', {
      templateUrl : '/templates/course_create_public.html',
      controller  : 'CourseCreateController'
  })

  // route for cancel course
  .when('/courses/cancel', {
      templateUrl : '/templates/course_create_public.html',
      controller  : 'CourseCancelController'
  })

  .when('/courses/planning', {
      templateUrl : '/templates/course_create_public.html',
      controller  : 'PlanningCoursesController'
  });


  // use the HTML5 History API
  //$locationProvider.html5Mode(true);
});
