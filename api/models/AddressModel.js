/**
* ECModel.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'Adres',
  adapter: 'sails-mysql',
  migrate: 'alter',
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true,
      required: true,
      autoIncrement: true
    },

    miasto: {
      type: 'string',
      required: true,
      size: 30
    },

    ulica: {
      type: 'string',
      required: true,
      size: 30
    },

    nr_budynku: {
      type: 'string',
      required: true,
      size: 8
    }

  }
};
