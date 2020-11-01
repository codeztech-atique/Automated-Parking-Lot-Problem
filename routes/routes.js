const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());

app.use(cors());

// Authentication of user
const authentication = require('../authentication/auth');

// Middleware
const middleware = require('../middleware/validatingApi');

// Controller
const controllers = require('../controllers/parkingLotPrblmCtrl');

// Sample API testing
app.get('/', (req, res) => {
  res.send({
     status:200,
     message:'App is working fine!'
  });
});

// Get all the details from JioParkingSlot Table 
app.post('/web/jio/totalparkingslot', [middleware.validateAPI], (req, res, next) => {
  controllers.getAllInformation(req, res);
});

// Update totalParkingSlot in JioParkingSlot Table 
app.post('/web/jio/totalparkingslot/update', [middleware.updateTotalParkingSlotValidateApI], (req, res, next) => {
  controllers.updateTotalParkingSlot(req, res);
});

// Calculated and Automated Reserved and NonReserved based on first come first serve basis
app.post('/web/jio/totalparkingslot/calculate', [middleware.validateCalculation], (req, res, next) => {
  controllers.parkingLotPrblm(req, res);
});

module.exports = app;