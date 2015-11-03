/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  index: function( req, res ) {

      var standard = req.query.standard != undefined ? req.query.standard : '';
      var osob = req.query.osob != undefined ? req.query.osob : 0;

      var data = TaxiModel.find( { stan: 'wolny' } )
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


          res.send( taxi );
          res.end();
      } );
      //return data;
  }
};
