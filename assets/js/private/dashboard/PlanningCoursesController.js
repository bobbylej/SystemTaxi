DashboardModule.controller( 'PlanningCoursesController', ['$scope', '$http', '$filter', 'toastr', function( $scope, $http, $filter ) {

  var allCourses = [];

  var checkIndex = { taxiDownloadComplete: false, coursesDownloadComplete: false };

  var courses = [];
  var taxi = [];
  getCourses();
  getFreeTaxi();

  $( document ).on( 'geneticStart', function() {
    if( checkIndex.taxiDownloadComplete && checkIndex.coursesDownloadComplete ) {
      console.log( 'Start' );

      var size = 0;
      console.log( taxi.length, courses.length );
      if( taxi.length > courses.length ) {
        size = courses.length;
      }
      else {
        size = taxi.length;
        courses = courses.slice( 0, size );
      }
      console.log( 'Rozmiar', size );
      var costTable = makeCostTable( taxi, courses, size );

      var geneticAlgorithm = new GeneticAlgorithm( courses, costTable, 500, 0.7, 300 );

      console.log( 'Parameters: ', 'Population size: ' + geneticAlgorithm.population.size,
     		'Mutation\'s probability: ' + geneticAlgorithm.population.mutateProb, 'Amount: ' + geneticAlgorithm.amount );

    	geneticAlgorithm.start();

    	console.log( 'Stop', 'Best: ', geneticAlgorithm.population.best );

      for( var i = 0; i < geneticAlgorithm.population.best.genes.length; i++ ) {
        if( geneticAlgorithm.population.best.genes[i] > 0 ) {
          $http.post( "/update_taxi_course", {
            id: geneticAlgorithm.population.best.genes[i],
            taksowkarz: i
          } ).success( function( course, status ) {
            console.log( course );
            //$scope.course = course;
            window.location.href = '/#/courses';
            $( document ).trigger({
              type:"interfaceUpdate"
            });
          } );
        }
      }

    }
  } );




  function getCourses() {
    return $http.get("/planning_courses" + "?status_kursu=oczekuje" )
    .success( function( response ) {
      checkIndex.coursesDownloadComplete = true;
      //courses = response;
      courses = [];
      for( var i = 0; i < response.length; i++ ) {
        courses.push( response[i].id );
      }
      console.log( 'Planning Courses to show', courses );
      $( document ).trigger({
        type:"geneticStart"
      });
      return response;
    });
  }

  function getFreeTaxi() {
    return $http.get("/taxi_free" )
    .success( function( response ) {
      console.log( 'Taxi to show', response );
      checkIndex.taxiDownloadComplete = true;
      taxi = response;
      $( document ).trigger({
        type:"geneticStart"
      });
      return response;
    });
  }

  function makeCostTable( taxi, courses, size ) {
    var costTable = [];
    for( var i = 0; i < taxi.length; i++ ) {
      var taxiObject = new Taxi();
      for( var j = 0; j < size; j++ ) {
        taxiObject.road[ courses[j] ] = parseInt( Math.random() * 100 );
      }
      for( var j = size; j < taxi.length; j++ ) {
        courses[j] = -1*j;
        taxiObject.road[ -1*j ] = 999;
      }
      costTable.push( taxiObject );
    }
    console.log( 'Cost table', costTable );
    console.log( 'courses table', courses );
    return costTable;
  }

} ] );
