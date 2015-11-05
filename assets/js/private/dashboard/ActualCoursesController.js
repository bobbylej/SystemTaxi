DashboardModule.controller( 'ActualCoursesController', ['$scope', '$http', '$filter', 'toastr', function( $scope, $http, $filter ) {

  var allCourses = [];

  $scope.edit = {};

  $scope.currentPageActualCourses = 1;
  //fillPagination( $scope.currentPage );
  filterCourses( [] );


  $scope.filter = function( course ) {
    console.log( course );
    var filters = [];
    for( var key in course ) {
      if( course[ key ] ) {
        filters.push( {
          key: key,
          value: course[ key ]
        } );
      }
    }
    filterCourses( filters );
  }

  $scope.changePage = function( page, course ) {
    console.log( page, course );
    $scope.currentPageActualCourses = page;
    $scope.filter( course );
  }

  $scope.preview = function( course ) {
    $scope.preview.actualCourse = course;
    $( '.preview-course' ).slideDown();
  }

  $scope.checkActualCourse = function( course ) {
    $scope.edit.course = course;
    $( '.edit-course' ).slideDown();
    $( '#course-radio-'+course.id ).attr('checked', 'checked');
    console.log( course );
  }


  function filterCourses( filters ) {
    filterReq = '?strona=' + $scope.currentPageActualCourses;
    filters.forEach( function( filter ) {
      filterReq += '&' + filter.key + '=' + filter.value;
    } );
    $http.get("/actual_courses" + filterReq )
    .success( function( response ) {
      $scope.actualCourses = response;
      console.log( 'Actual Courses to show', $scope.actualCourses );
    });
  }

} ] );
