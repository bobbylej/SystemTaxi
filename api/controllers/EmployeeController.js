/**
 * EmployeeController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * Check the provided email address and password, and if they
   * match a real user in the database, sign in to Activity Overlord.
   */
  login: function (req, res) {
    console.log( 'login: ', req.param('login'), 'haslo: ', req.param('password') );
    // Try to look up user using the provided email address
    EmployeeModel.findOne({
      login: req.param('login')
    }, function foundUser(err, user) {
      if (err) return res.negotiate(err);
      if (!user) return res.notFound();

      console.log( 'haslo: ', user.haslo );
      // Compare password attempt from the form params to the encrypted password
      // from the database (`user.password`)
      require('machinepack-passwords').checkPassword({
        passwordAttempt: req.param('password'),
        encryptedPassword: user.haslo
      }).exec({

        error: function (err){
          console.log( 'error' );
          return res.negotiate(err);
        },

        // If the password from the form params doesn't checkout w/ the encrypted
        // password from the database...
        incorrect: function (){
          console.log( 'notFound' );
          return res.notFound();
        },

        success: function (){

          // Store user id in the user session
          req.session.me = user.login;

          // All done- let the client know that everything worked.
          return res.ok();
        }
      });
    });

  },

  /**
   * Sign up for a user account.
   */
  signup: function(req, res) {

    var Passwords = require('machinepack-passwords');

    // Encrypt a string using the BCrypt algorithm.
    Passwords.encryptPassword({
      password: req.param('haslo'),
      difficulty: 10,
    }).exec({
      // An unexpected error occurred.
      error: function(err) {
        return res.negotiate(err);
      },
      // OK.
      success: function(encryptedPassword) {
        // Create a User with the params sent from
        // the sign-up form --> signup.ejs
        EmployeeModel.create({
          login: req.param('login'),
          haslo: encryptedPassword,
          imie: req.param('imie'),
          nazwisko: req.param('nazwisko'),
          telefon: req.param('telefon'),
          pesel: req.param('pesel'),
          data_urodzenia: req.param('data_urodzenia'),
          miasto: req.param('miasto'),
          kod_pocztowy: req.param('kod_pocztowy'),
          ulica: req.param('ulica'),
          nr_budynku: req.param('nr_budynku'),
          nr_lokalu: req.param('nr_lokalu'),
        }, function userCreated(err, newUser) {
          if (err) {

            console.log("err: ", err);
            console.log("err.invalidAttributes: ", err.invalidAttributes);

            // If this is a uniqueness error about the email attribute,
            // send back an easily parseable status code.
            if (err.invalidAttributes && err.invalidAttributes.login && err.invalidAttributes.login[0]
              && err.invalidAttributes.login[0].rule === 'unique') {
              return res.loginInUse();
            }

            // Otherwise, send back something reasonable as our error response.
            return res.negotiate(err);
          }

          // Log user in
          req.session.me = newUser.login;

          // Send back the id of the new user
          return res.json({
            id: newUser.login
          });
        });
      }
    });
  },

  /**
   * Log out of Activity Overlord.
   * (wipes `me` from the sesion)
   */
  logout: function (req, res) {

    // Look up the user record from the database which is
    // referenced by the id in the user session (req.session.me)
    EmployeeModel.findOne(req.session.me, function foundUser(err, user) {
      if (err) return res.negotiate(err);

      // If session refers to a user who no longer exists, still allow logout.
      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists.');
        return res.backToHomePage();
      }

      // Wipe out the session (log out)
      req.session.me = null;

      // Either send a 200 OK or redirect to the home page
      return res.backToHomePage();

    });
  }
};
