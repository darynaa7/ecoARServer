const express = require('express');
const router = express.Router();
const EnvironmentController = require('./EnvironmentDataController');
const {fetchByLocation} = require("./EnvironmentDataController");
const AuthManager = require('../authentification/AuthManager');


router.post('/fetch', EnvironmentController.fetchByLocation);

router.post(
    '/user/fetch',
    AuthManager.authMiddleware,
    EnvironmentController.fetchAndSaveForUser
);

router.get(
    '/user/history',
    AuthManager.authMiddleware,
    EnvironmentController.getUserHistory
);

module.exports = router;