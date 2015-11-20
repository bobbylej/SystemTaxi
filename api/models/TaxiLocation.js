/**
* Model.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'TaxiLocation',
  adapter: 'sails-mysql',
  migrate: 'alter',
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true,
      required: true
    },

    lat: {
      type: 'float',
      required: true
    },

    lng: {
      type: 'float',
      required: true
    }

  }
};
