DashboardModule.controller( 'CourseEditController', ['$scope', '$http', '$filter', 'toastr', function( $scope, $http, $filter ) {


  $( '.sidebar .menu a' ).removeClass( 'active' );
  $( '.sidebar .menu .courses-link' ).addClass( 'active' );
  $( '.topbar .menu a' ).removeClass( 'active' );
  $( '.topbar .menu .course-edit-link' ).addClass( 'active' );

  $scope.course = {};
  getWaitingCourses();
  getFreeTaxi();

  $scope.chooseCourse = function( id ){
    $scope.id = id;
    getEditCourse( id );
  }

  function getWaitingCourses() {
    $http.get("/courses?status_kursu=oczekuje" )
    .success( function( response ) {
      $scope.waitingCourses = response;
      console.log( 'Waiting Courses to show', $scope.waitingCourses );
    });
  }

  function getEditCourse( id ) {
    //var id = getUrlParams( 'id' );
    console.log( id );
    $http.get("/edit_course?id="+id )
    .success( function( response ) {
      $scope.course = response;
      console.log( 'Course to show', $scope.course );
    });
  }

  function getFreeTaxi() {
    $http.get("/taxi_free" )
    .success( function( response ) {
      $scope.taxi = response;
      console.log( 'Taxi to show', $scope.taxi );
    });
  }

  function getUrlParams(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
  }

} ] );
