const mongoose = require('mongoose');
const chalk = require('chalk');
require('../models/parkinglot');
const Jio_Parkinglot = mongoose.model('Jio_Parkinglot');

// Parking Lot Create | Update

exports.parkingLotPrblm = (req, res, next) => {
  console.log(chalk.bgYellowBright("---------------- Parking Lot Information Submitted ----------------"));
  console.log(req.body);
  Jio_Parkinglot.findOne({'uniqueId': req.body.uniqueId}, async( err, parkinglot) => {
      if (parkinglot!==null) {
        var errMsg = ''; //Queue Full
        // Calulation For Car Enter's in Reserve Parking here
        if(req.body.noOfCars_EnterIn_ReservedParking > parkinglot.reservedParkingCapacity && req.body.noOfCars_EnterIn_NonReservedParking > parkinglot.notReservedParkingCapacity) {
           errMsg += 'Invalid! No of Car Enters in Reserve parking & NonReserveParking > ReservedParking & NonReservedParking Capacity, ';
        } else if(req.body.noOfCars_EnterIn_ReservedParking > parkinglot.reservedParkingCapacity) {
          errMsg += 'Invalid! No of Car Enters in Reserve parking > ReservedParking Capacity, '
        } else if(req.body.noOfCars_EnterIn_NonReservedParking > parkinglot.notReservedParkingCapacity){
          errMsg += 'Invalid! No of Car Enters in NonReserveParking > NonReservedParking Capacity, '
        }

        // Calulation For Car Exit's from NonReserve Parking here
        if(req.body.noOfCars_removedFrom_ReservedParking > parkinglot.noOfCars_reservedParking && req.body.noOfCars_removedFrom_NonReservedParking > parkinglot.noOfCars_NotreservedParking) {
          errMsg += 'Invalid! No of Car Removes in Reserve parking & NonReserveParking > ReservedParking & NonReservedParking Capacity, ';
        } else if(req.body.noOfCars_removedFrom_ReservedParking > parkinglot.noOfCars_reservedParking) {
          errMsg += 'Invalid! No of Car Removes in Reserve parking > ReservedParking Capacity, '
        } else if(req.body.noOfCars_removedFrom_NonReservedParking > parkinglot.noOfCars_NotreservedParking){
          errMsg += 'Invalid! No of Car Removes in NonReserveParking > NonReservedParking Capacity, '
        }
       
        if(errMsg!=='') {
          res.status(400).send({
            status: 400,
            message: errMsg + ' Sorry, queue full'
          })
        } else {

          // Calulation here Car Enters in Reserve parking
          parkinglot.reservedParkingCapacity = parkinglot.reservedParkingCapacity - req.body.noOfCars_EnterIn_ReservedParking;
          parkinglot.noOfCars_reservedParking = parkinglot.noOfCars_reservedParking + req.body.noOfCars_EnterIn_ReservedParking;

          // Calulation here Car Exits in Reserve parking
          parkinglot.reservedParkingCapacity = parkinglot.reservedParkingCapacity + req.body.noOfCars_removedFrom_ReservedParking;
          parkinglot.noOfCars_reservedParking = parkinglot.noOfCars_reservedParking - req.body.noOfCars_removedFrom_ReservedParking;
          
          
          // Calulation here Car Enters in Non Reserve parking
          parkinglot.notReservedParkingCapacity = parkinglot.notReservedParkingCapacity - req.body.noOfCars_EnterIn_NonReservedParking;
          parkinglot.noOfCars_NotreservedParking = parkinglot.noOfCars_NotreservedParking + req.body.noOfCars_EnterIn_NonReservedParking;

          
          // Calulation here Car Exits in Non Reserve parking
          parkinglot.notReservedParkingCapacity = parkinglot.notReservedParkingCapacity + req.body.noOfCars_removedFrom_NonReservedParking;
          parkinglot.noOfCars_NotreservedParking = parkinglot.noOfCars_NotreservedParking - req.body.noOfCars_removedFrom_NonReservedParking;
          
          parkinglot.updatedDate = new Date();
          
          console.log(parkinglot);
          
          var parkingLotInformation = new Jio_Parkinglot(parkinglot);

          parkingLotInformation.save().then(parkingLot => {
            res.send({
              message: 'Parking lot Information Updated !!',
              status: 200,
              data: parkingLot
            })
          }).catch(err => {
            res.status(400).send({
              message: 'Update Failed !!',
              status: 400,
              err: err
            });
          });
        }
      } else if(!err && parkinglot===null) { //Its a new record
        console.log(chalk.red("ParkingLot Information - No Record Found with the respective id!!"));
        res.status(400).send({
            message: 'Unique Id does not match with the database, please use the jio_tesseract_prkinglot unique id !!',
            status: 400
        });
      } else {
        res.status(404).send({
          status: 404,
          message: 'Error, Not able to update Parking lot Information data!!'
        })
      }
  });
};


exports.updateTotalParkingSlot = (req, res, next) => {
  console.log(chalk.bgYellowBright("---------------- Update Total Parking Lot Information ----------------"));
  console.log(req.body);
  Jio_Parkinglot.findOne({'uniqueId': req.body.uniqueId}, async( err, parkinglot) => {
      if (parkinglot!==null) {
        parkinglot.reservedParkingCapacity = (req.body.totalParkingSlot/100)*20; // 20% for reserved parking
        parkinglot.notReservedParkingCapacity = (req.body.totalParkingSlot/100)*80; // 80% for not-reserved parking
        parkinglot.noOfCars_reservedParking =  0;
        parkinglot.noOfCars_NotreservedParking = 0;

        parkinglot.totalParkingSlot = req.body.totalParkingSlot;
        console.log(parkinglot);
        var parkingLotInformation = new Jio_Parkinglot(parkinglot);
        parkingLotInformation.save().then(parkingLot => {
          res.send({
            message: 'Parking lot Information Updated !!',
            status: 200,
            data: parkingLot
          })
        }).catch(err => {
          res.status(400).send({
            message: 'Parking lot Information, Update Failed !!',
            status: 400,
            err: err
          });
        });
      } else {
        res.status(404).send({
          status: 404,
          message: 'Update failed! Unique Id does not match with the database, please use the jio_tesseract_prkinglot unique id !!'
        })
      }
  })
};

exports.getAllInformation = (req, res, next) => {
  console.log(chalk.bgYellowBright("---------------- Get All Total Parking Lot Information ----------------"));
  console.log();
  Jio_Parkinglot.findOne({'uniqueId': req.body.uniqueId}, async( err, parkinglot) => {
    if (parkinglot!==null) {
      res.send({
        status: 200,
        message: 'Success !!',
        data: parkinglot
      });
    } else {
      res.send({
        status: 200,
        message: 'No Parkinglot information Found with the repective id, please use jio_tesseract_prkinglot !!'
      });
    }
  }) 
};