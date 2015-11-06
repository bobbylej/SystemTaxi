DashboardModule.controller( 'TaxiWorkController', ['$scope', '$http', '$filter', 'toastr', function( $scope, $http, $filter ) {

  var allCourses = [];

  $( '.sidebar .menu a' ).removeClass( 'active' );
  $( '.sidebar .menu .taxi-link' ).addClass( 'active' );
  $( '.topbar .menu a' ).removeClass( 'active' );
  $( '.topbar .menu .taxi-in-work-link' ).addClass( 'active' );

  $scope.currentPage = 1;
  //fillPagination( $scope.currentPage );
  filterTaxi( [] );

  $scope.filter = function( taxi ) {
    console.log( taxi );
    var filters = [];
    for( var key in taxi ) {
      if( taxi[ key ] ) {
        filters.push( {
          key: key,
          value: taxi[ key ]
        } );
      }
    }
    filterTaxi( filters );
  }

  $scope.changePage = function( page, taxi ) {
    console.log( page, taxi );
    $scope.currentPage = page;
    $scope.filter( taxi );
  }


  function filterTaxi( filters ) {
    filterReq = '?strona=' + $scope.currentPage;
    filters.forEach( function( filter ) {
      filterReq += '&' + filter.key + '=' + filter.value;
    } );
    $http.get("/taxi_work" + filterReq )
    .success( function( response ) {
      $scope.allTaxi = response;
      console.log( 'Taxi Work to show', $scope.allTaxi );
    });
  }

} ] );
