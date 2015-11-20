/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  getOne: function( req, res ) {
      var id = req.query.id != undefined ? req.query.id : '';

      var data = CourseModel.findOne( { id: id } ).populate('adres_odbioru').populate('adres_dostraczenia').populate('zmieniajacy').exec( function( err, course ) {

        if( course ) {
          // Daty
          course.czas_calkowity = course.czas_dostarczenia ? Math.abs( course.czas_dostarczenia - course.czas_zamowienia ) : '';
          course.czas_do_odbioru = course.czas_odbioru ? Math.abs( course.czas_odbioru - course.czas_zamowienia ) : '';
          course.czas_do_dostarczenia = course.czas_dostarczenia && course.czas_odbioru ? Math.abs( course.czas_dostarczenia - course.czas_odbioru ) : '';
          course.koszt = course.czas_do_dostarczenia != '' ? ( course.czas_do_dostarczenia / 60000 ) * 0.5 : '';

          if( course.czas_calkowity != '' ) {
            var czas = {
              godz: Math.floor( course.czas_calkowity / ( 60000 * 60 ) ),
              min: Math.floor( course.czas_calkowity / 60000 ) % 60
            }
            course.czas_calkowity = ( czas.godz < 10 ? '0' : '' ) + czas.godz + ':' + ( czas.min < 10 ? '0' : '' ) + czas.min;
          }
          if( course.czas_do_odbioru != '' ) {
            var czas = {
              godz: Math.floor( course.czas_do_odbioru / ( 60000 * 60 ) ),
              min: Math.floor( course.czas_do_odbioru / 60000 ) % 60
            }
            course.czas_do_odbioru = ( czas.godz < 10 ? '0' : '' ) + czas.godz + ':' + ( czas.min < 10 ? '0' : '' ) + czas.min;
          }
          if( course.czas_do_dostarczenia != '' ) {
            var czas = {
              godz: Math.floor( course.czas_do_dostarczenia / ( 60000 * 60 ) ),
              min: Math.floor( course.czas_do_dostarczenia / 60000 ) % 60
            }
            course.czas_do_dostarczenia = ( czas.godz < 10 ? '0' : '' ) + czas.godz + ':' + ( czas.min < 10 ? '0' : '' ) + czas.min;
          }

          course.data = course.czas_zamowienia.getFullYear() + '-' + ( course.czas_zamowienia.getMonth() + 1 ) + '-' + course.czas_zamowienia.getDate();
          course.czas_zamowienia ? course.czas_zamowienia = ( course.czas_zamowienia.getHours() < 10 ? '0' : '' ) + course.czas_zamowienia.getHours() + ':' + ( course.czas_zamowienia.getMinutes() < 10 ? '0' : '' ) + course.czas_zamowienia.getMinutes() : '';
          course.czas_odbioru ? course.czas_odbioru = ( course.czas_odbioru.getHours() < 10 ? '0' : '' ) + course.czas_odbioru.getHours() + ':' + ( course.czas_odbioru.getMinutes() < 10 ? '0' : '' ) + course.czas_odbioru.getMinutes() : '';
          course.czas_dostarczenia ? course.czas_dostarczenia = ( course.czas_dostarczenia.getHours() < 10 ? '0' : '' ) + course.czas_dostarczenia.getHours() + ':' + ( course.czas_dostarczenia.getMinutes() < 10 ? '0' : '' ) + course.czas_dostarczenia.getMinutes() : '';

        }
          res.send( course );
          res.end();
      } );
      return data;
  },

  getAllCourses: function( req, res ) {
      var strona = req.query.strona != undefined ? req.query.strona : 1;
      var limit = req.query.limit != undefined ? req.query.limit : 15;
      var pomin = ( strona - 1 ) * limit;

      var status_kursu = req.query.status_kursu != undefined ? req.query.status_kursu : '';
      var id = req.query.id != undefined ? req.query.id : '';
      var taksowkarz = req.query.taksowkarz != undefined ? req.query.taksowkarz : '';
      var klient = req.query.klient != undefined ? req.query.klient : '';
      var osob_od = req.query.osob_od != undefined ? req.query.osob_od : -1;
      var osob_do = req.query.osob_do != undefined ? req.query.osob_do : 999;
      var data_od = req.query.data_od ? req.query.data_od : '';
      var data_do = req.query.data_do ? req.query.data_do : '';
      var czas_odbioru_od = req.query.czas_odbioru_od ? req.query.czas_odbioru_od : '';
      var czas_odbioru_do = req.query.czas_odbioru_do ? req.query.czas_odbioru_do : '';
      var czas_dostarczenia_od = req.query.czas_dostarczenia_od ? req.query.czas_dostarczenia_od : '';
      var czas_dostarczenia_do = req.query.czas_dostarczenia_do ? req.query.czas_dostarczenia_do : '';
      var czas_zamowienia_od = req.query.czas_zamowienia_od ? req.query.czas_zamowienia_od : '';
      var czas_zamowienia_do = req.query.czas_zamowienia_do ? req.query.czas_zamowienia_do : '';
      var anulowane = req.query.anulowane != undefined ? req.query.anulowane : '';
      var zmieniajacy = req.query.zmieniajacy != undefined ? req.query.zmieniajacy : '';

      var data = CourseModel.find( {
        where: {
          status_kursu: { 'contains': status_kursu },
          id: { 'contains': id },
          klient: { 'contains': klient },
          osob: { '>=': osob_od, '<=': osob_do },
          anulowane: { 'contains': anulowane }
        }, skip: pomin, limit: limit, sort: 'czas_zamowienia DESC' } )
        .populate('adres_odbioru').populate('adres_dostraczenia').populate('zmieniajacy').exec( function( err, courses ) {


          courses = courses.filter( function( elem ) {
            if( taksowkarz != '' ) {
              if( elem.taksowkarz ) {
                if( ( elem.taksowkarz.toString() ).indexOf( taksowkarz.toString() ) != -1 ) {
                  //return true;
                }
                else {
                  return false
                }
              }
              else {
                return false;
              }
            }
            if( zmieniajacy != '' ) {
              if( elem.zmieniajacy ) {
                var zmieniajacy_nazwa = elem.zmieniajacy.login + ': ' + elem.zmieniajacy.imie + elem.zmieniajacy.nazwisko;
                if( zmieniajacy_nazwa.indexOf( zmieniajacy ) != -1 ) {
                  //return true;
                }
                else {
                  return false
                }
              }
              else {
                return false;
              }
            }
            return true;
          } );

          for( var i = 0; i < courses.length; i++ ) {
            // Zmieniający
            courses[ i ].zmieniajacy ? courses[ i ].zmieniajacy = courses[ i ].zmieniajacy.login + ': ' + courses[ i ].zmieniajacy.imie + courses[ i ].zmieniajacy.nazwisko : '';

            // Daty
            var course = courses[ i ];
            courses[ i ].czas_calkowity = course.czas_dostarczenia ? Math.abs( course.czas_dostarczenia - course.czas_zamowienia ) : '';
            courses[ i ].czas_do_odbioru = course.czas_odbioru ? Math.abs( course.czas_odbioru - course.czas_zamowienia ) : '';
            courses[ i ].czas_do_dostarczenia = course.czas_dostarczenia && course.czas_odbioru ? Math.abs( course.czas_dostarczenia - course.czas_odbioru ) : '';
            courses[ i ].koszt = courses[ i ].czas_do_dostarczenia != '' ? ( courses[ i ].czas_do_dostarczenia / 60000 ) * 0.5 : '';

            if( courses[ i ].czas_calkowity != '' ) {
              var czas = {
                godz: Math.floor( courses[ i ].czas_calkowity / ( 60000 * 60 ) ),
                min: Math.floor( courses[ i ].czas_calkowity / 60000 ) % 60
              }
              courses[ i ].czas_calkowity = ( czas.godz < 10 ? '0' : '' ) + czas.godz + ':' + ( czas.min < 10 ? '0' : '' ) + czas.min;
            }
            if( courses[ i ].czas_do_odbioru != '' ) {
              var czas = {
                godz: Math.floor( courses[ i ].czas_do_odbioru / ( 60000 * 60 ) ),
                min: Math.floor( courses[ i ].czas_do_odbioru / 60000 ) % 60
              }
              courses[ i ].czas_do_odbioru = ( czas.godz < 10 ? '0' : '' ) + czas.godz + ':' + ( czas.min < 10 ? '0' : '' ) + czas.min;
            }
            if( courses[ i ].czas_do_dostarczenia != '' ) {
              var czas = {
                godz: Math.floor( courses[ i ].czas_do_dostarczenia / ( 60000 * 60 ) ),
                min: Math.floor( courses[ i ].czas_do_dostarczenia / 60000 ) % 60
              }
              courses[ i ].czas_do_dostarczenia = ( czas.godz < 10 ? '0' : '' ) + czas.godz + ':' + ( czas.min < 10 ? '0' : '' ) + czas.min;
            }

            courses[ i ].data = course.czas_zamowienia.getFullYear() + '-' + ( course.czas_zamowienia.getMonth() + 1 ) + '-' + course.czas_zamowienia.getDate();
            courses[ i ].czas_zamowienia ? courses[ i ].czas_zamowienia = ( course.czas_zamowienia.getHours() < 10 ? '0' : '' ) + course.czas_zamowienia.getHours() + ':' + ( course.czas_zamowienia.getMinutes() < 10 ? '0' : '' ) + course.czas_zamowienia.getMinutes() : '';
            courses[ i ].czas_odbioru ? courses[ i ].czas_odbioru = ( course.czas_odbioru.getHours() < 10 ? '0' : '' ) + course.czas_odbioru.getHours() + ':' + ( course.czas_odbioru.getMinutes() < 10 ? '0' : '' ) + course.czas_odbioru.getMinutes() : '';
            courses[ i ].czas_dostarczenia ? courses[ i ].czas_dostarczenia = ( course.czas_dostarczenia.getHours() < 10 ? '0' : '' ) + course.czas_dostarczenia.getHours() + ':' + ( course.czas_dostarczenia.getMinutes() < 10 ? '0' : '' ) + course.czas_dostarczenia.getMinutes() : '';

          }

          courses = courses.filter( function( elem ) {
            var result = true;
            if( data_od && data_od != '' ) {
              if( new Date( data_od ) <= new Date( elem.data ) ) {
                result = result && true;
              }
              else {
                return false;
              }
            }
            if( data_do && data_do != '' ) {
              if( new Date( data_do ) >= new Date( elem.data ) ) {
                result = result && true;
              }
              else {
                return false;
              }
            }

            var filtersTimes = [ [ czas_zamowienia_od, czas_zamowienia_do, elem.czas_zamowienia ],
              [ czas_odbioru_od, czas_odbioru_do, elem.czas_odbioru ],
              [ czas_dostarczenia_od, czas_dostarczenia_do, elem.czas_dostarczenia ] ];

            for( var i = 0; i < filtersTimes.length; i++ ) {
              if( filtersTimes[ i ][ 0 ] && filtersTimes[ i ][ 0 ] != '' ) {
                var data1 = new Date, data2 = new Date,
                  czas1 = filtersTimes[ i ][ 0 ].split( /\:|\-/g ),
                  czas2 = filtersTimes[ i ][ 2 ].split( /\:|\-/g );
                data1.setHours(czas1[0]);
                data1.setMinutes(czas1[1]);
                data2.setHours(czas2[0]);
                data2.setMinutes(czas2[1]);
                if( data1 <= data2 ) {
                  result = result && true;
                }
                else {
                  return false;
                }
              }
              if( filtersTimes[ i ][ 1 ] && filtersTimes[ i ][ 1 ] != '' ) {
                var data1 = new Date, data2 = new Date,
                  czas1 = filtersTimes[ i ][ 1 ].split( /\:|\-/g ),
                  czas2 = filtersTimes[ i ][ 2 ].split( /\:|\-/g );
                data1.setHours(czas1[ 0 ]);
                data1.setMinutes(czas1[ 1 ]);
                data2.setHours(czas2[ 0 ]);
                data2.setMinutes(czas2[ 1 ]);
                if( data1 >= data2 ) {
                  result = result && true;
                }
                else {
                  return false;
                }
              }
            }

            return result;
          } );

          res.send( courses );
          res.end();
      } );
      return data;
  },

  getPlanningCourses: function( req, res ) {
      var strona = req.query.strona != undefined ? req.query.strona : 1;
      var limit = req.query.limit != undefined ? req.query.limit : 15;
      var pomin = ( strona - 1 ) * limit;

      var status_kursu = req.query.status_kursu != undefined ? req.query.status_kursu : '';
      var id = req.query.id != undefined ? req.query.id : '';
      var taksowkarz = req.query.taksowkarz != undefined ? req.query.taksowkarz : '';
      var klient = req.query.klient != undefined ? req.query.klient : '';
      var osob_od = req.query.osob_od != undefined ? req.query.osob_od : -1;
      var osob_do = req.query.osob_do != undefined ? req.query.osob_do : 999;
      var data_od = req.query.data_od ? req.query.data_od : '';
      var data_do = req.query.data_do ? req.query.data_do : '';
      var czas_odbioru_od = req.query.czas_odbioru_od ? req.query.czas_odbioru_od : '';
      var czas_odbioru_do = req.query.czas_odbioru_do ? req.query.czas_odbioru_do : '';
      var czas_dostarczenia_od = req.query.czas_dostarczenia_od ? req.query.czas_dostarczenia_od : '';
      var czas_dostarczenia_do = req.query.czas_dostarczenia_do ? req.query.czas_dostarczenia_do : '';
      var czas_zamowienia_od = req.query.czas_zamowienia_od ? req.query.czas_zamowienia_od : '';
      var czas_zamowienia_do = req.query.czas_zamowienia_do ? req.query.czas_zamowienia_do : '';
      var anulowane = req.query.anulowane != undefined ? req.query.anulowane : '';
      var zmieniajacy = req.query.zmieniajacy != undefined ? req.query.zmieniajacy : '';

      var data = CourseModel.find( {
        where: {
          status_kursu: { 'contains': status_kursu },
          id: { 'contains': id },
          klient: { 'contains': klient },
          osob: { '>=': osob_od, '<=': osob_do },
          anulowane: false
        }, skip: pomin, limit: limit } )
        .populate('adres_odbioru').populate('adres_dostraczenia').populate('zmieniajacy').exec( function( err, courses ) {


          courses = courses.filter( function( elem ) {
            if( taksowkarz != '' ) {
              if( elem.taksowkarz ) {
                if( ( elem.taksowkarz.toString() ).indexOf( taksowkarz.toString() ) != -1 ) {
                  //return true;
                }
                else {
                  return false
                }
              }
              else {
                return false;
              }
            }
            if( elem.zmieniajacy ) {
                return false;
            }
            return true;
          } );

          for( var i = 0; i < courses.length; i++ ) {
            // Zmieniający
            courses[ i ].zmieniajacy ? courses[ i ].zmieniajacy = courses[ i ].zmieniajacy.login + ': ' + courses[ i ].zmieniajacy.imie + courses[ i ].zmieniajacy.nazwisko : '';

            // Daty
            var course = courses[ i ];
            courses[ i ].czas_calkowity = course.czas_dostarczenia ? Math.abs( course.czas_dostarczenia - course.czas_zamowienia ) : '';
            courses[ i ].czas_do_odbioru = course.czas_odbioru ? Math.abs( course.czas_odbioru - course.czas_zamowienia ) : '';
            courses[ i ].czas_do_dostarczenia = course.czas_dostarczenia && course.czas_odbioru ? Math.abs( course.czas_dostarczenia - course.czas_odbioru ) : '';
            courses[ i ].koszt = courses[ i ].czas_do_dostarczenia != '' ? ( courses[ i ].czas_do_dostarczenia / 60000 ) * 0.5 : '';

            if( courses[ i ].czas_calkowity != '' ) {
              var czas = {
                godz: Math.floor( courses[ i ].czas_calkowity / ( 60000 * 60 ) ),
                min: Math.floor( courses[ i ].czas_calkowity / 60000 ) % 60
              }
              courses[ i ].czas_calkowity = ( czas.godz < 10 ? '0' : '' ) + czas.godz + ':' + ( czas.min < 10 ? '0' : '' ) + czas.min;
            }
            if( courses[ i ].czas_do_odbioru != '' ) {
              var czas = {
                godz: Math.floor( courses[ i ].czas_do_odbioru / ( 60000 * 60 ) ),
                min: Math.floor( courses[ i ].czas_do_odbioru / 60000 ) % 60
              }
              courses[ i ].czas_do_odbioru = ( czas.godz < 10 ? '0' : '' ) + czas.godz + ':' + ( czas.min < 10 ? '0' : '' ) + czas.min;
            }
            if( courses[ i ].czas_do_dostarczenia != '' ) {
              var czas = {
                godz: Math.floor( courses[ i ].czas_do_dostarczenia / ( 60000 * 60 ) ),
                min: Math.floor( courses[ i ].czas_do_dostarczenia / 60000 ) % 60
              }
              courses[ i ].czas_do_dostarczenia = ( czas.godz < 10 ? '0' : '' ) + czas.godz + ':' + ( czas.min < 10 ? '0' : '' ) + czas.min;
            }

            courses[ i ].data = course.czas_zamowienia.getFullYear() + '-' + ( course.czas_zamowienia.getMonth() + 1 ) + '-' + course.czas_zamowienia.getDate();
            courses[ i ].czas_zamowienia ? courses[ i ].czas_zamowienia = ( course.czas_zamowienia.getHours() < 10 ? '0' : '' ) + course.czas_zamowienia.getHours() + ':' + ( course.czas_zamowienia.getMinutes() < 10 ? '0' : '' ) + course.czas_zamowienia.getMinutes() : '';
            courses[ i ].czas_odbioru ? courses[ i ].czas_odbioru = ( course.czas_odbioru.getHours() < 10 ? '0' : '' ) + course.czas_odbioru.getHours() + ':' + ( course.czas_odbioru.getMinutes() < 10 ? '0' : '' ) + course.czas_odbioru.getMinutes() : '';
            courses[ i ].czas_dostarczenia ? courses[ i ].czas_dostarczenia = ( course.czas_dostarczenia.getHours() < 10 ? '0' : '' ) + course.czas_dostarczenia.getHours() + ':' + ( course.czas_dostarczenia.getMinutes() < 10 ? '0' : '' ) + course.czas_dostarczenia.getMinutes() : '';

          }

          courses = courses.filter( function( elem ) {
            var result = true;
            if( data_od && data_od != '' ) {
              if( new Date( data_od ) <= new Date( elem.data ) ) {
                result = result && true;
              }
              else {
                return false;
              }
            }
            if( data_do && data_do != '' ) {
              if( new Date( data_do ) >= new Date( elem.data ) ) {
                result = result && true;
              }
              else {
                return false;
              }
            }

            var filtersTimes = [ [ czas_zamowienia_od, czas_zamowienia_do, elem.czas_zamowienia ],
              [ czas_odbioru_od, czas_odbioru_do, elem.czas_odbioru ],
              [ czas_dostarczenia_od, czas_dostarczenia_do, elem.czas_dostarczenia ] ];

            for( var i = 0; i < filtersTimes.length; i++ ) {
              if( filtersTimes[ i ][ 0 ] && filtersTimes[ i ][ 0 ] != '' ) {
                var data1 = new Date, data2 = new Date,
                  czas1 = filtersTimes[ i ][ 0 ].split( /\:|\-/g ),
                  czas2 = filtersTimes[ i ][ 2 ].split( /\:|\-/g );
                data1.setHours(czas1[0]);
                data1.setMinutes(czas1[1]);
                data2.setHours(czas2[0]);
                data2.setMinutes(czas2[1]);
                if( data1 <= data2 ) {
                  result = result && true;
                }
                else {
                  return false;
                }
              }
              if( filtersTimes[ i ][ 1 ] && filtersTimes[ i ][ 1 ] != '' ) {
                var data1 = new Date, data2 = new Date,
                  czas1 = filtersTimes[ i ][ 1 ].split( /\:|\-/g ),
                  czas2 = filtersTimes[ i ][ 2 ].split( /\:|\-/g );
                data1.setHours(czas1[ 0 ]);
                data1.setMinutes(czas1[ 1 ]);
                data2.setHours(czas2[ 0 ]);
                data2.setMinutes(czas2[ 1 ]);
                if( data1 >= data2 ) {
                  result = result && true;
                }
                else {
                  return false;
                }
              }
            }

            return result;
          } );

          res.send( courses );
          res.end();
      } );
      return data;
  },


  getActualCourses: function( req, res ) {
      var strona = req.query.strona != undefined ? req.query.strona : 1;
      var limit = req.query.limit != undefined ? req.query.limit : 15;
      var pomin = ( strona - 1 ) * limit;

      var status_kursu = req.query.status_kursu != undefined ? req.query.status_kursu : '';
      var id = req.query.id != undefined ? req.query.id : '';
      var taksowkarz = req.query.taksowkarz != undefined ? req.query.taksowkarz : '';
      var klient = req.query.klient != undefined ? req.query.klient : '';
      var osob_od = req.query.osob_od != undefined ? req.query.osob_od : -1;
      var osob_do = req.query.osob_do != undefined ? req.query.osob_do : 999;
      var data_od = req.query.data_od ? req.query.data_od : '';
      var data_do = req.query.data_do ? req.query.data_do : '';
      var czas_odbioru_od = req.query.czas_odbioru_od ? req.query.czas_odbioru_od : '';
      var czas_odbioru_do = req.query.czas_odbioru_do ? req.query.czas_odbioru_do : '';
      var czas_dostarczenia_od = req.query.czas_dostarczenia_od ? req.query.czas_dostarczenia_od : '';
      var czas_dostarczenia_do = req.query.czas_dostarczenia_do ? req.query.czas_dostarczenia_do : '';
      var czas_zamowienia_od = req.query.czas_zamowienia_od ? req.query.czas_zamowienia_od : '';
      var czas_zamowienia_do = req.query.czas_zamowienia_do ? req.query.czas_zamowienia_do : '';
      var anulowane = req.query.anulowane != undefined ? req.query.anulowane : '';
      var zmieniajacy = req.query.zmieniajacy != undefined ? req.query.zmieniajacy : '';

      var data = CourseModel.find( {
        where: {
          or : [
            { status_kursu: 'realizowany' },
            { status_kursu: 'oczekuje' }
          ],
          id: { 'contains': id },
          klient: { 'contains': klient },
          osob: { '>=': osob_od, '<=': osob_do },
          anulowane: { 'contains': 0 }
        }, skip: pomin, limit: limit, sort: 'status_kursu ASC' } )
        .populate('adres_odbioru').populate('adres_dostraczenia').populate('zmieniajacy').exec( function( err, courses ) {
          if( err ) {
            res.send( 'Erorr' + err );
            res.end();
            return false;
          }

          courses = courses.filter( function( elem ) {
            if( taksowkarz != '' ) {
              if( elem.taksowkarz ) {
                if( ( elem.taksowkarz.toString() ).indexOf( taksowkarz.toString() ) != -1 ) {
                  //return true;
                }
                else {
                  return false
                }
              }
              else {
                return false;
              }
            }
            if( zmieniajacy != '' ) {
              if( elem.zmieniajacy ) {
                var zmieniajacy_nazwa = elem.zmieniajacy.login + ': ' + elem.zmieniajacy.imie + elem.zmieniajacy.nazwisko;
                if( zmieniajacy_nazwa.indexOf( zmieniajacy ) != -1 ) {
                  //return true;
                }
                else {
                  return false
                }
              }
              else {
                return false;
              }
            }
            return true;
          } );

          for( var i = 0; i < courses.length; i++ ) {
            // Zmieniający
            courses[ i ].zmieniajacy ? courses[ i ].zmieniajacy = courses[ i ].zmieniajacy.login + ': ' + courses[ i ].zmieniajacy.imie + courses[ i ].zmieniajacy.nazwisko : '';

            // Daty
            var course = courses[ i ];
            courses[ i ].czas_calkowity = course.czas_dostarczenia ? Math.abs( course.czas_dostarczenia - course.czas_zamowienia ) : '';
            courses[ i ].czas_do_odbioru = course.czas_odbioru ? Math.abs( course.czas_odbioru - course.czas_zamowienia ) : '';
            courses[ i ].czas_do_dostarczenia = course.czas_dostarczenia && course.czas_odbioru ? Math.abs( course.czas_dostarczenia - course.czas_odbioru ) : '';
            courses[ i ].koszt = courses[ i ].czas_do_dostarczenia != '' ? ( courses[ i ].czas_do_dostarczenia / 60000 ) * 0.5 : '';

            if( courses[ i ].czas_calkowity != '' ) {
              var czas = {
                godz: Math.floor( courses[ i ].czas_calkowity / ( 60000 * 60 ) ),
                min: Math.floor( courses[ i ].czas_calkowity / 60000 ) % 60
              }
              courses[ i ].czas_calkowity = ( czas.godz < 10 ? '0' : '' ) + czas.godz + ':' + ( czas.min < 10 ? '0' : '' ) + czas.min;
            }
            if( courses[ i ].czas_do_odbioru != '' ) {
              var czas = {
                godz: Math.floor( courses[ i ].czas_do_odbioru / ( 60000 * 60 ) ),
                min: Math.floor( courses[ i ].czas_do_odbioru / 60000 ) % 60
              }
              courses[ i ].czas_do_odbioru = ( czas.godz < 10 ? '0' : '' ) + czas.godz + ':' + ( czas.min < 10 ? '0' : '' ) + czas.min;
            }
            if( courses[ i ].czas_do_dostarczenia != '' ) {
              var czas = {
                godz: Math.floor( courses[ i ].czas_do_dostarczenia / ( 60000 * 60 ) ),
                min: Math.floor( courses[ i ].czas_do_dostarczenia / 60000 ) % 60
              }
              courses[ i ].czas_do_dostarczenia = ( czas.godz < 10 ? '0' : '' ) + czas.godz + ':' + ( czas.min < 10 ? '0' : '' ) + czas.min;
            }

            courses[ i ].data = course.czas_zamowienia.getFullYear() + '-' + ( course.czas_zamowienia.getMonth() + 1 ) + '-' + course.czas_zamowienia.getDate();
            courses[ i ].czas_zamowienia ? courses[ i ].czas_zamowienia = ( course.czas_zamowienia.getHours() < 10 ? '0' : '' ) + course.czas_zamowienia.getHours() + ':' + ( course.czas_zamowienia.getMinutes() < 10 ? '0' : '' ) + course.czas_zamowienia.getMinutes() : '';
            courses[ i ].czas_odbioru ? courses[ i ].czas_odbioru = ( course.czas_odbioru.getHours() < 10 ? '0' : '' ) + course.czas_odbioru.getHours() + ':' + ( course.czas_odbioru.getMinutes() < 10 ? '0' : '' ) + course.czas_odbioru.getMinutes() : '';
            courses[ i ].czas_dostarczenia ? courses[ i ].czas_dostarczenia = ( course.czas_dostarczenia.getHours() < 10 ? '0' : '' ) + course.czas_dostarczenia.getHours() + ':' + ( course.czas_dostarczenia.getMinutes() < 10 ? '0' : '' ) + course.czas_dostarczenia.getMinutes() : '';

          }

          courses = courses.filter( function( elem ) {
            if( data_od && data_od != '' ) {
              if( new Date( data_od ) <= new Date( elem.data ) ) {
                return true;
              }
              return false;
            }
            if( data_do && data_do != '' ) {
              if( new Date( data_do ) >= new Date( elem.data ) ) {
                return true;
              }
              return false;
            }

            var filtersTimes = [ [ czas_zamowienia_od, czas_zamowienia_do, elem.czas_zamowienia ],
              [ czas_odbioru_od, czas_odbioru_do, elem.czas_odbioru ],
              [ czas_dostarczenia_od, czas_dostarczenia_do, elem.czas_dostarczenia ] ];

            for( var i = 0; i < filtersTimes.length; i++ ) {
              if( filtersTimes[ i ][ 0 ] && filtersTimes[ i ][ 0 ] != '' ) {
                var data1 = new Date, data2 = new Date,
                  czas1 = filtersTimes[ i ][ 0 ].split( /\:|\-/g ),
                  czas2 = filtersTimes[ i ][ 2 ].split( /\:|\-/g );
                data1.setHours(czas1[0]);
                data1.setMinutes(czas1[1]);
                data2.setHours(czas2[0]);
                data2.setMinutes(czas2[1]);
                if( data1 <= data2 ) {
                  return true;
                }
                return false;
              }
              if( filtersTimes[ i ][ 1 ] && filtersTimes[ i ][ 1 ] != '' ) {
                var data1 = new Date, data2 = new Date,
                  czas1 = filtersTimes[ i ][ 1 ].split( /\:|\-/g ),
                  czas2 = filtersTimes[ i ][ 2 ].split( /\:|\-/g );
                data1.setHours(czas1[ 0 ]);
                data1.setMinutes(czas1[ 1 ]);
                data2.setHours(czas2[ 0 ]);
                data2.setMinutes(czas2[ 1 ]);
                if( data1 >= data2 ) {
                  return true;
                }
                return false;
              }
            }

            return true;
          } );

          res.send( courses );
          res.end();
      } );
      return data;
  },

  edit: function( req, res ) {
    var id = req.body.id != undefined ? req.body.id : '';
    var taksowkarz = req.body.taksowkarz != undefined ? req.body.taksowkarz : '';
    var zmieniajacy = req.body.zmieniajacy != undefined ? req.body.zmieniajacy : '';

    console.log( req.body );

    var data = CourseModel.findOne( { id: id } ).exec( function( err, course ) {

      if( course ) {
        course.taksowkarz = taksowkarz;
        course.zmieniajacy = zmieniajacy;
        course.save( function( error ) {
          res.send( course );
        } );


      }
    } );

    TaxiModel.findOne( { id: taksowkarz } ).exec( function( err, taxi ) {

      taxi.stan = 'przypisany do kursu';
      taxi.save( function( error ) {
        console.log( taxi );
      } );
      /*
      TaxiStateModel.findOne( { stan: 'przypisany do kursu' } ).exec( function( err, stan ) {
        taxi.stan = stan;
        taxi.save( function( error ) {
          console.log( taxi );
        } );
      } );
      */
    } );

    return data;
  },

  create: function( req, res ) {
    var telefon = req.body.telefon != undefined ? req.body.telefon : '';
    var miasto = req.body.miasto != undefined ? req.body.miasto : '';
    var ulica = req.body.ulica != undefined ? req.body.ulica : '';
    var nr_budynku = req.body.nr_budynku != undefined ? req.body.nr_budynku : '';
    var osob = req.body.osob != undefined ? req.body.osob : 1;
    var typ_auta = req.body.typ_auta != undefined ? req.body.typ_auta : 'standardowe';

    console.log( req.body );

    ClientModel.create( { telefon: telefon } ).exec( function( err, client ) {
      console.log( 'New client added ' + client );
    } );

    var adres = {};
    AddressModel.create( { id: 0, miasto: miasto, ulica: ulica, nr_budynku: nr_budynku } ).exec( function( err, created_adres ) {
      console.log( 'Error Adres ' + err );
      adres = created_adres;

      var czas_zamowienia = new Date();
      var data = CourseModel.create( {
        id: 0,
        klient: telefon,
        adres_odbioru: adres.id,
        czas_zamowienia: czas_zamowienia,
        osob: osob,
        status_kursu: 'oczekuje',
        standard_auta: typ_auta,
        anulowane: false
      } ).exec( function( err, course ) {
        console.log( 'Error ' + err );
        console.log( 'New course added ' + course );
        res.send( course );
      } );
      return data;
    } );
  },

  update: function( req, res ) {
    var id = req.body.id != undefined ? req.body.id : 0;
    var haslo_anulowania = req.body.haslo_anulowania != undefined ? req.body.haslo_anulowania : 'admin';

    CourseModel.update( { id: id }, { haslo_anulowania: haslo_anulowania } ).exec(function( err, updated ) {
      res.send( updated );
    } );
  },

  cancel: function( req, res ) {
    var id = req.body.id != undefined ? req.body.id : 0;
    var haslo_anulowania = req.body.haslo_anulowania != undefined ? req.body.haslo_anulowania : 'admin';

    CourseModel.findOne( { id: id, haslo_anulowania: haslo_anulowania } ).exec( function( err, course ) {
      if( err ) {
        res.send( { error: 1 } );
      }
      if( course ) {
        if( course.taksowkarz ) {
          console.log( "taxi", course.taksowkarz );
          TaxiModel.update( { id: course.taksowkarz }, { stan: 'wolny' } );
        }
        CourseModel.update( { id: id }, { anulowane: true, taksowkarz: null } ).exec( function( err, updated ) {
          res.send( updated );
        } );
      }
    } );

  },

  updateTaxi: function( req, res ) {
    var id = req.body.id != undefined ? req.body.id : 0;
    var taksowkarz = req.body.taksowkarz != undefined ? req.body.taksowkarz : '';


    TaxiModel.update( { id: taksowkarz }, { stan: 'przypisany do kursu' } ).exec(function( err, updated ) {
    } );

    CourseModel.update( { id: id }, { taksowkarz: taksowkarz } ).exec(function( err, updated ) {
      res.send( updated );
    } );
  }

};
