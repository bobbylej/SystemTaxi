/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  index: function(req, res) {
      var data = CourseModel.find().exec( function(err, courses) {
          /*
          res.view( {
              apps: courses
          } );
          */
          //res.view( 'json' );

          //res.writeHead(res.statusCode);
          res.send( courses );
          res.end();
      } );
      return data;
  }
};
