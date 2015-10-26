DashboardModule.controller( 'CoursesController', ['$scope', '$http', '$filter', 'toastr', function( $scope, $http, $filter, CoursesService ) {
  /*
  function init(){
    $scope.courses=CoursesService.getCourses();
  }
  init();
  */
  /*
  // or to retrieve a specific employee by name
  $scope.find=function(){
    $scope.courses=CoursesService.getCourses();
  }
  */
  //$scope.courses = window.SAILS_LOCALS.apps;
  //console.log( apps );
  //console.log( window.SAILS_LOCALS.apps );

  /*
  $http.get( '/courses' ).success( function(data) {
    $scope.courses = data;
    console.log( data );
  } );
  */
  var allCourses = [];

  $http.get("/courses")
  .success( function( response ) {
    allCourses = response;
    console.log( 'AllIn', allCourses );
    $scope.courses = getCourses( 1 );
    //$scope.courses = response;
  });

  function getCourses( taxiId ) {
    var courses = $filter('filter')( allCourses, function ( course ) {
      return course.taksowkarz === taxiId;
    } );
    console.log( 'Filtered', courses );
    return courses;
  }



  /*
  function getCourses() {
    $http.jsonp(
      'http://localhost:1337/courses/?callback=JSON_CALLBACK'
    ).success( function( courses ) {
      $scope.courses = courses;
      console.log( 'COURSES', courses );
    }).error(function( err ){
      console.log( 'Erorr', err );
      // handle errors
    });
  }
  getCourses();
  */
} ] );
