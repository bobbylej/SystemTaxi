HomepageModule.controller( 'CourseCreateController', ['$scope', '$http', '$filter', 'toastr', function( $scope, $http, $filter ) {


  $( '.topbar-inner .menu a' ).removeClass( 'active' );
  $( '.topbar-inner .menu .course-create-link' ).addClass( 'active' );

  getTaxiStandards();
  showCreateForm();

  $scope.createCourse = function( course ) {
    if( course.typ_auta ) {
      var standard = course.typ_auta.standard;
    }
    else {
      var standard = '';
    }

    $http.post( "/create_course", {
      telefon: course.telefon,
      miasto: course.miasto,
      ulica: course.ulica,
      nr_budynku: course.nr_budynku,
      typ_auta: standard
    } ).success( function( course, status ) {
      console.log( course );
      $scope.course = course;
      showPasswordForm();
    } );
  }

  $scope.updateCourse = function( course ) {
    $http.post( "/update_course", {
      id: course.id,
      haslo_anulowania: course.haslo_anulowania
    } ).success( function( course, status ) {
      console.log( course );
      //$scope.course = course;
      window.location.href = '/#/courses/planning';
      $( document ).trigger({
        type:"geneticStart"
      });
    } );
  }

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
          type:"interfaceUpdate"
        });
        $( document ).trigger({
          type:"geneticStart"
        });
      }
    } );
  }

  function getTaxiStandards() {
    $http.get("/taxi_auto_standars" )
    .success( function( response ) {
      $scope.taxiStandards = response;
      console.log( 'Taxi standars to show', $scope.taxiStandards );
    });
  }

  function showPasswordForm() {
    $( '.create-container' ).slideUp();
    $( '.cancel-container' ).slideUp();
    $( '.password-container' ).slideDown();
  }

  function showCreateForm() {
    $( '.password-container' ).slideUp();
    $( '.cancel-container' ).slideUp();
    $( '.create-container' ).slideDown();
  }

} ] );
