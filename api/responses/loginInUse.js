/**
 * Usage:
 *
 * ```
 * res.loginInUse();
 * ```
 *
 */

module.exports = function loginInUse (){

  // Get access to `res`
  // (since the arguments are up to us)
  var res = this.res;

  return res.send(409, 'Login is already taken by another user.');
};
