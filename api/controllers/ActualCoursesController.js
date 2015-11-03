/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  index: function( req, res ) {
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
            { status_kursu: 'oczekuje na realizacje' }
          ],
          id: { 'contains': id },
          taksowkarz: { 'contains': taksowkarz },
          klient: { 'contains': klient },
          osob: { '>=': osob_od },
          osob: { '<=': osob_do },
          anulowane: { 'contains': anulowane }
        }, skip: pomin, limit: limit, sort: 'status_kursu ASC' } )
        .populate('adres_odbioru').populate('adres_dostraczenia').populate('zmieniajacy').exec( function( err, courses ) {


          courses = courses.filter( function( elem ) {
            if( zmieniajacy != '' ) {
              if( elem.zmieniajacy ) {
                var zmieniajacy_nazwa = elem.zmieniajacy.login + ': ' + elem.zmieniajacy.imie + elem.zmieniajacy.nazwisko;
                if( zmieniajacy_nazwa.indexOf( zmieniajacy ) != -1 ) {
                  return true;
                }
              }
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
  }
};
