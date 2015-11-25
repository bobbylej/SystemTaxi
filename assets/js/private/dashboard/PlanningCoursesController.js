DashboardModule.controller( 'PlanningCoursesController', ['$scope', '$http', '$filter', 'toastr', function( $scope, $http, $filter ) {

  var allCourses = [];

  var checkIndex = { taxiDownloadComplete: false, coursesDownloadComplete: false };

  var coursesFull = [];
  var courses = [];
  var taxi = [];
  getCourses();
  getFreeTaxi();

  $( document ).on( 'geneticStart', function() {
    if( checkIndex.taxiDownloadComplete && checkIndex.coursesDownloadComplete ) {
      console.log( 'Start' );

      if( taxi.length < courses.length ) {
        var size = taxi.length;
        courses = courses.slice( 0, size );
      }

      makeCostTable( taxi, courses );

      $( document ).on( 'geneticStartAlgorithm', function( data ) {

        var costTable = data.value;
        console.log( 'COST:', costTable );
        var geneticAlgorithm = new GeneticAlgorithm( courses, costTable, 500, 0.7, 300 );

        console.log( 'Parameters: ', 'Population size: ' + geneticAlgorithm.population.size,
       		'Mutation\'s probability: ' + geneticAlgorithm.population.mutateProb, 'Amount: ' + geneticAlgorithm.amount );

      	geneticAlgorithm.start();

      	console.log( 'Stop', 'Best: ', geneticAlgorithm.population.best );
        console.log( 'TAXI', taxi );
        for( var i = 0; i < geneticAlgorithm.population.best.genes.length; i++ ) {
          if( geneticAlgorithm.population.best.genes[i] > 0 ) {
            $http.post( "/update_taxi_course", {
              id: geneticAlgorithm.population.best.genes[i],
              taksowkarz: taxi[i].id
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
      } );

    }
  } );




  function getCourses() {
    return $http.get("/planning_courses" + "?status_kursu=oczekuje" )
    .success( function( response ) {
      checkIndex.coursesDownloadComplete = true;
      //courses = response;
      courses = [];
      for( var i = 0; i < response.length; i++ ) {
        coursesFull[ response[i].id ] = response[i];
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

  function makeCostTable( taxi, courses ) {
    var costTable = [];
    for( var i = 0; i < taxi.length; i++ ) {
      var taxiObject = new Taxi();
      for( var j = 0; j < courses.length; j++ ) {
        console.log( 'taxi', taxi[i], 'course', courses[j] );
        if( coursesFull[ courses[ j ] ].adres_odbioru ) {
        console.log( 'taxiObj', Object.size( taxiObject.cost ), taxi.length, taxiObject );
          countRoute( taxi[ i ], courses[ j ], taxiObject, courses[ j ] , costTable, i, taxi.length, function() {
            finish();
          } );
        }
        else {
          taxiObject.cost[ courses[ j ] ] = 999999;
        }
        //taxiObject.cost[ courses[j] ] = parseInt( Math.random() * 100 );
      }
      for( var j = courses.length; j < taxi.length; j++ ) {
        courses[ j ] = -1*j;
        taxiObject.cost[ -1*j ] = 999999;
      }
      if( Object.size( taxiObject.cost ) == taxi.length ) {
        costTable[ i ] = taxiObject;
        finish();
      }
    }
    console.log( 'Cost table', costTable );
    console.log( 'courses table', courses );
    function finish() {
      console.log( 'FinishCostTable', Object.size( costTable ), costTable );
      if( Object.size( costTable ) == taxi.length ) {
        $( document ).trigger({
          type:"geneticStartAlgorithm",
          value:costTable
        });
        return costTable;
      }
    }
  }

  function countRoute( taxi, course, taxiObject, courseId, costTable, index, size, onComplete ) {
    $http.get("/taxi_location?id=" + taxi.id )
    .success( function( response ) {
      var location = response;
      var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
      url += 'origins=' + location.lat + ',' + location.lng;
      url += '&destinations=' + coursesFull[course].adres_odbioru.nr_budynku + '+' + coursesFull[course].adres_odbioru.ulica + '+' + coursesFull[course].adres_odbioru.miasto + '+Polska';
      //url += '&destinations=' + 'Polska';
      url += '&key=AIzaSyBXTZogSxhfwrK_smDpOTFUBsWyoKW9ejU';
      console.log( 'URL', url );
      console.log( 'Course', coursesFull[course] );

      $http.get( url ).success( function( response ) {
        taxiObject.cost[ courseId ] = response.rows[0].elements[0].distance.value;
        if( Object.size( taxiObject.cost ) == size ) {
          console.log( 'rouuuute-cost', index, taxiObject );
          costTable[ index ] = taxiObject;
          console.log( 'count route ' + coursesFull[course].id + ' - ' + taxi.id, taxiObject );
          onComplete();
        }
      } );
    } );
  }

  Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  function startAnimate() {

  }

} ] );
