DashboardModule.controller( 'CourseEditController', ['$scope', '$http', '$filter', 'toastr', function( $scope, $http, $filter ) {


  $( '.sidebar .menu a' ).removeClass( 'active' );
  $( '.sidebar .menu .courses-link' ).addClass( 'active' );
  $( '.topbar .menu a' ).removeClass( 'active' );
  $( '.topbar .menu .course-edit-link' ).addClass( 'active' );

  $scope.course = {};
  var id = getUrlParams( 'id' )
  if( id ) {
    getEditCourse( id );
  }
  else {
    getWaitingCourses();
  }
  getFreeTaxi();

  $scope.chooseCourse = function( course ) {
    $scope.id = course.id;
    getEditCourse( course.id );
  }

  $scope.editCourse = function( course ) {
    $http.post( "/edit_course", { id: course.id, taksowkarz: course.taksowkarz.id, zmieniajacy: $scope.login } ).success( function(data, status) {
        window.location.href = '#/courses/planning';
        $( document ).trigger({
          type:"geneticStart"
        });
    } )
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
      jQuery( '.choose-container' ).slideUp();
      jQuery( '.edit-container' ).slideDown();
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
