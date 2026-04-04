const express = require('express');
const router = express.Router();
const EnvironmentController = require('./EnvironmentDataController');

router.post('/', EnvironmentController.create);

router.get('/user/:userId', EnvironmentController.getByUser);

router.get('/', EnvironmentController.getByLocation);

module.exports = router;