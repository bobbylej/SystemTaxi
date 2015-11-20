HomepageModule.controller( 'CourseCancelController', ['$scope', '$http', '$filter', 'toastr', function( $scope, $http, $filter ) {


  $( '.topbar-inner .menu a' ).removeClass( 'active' );
  $( '.topbar-inner .menu .course-cancel-link' ).addClass( 'active' );

  showCancelForm();

  $scope.cancelCourse = function( course ) {
    $http.post( "/cancel_course", {
      id: course.id,
      haslo_anulowania: course.haslo_anulowania
    } ).success( function( course, status ) {
      console.log( course );
      if( course.error ) {
        $scope.error = 'Podano niewłaściwy identyfikator lub hasło';
      }
      else {
        //$scope.course = course;
        window.location.href = '/#/courses/planning';
        $( document ).trigger({
          type:"geneticStart"
        });
      }
    } );
  }



  function showCancelForm() {
    $( '.create-container' ).slideUp();
    $( '.password-container' ).slideUp();
    $( '.cancel-container' ).slideDown();
  }

} ] );
