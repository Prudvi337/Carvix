const express = require('express');
const { customizeVehicle } = require('../controllers/customizationController');

const router = express.Router();

router.post('/customize', customizeVehicle);

module.exports = router;
