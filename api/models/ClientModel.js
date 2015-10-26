/**
* ECModel.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'Klient',
  adapter: 'sails-mysql',
  migrate: 'alter',
  attributes: {

    telefon: {
      type: 'integer',
      primaryKey: true,
      required: true,
      size: 9
    }

  }
};
