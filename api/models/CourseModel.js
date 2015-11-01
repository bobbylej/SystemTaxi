/**
* ECModel.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'Kursy',
  adapter: 'sails-mysql',
  migrate: 'alter',
  schema: true,
  attributes: {

    id: {
      type: 'integer',
      primaryKey: true,
      required: true,
      autoIncrement: true
    },

    taksowkarz: {
      model: 'TaxiModel',
      required: true
    },

    klient: {
      model: 'ClientModel',
      required: true
    },

    osob: {
      type: 'integer',
      required: true,
      size: 3
    },

    czas_zamowienia: {
      type: 'datetime',
      required: true
    },

    czas_odbioru: {
      type: 'datetime'
    },

    czas_dostarczenia: {
      type: 'datetime'
    },

    anulowane: {
      type: 'boolean'
    },

    zmieniajacy: {
      model: 'EmployeeModel'
    },

    adres_odbioru: {
      model: 'AddressModel',
      required: true
    },

    adres_dostraczenia: {
      model: 'AddressModel',
      required: true
    },

    status_kursu: {
      model: 'CoursesStatusModel',
      required: true
    },
  }
};
