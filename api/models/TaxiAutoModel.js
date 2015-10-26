/**
* ECModel.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'Auto',
  adapter: 'sails-mysql',
  migrate: 'alter',
  attributes: {

    tablica_rejestracyjna: {
      type: 'string',
      primaryKey: true,
      required: true,
      size: 8
    },

    marka: {
      type: 'string',
      required: true,
      size: 30
    },

    model: {
      type: 'string',
      required: true,
      size: 30
    },

    kolor: {
      type: 'string',
      size: 30
    },

    model: {
      type: 'integer',
      required: true
    },

    standard: {
      model: 'TaxiAutoStandardModel',
      required: true
    }

  }
};
