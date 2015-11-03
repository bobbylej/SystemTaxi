/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  index: function( req, res ) {
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
  }
};
