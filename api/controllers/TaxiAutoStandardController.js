/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  getAll: function( req, res ) {
      var data = TaxiAutoStandardModel.find().exec( function( err, standars ) {

          res.send( standars );
          res.end();
      } );
      //return data;
  }
};
