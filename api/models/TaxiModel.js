/**
* TaxiModel.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'Taksowkarz',
  adapter: 'sails-mysql',
  migrate: 'alter',
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true,
      required: true,
      autoIncrement: true
    },

    // The encrypted password for the user
    // e.g. asdgh8a249321e9dhgaslcbqn2913051#T(@GHASDGA
    haslo: {
      type: 'string',
      required: true
    },

    imie: {
      type: 'string',
      required: true,
      size: 50
    },

    nazwisko: {
      type: 'string',
      required: true,
      size: 50
    },

    telefon: {
      type: 'integer',
      required: true,
      size: 9
    },

    pesel: {
      type: 'integer',
      required: true,
      size: 11
    },

    data_urodzenia: {
      type: 'date',
      required: true
    },

    miasto: {
      type: 'string',
      required: true,
      size: 30
    },

    kod_pocztowy: {
      type: 'integer',
      required: true,
      size: 5
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
    },

    nr_lokalu: {
      type: 'string',
      size: 8
    },

    status: {
      model: 'TaxiStatusModel'
    },

    stan: {
      model: 'TaxiStateModel'
    },

    nr_konta_bankowego: {
      type: 'integer',
      size: 26
    }
  }
};
