const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Jio_Parkinglotschema = new mongoose.Schema({
  totalParkingSlot: { type: Number},
  reservedParkingCapacity: { type: Number},
  notReservedParkingCapacity: { type: Number},
  noOfCars_reservedParking: { type: Number},
  noOfCars_NotreservedParking: { type: Number},
  createdAt: { type: Date, default: Date.now},
  updatedDate: {type: Date, default: Date.now},
});

var Jio_Parkinglot = mongoose.model('Jio_Parkinglot', Jio_Parkinglotschema);
module.exports = Jio_Parkinglot;
