HomepageModule.controller( 'PlanningCoursesController', ['$scope', '$http', '$filter', 'toastr', function( $scope, $http, $filter ) {

  var allCourses = [];

  var checkIndex = { taxiDownloadComplete: false, coursesDownloadComplete: false };

  var coursesFull = [];
  var courses = [];
  var taxi = [];
  getCourses();
  getFreeTaxi();

  class Taxi {
    constructor() {
      this.cost = [];
    }
  }

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
        console.log('Courses', courses);
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
              window.location.href = '/#/';
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

  //funkcja tworzenia tablicy kosztow
  function makeCostTable( taxi, courses ) {
    var costTable = [];
    for( var i = 0; i < taxi.length; i++ ) {
      //utworz obiekt taksowki
      var taxiObject = new Taxi();
      //wypełnij tablice kosztow dojazdu do kursow
      for( var j = 0; j < courses.length; j++ ) {
        //jeśli posiada adres odbioru
        if( coursesFull[ courses[ j ] ].adres_odbioru ) {
          countRoute( taxi[ i ], courses[ j ], taxiObject, courses[ j ] , costTable, i, taxi.length, function() {
            finish();
          } );
        }
        //jeśli nie posiada adresu odbioru
        else {
          taxiObject.cost[ courses[ j ] ] = 999999;
        }
      }
      //wypełnij pozostałe miejsca w tablicy kosztow dojazdu
      for( var j = courses.length; j < taxi.length; j++ ) {
        //przypisz liczbę ujemną jako brak kursu
        courses[ j ] = -1*j;
        taxiObject.cost[ -1*j ] = 999999;
      }
      //jeśli cała tablica kosztow dojazdu została wypełniona
      if( Object.size( taxiObject.cost ) == taxi.length ) {
        //dodaj obiekt taksowki do tablicy kosztow
        costTable[ i ] = taxiObject;
        finish();
      }
    }
    //funkcja wewnętrzna do wywołania kontynuowania algorytmu
    function finish() {
      //jeśli cała tablica kosztow dojazdu została wypełniona
      if( Object.size( costTable ) == taxi.length ) {
        //kontynuuj algorytm
        $( document ).trigger({
          type:"geneticStartAlgorithm",
          value:costTable
        });
        return costTable;
      }
    }
  }

  //funkcja obliczania kosztu dojazdu taksowki do adresu odbioru kursu
  function countRoute( taxi, course, taxiObject, courseId, costTable, index, size, onComplete ) {
    //pobierz lokalizację taksowki
    $http.get("/taxi_location?id=" + taxi.id )
    .success( function( response ) {
      var location = response;

      //pobierz odległość taksowki od adresu odbioru z google maps API
      var service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [new google.maps.LatLng(location.lat, location.lng)],
          destinations: [coursesFull[course].adres_odbioru.nr_budynku + '+' + coursesFull[course].adres_odbioru.ulica + '+' + coursesFull[course].adres_odbioru.miasto + '+Polska'],
          travelMode: google.maps.TravelMode.DRIVING
        },
        function( response ) {
          var routeDistance = response.rows[0].elements[0].distance.value;

          //pobierz zysk taksowkarza w bieżącym miesiącu
          $http.get("/taxi_profit?id=" + taxi.id )
          .success( function( response ) {
            console.log( response );
            var profit = response.profit;
            if( profit == 0 ) {
              profit = 1;
            }
            //zamien status taksowkarza na wartość liczbową
            var status = getValueOfTaxiStatus( taxi.status );
            //oblicz koszt dojazdu
            taxiObject.cost[ courseId ] = routeDistance / ( profit * status );
            console.log( 'cost', taxiObject.cost[ courseId ], taxi.id );
            //jeśli cała tablica kosztow dojazdu została wypełniona
            if( Object.size( taxiObject.cost ) == size ) {
              //dodaj obiekt taksowki do tablicy kosztow
              costTable[ index ] = taxiObject;
              onComplete();
            }
          } );
        }
      );
    } );
  }

  function getValueOfTaxiStatus( status ) {
    switch( status ) {
      case '1':
        return 1;
      case '1/2':
        return 0.5;
      default:
        return 1;
    }
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
