DashboardModule.controller( 'PlanningCoursesController', ['$scope', '$http', '$filter', 'toastr', function( $scope, $http, $filter ) {

  var allCourses = [];

  var checkIndex = 2;

  var courses = [];
  var taxi = [];
  getCourses();
  getFreeTaxi();

  $( document ).on( 'geneticStart', function() {
    if( checkIndex <= 0 ) {
      console.log( 'Start' );

      var size = 0;
      if( taxi.length > courses.length ) {
        size = courses.length;
        taxi = taxi.slice( 0, size );
      }
      else {
        size = taxi.length;
        courses = courses.slice( 0, size );
      }
      console.log( 'Rozmiar', size );
      var costTable = makeCostTable( taxi, courses, size );

      var geneticAlgorithm = new GeneticAlgorithm( courses, costTable, 500, 0.7, 300 );

      console.log( 'Parameters: ', 'Population size: ' + geneticAlgorithm.populationSize,
     		'Mutation\'s probability: ' + geneticAlgorithm.mutateProb, 'Amount: ' + geneticAlgorithm.amount );

    	geneticAlgorithm.start();

    	console.log( 'Stop', 'Best: ', geneticAlgorithm.population.best );
    }
  } );




  function getCourses() {
    return $http.get("/courses" + "?status_kursu=oczekuje" )
    .success( function( response ) {
      console.log( 'Planning Courses to show', response );
      checkIndex--;
      $( document ).trigger({
        type:"geneticStart"
      });
      courses = response;
      return response;
    });
  }

  function getFreeTaxi() {
    return $http.get("/taxi_free" )
    .success( function( response ) {
      $scope.taxi = response;
      console.log( 'Taxi to show', $scope.taxi );
      checkIndex--;
      $( document ).trigger({
        type:"geneticStart"
      });
      taxi = response;
      return response;
    });
  }

  function makeCostTable( taxi, courses, size ) {
    var costTable = [];
    for( var i = 0; i < size; i++ ) {
      var taxiObject = new Taxi();
      for( var j = 0; j < size; j++ ) {
        taxiObject.road[ courses[j].id ] = parseInt( Math.random() * 100 );
      }
      costTable.push( taxiObject );
    }
    return costTable;
  }

} ] );
