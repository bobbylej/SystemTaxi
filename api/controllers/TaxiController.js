/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  getAll: function( req, res ) {
      var strona = req.query.strona != undefined ? req.query.strona : 1;
      var limit = req.query.limit != undefined ? req.query.limit : 15;
      var pomin = ( strona - 1 ) * limit;

      var id = req.query.id != undefined ? req.query.id : '';
      var imie_nazwisko = req.query.imie_nazwisko != undefined ? req.query.imie_nazwisko : '';
      var stan = req.query.stan != undefined ? req.query.stan : '';
      var status = req.query.status != undefined ? req.query.status : '';
      var standard = req.query.standard != undefined ? req.query.standard : '';
      var osob = req.query.osob != undefined ? req.query.osob : 0;

      var data = TaxiModel.find( {
        where: {
          id: { 'contains': id },
          stan: { 'contains': stan },
          status: { 'contains': status }
        }, skip: pomin, limit: limit } )
        .populate('auto').exec( function( err, taxi ) {

          taxi = taxi.filter( function( elem ) {
            if( imie_nazwisko != '' ) {
              if( elem.imie || elem.nazwisko ) {
                var elem_imie_nazwisko = elem.imie + elem.nazwisko;
                if( elem_imie_nazwisko.indexOf( imie_nazwisko ) == -1 ) {
                  return false;
                }
              }
              else {
                return false;
              }
            }
            if( standard != '' ) {
              if( elem.auto.standard ) {
                if( elem.auto.standard.indexOf( standard ) == -1 ) {
                  return false;
                }
              }
              else {
                return false;
              }
            }
            if( osob != '' ) {
              if( elem.auto.osob ) {
                if( parseInt(elem.auto.osob) < parseInt(osob) ) {
                  return false;
                }
              }
              else {
                return false;
              }
            }
            return true;
          } );


          res.send( taxi );
          res.end();
      } );
      //return data;
  },

  getAllInWork: function( req, res ) {
      var strona = req.query.strona != undefined ? req.query.strona : 1;
      var limit = req.query.limit != undefined ? req.query.limit : 15;
      var pomin = ( strona - 1 ) * limit;

      var id = req.query.id != undefined ? req.query.id : '';
      var imie_nazwisko = req.query.imie_nazwisko != undefined ? req.query.imie_nazwisko : '';
      var stan = req.query.stan != undefined ? req.query.stan : '';
      var status = req.query.status != undefined ? req.query.status : '';
      var standard = req.query.standard != undefined ? req.query.standard : '';
      var osob = req.query.osob != undefined ? req.query.osob : 0;

      var data = TaxiModel.find( {
        where: {
          id: { 'contains': id },
          stan: { '!': 'poza pracą' },
          status: { 'contains': status }
        }, skip: pomin, limit: limit } )
        .populate('auto').exec( function( err, taxi ) {

          taxi = taxi.filter( function( elem ) {
            if( imie_nazwisko != '' ) {
              if( elem.imie || elem.nazwisko ) {
                var elem_imie_nazwisko = elem.imie + elem.nazwisko;
                if( elem_imie_nazwisko.indexOf( imie_nazwisko ) == -1 ) {
                  return false;
                }
              }
              else {
                return false;
              }
            }
            if( stan != '' ) {
              if( elem.stan ) {
                if( elem.stan.indexOf( stan ) == -1 ) {
                  return false;
                }
              }
              else {
                return false;
              }
            }
            if( standard != '' ) {
              if( elem.auto.standard ) {
                if( elem.auto.standard.indexOf( standard ) == -1 ) {
                  return false;
                }
              }
              else {
                return false;
              }
            }
            if( osob != '' ) {
              if( elem.auto.osob ) {
                if( parseInt(elem.auto.osob) < parseInt(osob) ) {
                  return false;
                }
              }
              else {
                return false;
              }
            }
            return true;
          } );

          for( var i = 0; i < taxi.length; i++ ) {
            taxi[i].imie_nazwisko = taxi[i].imie + ' ' + taxi[i].nazwisko;
          }


          res.send( taxi );
          res.end();
      } );
      //return data;
  },

  getFree: function( req, res ) {

      var standard = req.query.standard != undefined ? req.query.standard : '';
      var osob = req.query.osob != undefined ? req.query.osob : 0;

      CourseModel.find( { status_kursu: 'oczekuje' } ).exec( function( err, coursesModified ) {
        var taxiNotFree = [];
        coursesModified = coursesModified.filter( function( course ) {
          if( course.zmieniajacy && course.zmieniajacy != '' ) {
            taxiNotFree.push( course.taksowkarz );
            return true;
          }
          return false;
        } );


        var data = TaxiModel.find( { or: [ { stan: 'wolny'}, { stan: 'przypisany do kursu' } ] } )
          .populate('auto').exec( function( err, taxi ) {

            taxi = taxi.filter( function( elem ) {
              if( standard != '' ) {
                if( elem.auto.standard ) {
                  if( elem.auto.standard.indexOf( standard ) == -1 ) {
                    return false;
                  }
                }
                else {
                  return false;
                }
              }
              if( osob != '' ) {
                if( elem.auto.osob ) {
                  if( parseInt(elem.auto.osob) < parseInt(osob) ) {
                    return false;
                  }
                }
                else {
                  return false;
                }
              }
              return true;
            } );

            taxi = taxi.filter( function( elem ) {
              if( taxiNotFree.indexOf( elem.id ) != -1 ) {
                return false;
              }
              return true;
            } );

            res.send( taxi );
            res.end();
        } );
        //return data;

      } );
  },

  getLocation: function( req, res ) {

      var id = req.query.id != undefined ? req.query.id : '';

      var data = TaxiLocation.findOne( { id: id } ).exec( function( err, location ) {
          if( err ) {
            res.send( {
              "lat": 51.1086,
              "lng": 17.0271
            } );
            res.end();
          }
          res.send( location );
          res.end();
      } );
      //return data;
  },

  getTaxiProfit( req, res ) {

      var id = req.query.id != undefined ? req.query.id : '';

      var now = new Date();
      var nowYear = now.getFullYear();
      var nowMonth = now.getMonth();
      var beginDate = new Date( nowYear, nowMonth, 1 );

      var data = CourseModel.find( { where: { taksowkarz: { 'like': id }, czas_zamowienia: { '>=': beginDate } } } ).exec( function( err, courses ) {
        var profit = 0;
        for( var i in courses ) {
          var course = courses[ i ];
          var czas_do_dostarczenia = course.czas_dostarczenia && course.czas_odbioru ? Math.abs( course.czas_dostarczenia - course.czas_odbioru ) : '';
          var koszt = czas_do_dostarczenia != '' ? ( czas_do_dostarczenia / 60000 ) * 0.5 : 0;

          profit += koszt;
        }
        console.log(profit);

        res.send( { profit: profit } );
        res.end();
      } );

  }
};
