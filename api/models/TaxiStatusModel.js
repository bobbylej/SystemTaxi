/**
* ECModel.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'StatusTaksowki',
  adapter: 'sails-mysql',
  migrate: 'alter',
  attributes: {

    status: {
      type: 'string',
      primaryKey: true,
      required: true,
      size: 30
    }

  }
};
