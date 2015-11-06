DashboardModule.controller( 'CourseCreateController', ['$scope', '$http', '$filter', 'toastr', function( $scope, $http, $filter ) {


  $( '.sidebar .menu a' ).removeClass( 'active' );
  $( '.sidebar .menu .courses-link' ).addClass( 'active' );
  $( '.topbar .menu a' ).removeClass( 'active' );
  $( '.topbar .menu .course-create-link' ).addClass( 'active' );

  getTaxiStandards();

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
      window.location.href = '/#/courses';
      $( document ).trigger({
        type:"interfaceUpdate"
      });
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
    $( '.password-container' ).slideDown();
  }

} ] );
