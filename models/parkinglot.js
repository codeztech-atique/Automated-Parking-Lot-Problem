const mongoose = require('mongoose');

var parkinglot = new mongoose.Schema({
  totalParkingSlot: { type: Number},
  reservedParkingCapacity: { type: Number},
  notReservedParkingCapacity: { type: Number},
  noOfCars_reservedParking: { type: Number},
  noOfCars_NotreservedParking: { type: Number},
  createdAt: { type: Date, default: Date.now},
  updatedDate: {type: Date, default: Date.now},
});

var parkinglot = mongoose.model('parkinglot', parkinglot);
module.exports = parkinglot;
