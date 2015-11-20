DashboardModule.controller( 'MapControllerOld', ['$scope', '$http', '$filter', 'toastr', function( $scope, $http, $filter ) {

  $( '.sidebar .menu a' ).removeClass( 'active' );
  $( '.sidebar .menu .map-link' ).addClass( 'active' );
  $( '.topbar .menu a' ).removeClass( 'active' );
  $( '.topbar .menu .map-link' ).addClass( 'active' );



  var map = null;
  var allCourses = getActualCourses( [] );
  var allAdresses = [];
  var coursesMarkers = [];
  var allTaxi = getWorkTaxi( [] );
  var taxiMarkers = [];

  var colors = [
    { start: '#1abc9c', stop: '#16a085' },
    { start: '#2ecc71', stop: '#27ae60' },
    { start: '#3498db', stop: '#2980b9' },
    { start: '#9b59b6', stop: '#8e44ad' },
    { start: '#e67e22', stop: '#d35400' },
    { start: '#e74c3c', stop: '#c0392b' }
  ];
  var taxiColor = '#f1c40f';


  //show map
  $.ajax({
    url: 'http://maps.googleapis.com/maps/api/js?key=AIzaSyC9R7KitA09oH9BUFBGAykDas2y4WUNyPY',
    dataType: "script",
    success: function() {
      //Initialize map in Wroclaw
      function initialize() {
        var mapProp = {
          center: new google.maps.LatLng( 51.107885, 17.038538 ),
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map( document.getElementById( 'googleMap' ), mapProp );

      }
      initialize();
      //show taxi on maps
      getWorkTaxi( [], makeTaxiMarkers() );
      //show courses addresses on map
      getActualCourses( [], makeAddressMarkers( allCourses ) );
    }
  });

  $scope.filter = function( taxi, client ) {
    clearMap();
    //show taxi on maps
    if( taxi.id && taxi.id != '' ) {
      taxiMarkers[ taxi.id ].setMap( map );
      showCoursesMarkersForTaxi( taxi.id );
    }
    else {
      showAllTaxiMarkers();
    }
    //show courses addresses on map
    if( client && client != '' ) {
      showCoursesMarkersForClient( client );
    }
    else if( !taxi.id || taxi.id == '' ) {
      showAllCoursesMarkers();
    }
  }

  function clearMap() {
    for( var i in taxiMarkers ) {
      taxiMarkers[ i ].setMap( null );
    }
    for( var i in coursesMarkers ) {
      if( coursesMarkers[ i ].start )
        coursesMarkers[ i ].start.setMap( null );
      if( coursesMarkers[ i ].stop )
        coursesMarkers[ i ].stop.setMap( null );
    }
  }

  function showAllTaxiMarkers() {
    for( var i in taxiMarkers ) {
      taxiMarkers[ i ].setMap( map );
    }
  }

  function showAllCoursesMarkers() {
    for( var i in coursesMarkers ) {
      if( coursesMarkers[ i ].start )
        coursesMarkers[ i ].start.setMap( map );
      if( coursesMarkers[ i ].stop )
        coursesMarkers[ i ].stop.setMap( map );
    }
  }

  function showCoursesMarkersForTaxi( taxiId ) {
    for( var i in coursesMarkers ) {
      if( coursesMarkers[ i ].taxi == taxiId ) {
        if( coursesMarkers[ i ].start )
          coursesMarkers[ i ].start.setMap( map );
        if( coursesMarkers[ i ].stop )
          coursesMarkers[ i ].stop.setMap( map );
      }
    }
  }

  function showCoursesMarkersForClient( client ) {
    for( var i in coursesMarkers ) {
      if( coursesMarkers[ i ].client == client ) {
        if( coursesMarkers[ i ].start )
          coursesMarkers[ i ].start.setMap( map );
        if( coursesMarkers[ i ].stop )
          coursesMarkers[ i ].stop.setMap( map );
      }
    }
  }


  function makeTaxiMarkers() {
    console.log( allTaxi );
    for ( var i = 0; i < allTaxi.length; i++ ) {
        if( allTaxi[i].stan == 'wolny' ) {
          getSingleTaxiMarker( allTaxi[i] );
        }
    }
  }

  function getSingleTaxiMarker( taxi, style ) {
    $http.get("/taxi_location?id=" + taxi.id )
    .success( function( response ) {
      var location = response;

      var latlng = new google.maps.LatLng( location.lat, location.lng );

      var title = '<b>Taxi: #' + taxi.id + '</b><br/>';
      if( taxi.course ) title += 'Kurs: #' + taxi.course;

      var marker = new google.maps.Marker( {
          position: latlng,
          map: map,
          title: title,
          icon: makeTaxiMarkerIcon( '#f1c40f', style )
      } );
      marker.addListener( 'click', function() {
        new google.maps.InfoWindow( {
          content: this.title + ''
        } ).open( map, this );
      } );

      taxiMarkers[ taxi.id ] = marker;

    } );
  }

  function makeAddressMarkers( courses ) {
    for (var i = 0; i < courses.length; i++) {
        getSingleAddressMarker( courses[i] );
    }
  }

  function getSingleAddressMarker( course ) {
    var color = colors[ ( Math.floor( Math.random() * (colors.length - 1 ) ) ) ];

    if( course.status_kursu == 'oczekuje' ) {
      var style = { opacity: 1, strokeColor: '#1f1f1f', strokeWeight: 2 };
    }
    else {
      var style = { opacity: 0.5, strokeColor: '#f1c40f', strokeWeight: 2 };
    }


    var addressStart = getAddressFromCourse( course );
    $.getJSON( 'http://maps.googleapis.com/maps/api/geocode/json?address='+addressStart+'&sensor=false', null, function (data) {
        if( course.taksowkarz ) {
          console.log( 'KUrs' + course.id + ' kolor ' + color.start, 'Taxi' + course.taksowkarz );
          getSingleTaxiMarker( { id: course.taksowkarz, course: course.id }, { opacity: 1, strokeColor: color.start, strokeWeight: 2 } );
        }

        var p = data.results[0].geometry.location
        var latlng = new google.maps.LatLng( p.lat, p.lng );

        var title = 'Kurs: #' + course.id + '<br/><b>' + course.klient + '</b><br/>Adres odbioru:<br/>' + addressStart
          + '<br/>Status: ' + course.status_kursu;
        if( course.taksowkarz ) title += '<br/>Taxi: #' + course.taksowkarz;

        var marker = new google.maps.Marker( {
            position: latlng,
            map: map,
            title: title,
            icon: makeMarkerIcon( color.start, style )
        } );
        marker.addListener( 'click', function() {
          new google.maps.InfoWindow( {
            content: this.title + ''
          } ).open( map, this );
        } );

        if( coursesMarkers[ course.id ] ) {
          coursesMarkers[ course.id ].start = marker;
        }
        else {
          coursesMarkers[ course.id ] = { start: marker };
        }
    } );
    var addressStop = getAddressFromCourse( course, true );
    if( addressStop ) {
      $.getJSON( 'http://maps.googleapis.com/maps/api/geocode/json?address='+addressStop+'&sensor=false', null, function (data) {
          var p = data.results[0].geometry.location
          var latlng = new google.maps.LatLng( p.lat, p.lng );

          var title = 'Kurs: #' + course.id + '<br/><b>' + course.klient + '</b><br/>Adres dostarczenia:<br/>' + addressStop
            + '<br/>Status: ' + course.status_kursu;
          if( course.taksowkarz ) title += '<br/>Taxi: #' + course.taksowkarz;


          var marker = new google.maps.Marker( {
              position: latlng,
              map: map,
              title: title,
              icon: makeMarkerIcon( color.stop, style )
          } );
          marker.addListener( 'click', function() {
            new google.maps.InfoWindow( {
              content: this.title + ''
            } ).open( map, this );
          } );

          if( coursesMarkers[ course.id ] ) {
            coursesMarkers[ course.id ].stop = marker;
          }
          else {
            coursesMarkers[ course.id ] = { stop: marker };
          }
      } );
    }
  }

  function getAddressesFromCourses( courses ) {
    var addresses = [];
    for( var i = 0; i < courses.length; i++ ) {
      if( courses[i].adres_odbioru ) {
        addresses.push( courses[i].adres_odbioru.ulica + ' ' + courses[i].adres_odbioru.nr_budynku + ', ' + courses[i].adres_odbioru.miasto + ', Polska' );
      }
    }
    return addresses;
  }

  function getAddressFromCourse( course, getStop ) {
    if( getStop ) {
      if( course.adres_dostraczenia ) {
        return course.adres_dostraczenia.ulica + ' ' + course.adres_dostraczenia.nr_budynku + ', ' + course.adres_dostraczenia.miasto + ', Polska';
      }
    }
    else {
      if( course.adres_odbioru ) {
        return course.adres_odbioru.ulica + ' ' + course.adres_odbioru.nr_budynku + ', ' + course.adres_odbioru.miasto + ', Polska';
      }
    }
    return null;
  }

  function makeMarkerIcon( color, style ) {
    var opacity = 1;
    var strokeColor = '#1f1f1f';
    var strokeWeight = 1;
    if( style ) {
      opacity = style.opacity;
      strokeColor = style.strokeColor;
      strokeWeight = style.strokeWeight;
    }
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: color,
        fillOpacity: opacity,
        strokeColor: strokeColor,
        strokeWeight: strokeWeight,
        scale: 1,
    };
  }

  function makeTaxiMarkerIcon( color, style ) {
    var opacity = 1;
    var strokeColor = '#1f1f1f';
    var strokeWeight = 1;
    if( style ) {
      opacity = style.opacity;
      strokeColor = style.strokeColor;
      strokeWeight = style.strokeWeight;
    }
    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: opacity,
        strokeColor: strokeColor,
        strokeWeight: strokeWeight,
        scale: 10,
    };
  }

  function getActualCourses( filters, afterLoad ) {
    filterReq = '?strona=' + 1 + '&limit=99';
    filters.forEach( function( filter ) {
      filterReq += '&' + filter.key + '=' + filter.value;
    } );
    $http.get( "/actual_courses" + filterReq )
    .success( function( response ) {
      console.log( 'Map Courses to show', response );
      allCourses = response;
      allAdresses = getAddressesFromCourses( allCourses );
      if( afterLoad ) afterLoad;
      return response;
    });
  }

  function getWorkTaxi( filters, afterLoad ) {
    filterReq = '?strona=' + 1 + '&limit=99';
    filters.forEach( function( filter ) {
      filterReq += '&' + filter.key + '=' + filter.value;
    } );
    $http.get("/taxi_work" + filterReq )
    .success( function( response ) {
      allTaxi = response;
      console.log( 'Taxi Work to show', allTaxi );
      if( afterLoad ) afterLoad;
      return response;
    });
  }

} ] );
