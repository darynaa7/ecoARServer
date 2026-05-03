const express = require('express');
const router = express.Router();
const EnvironmentController = require('./EnvironmentDataController');
const {fetchByLocation} = require("./EnvironmentDataController");
const AuthManager = require('../authentification/AuthManager');


router.post('/fetch', EnvironmentController.fetchByLocation);

router.post(
    '/user/save',
    AuthManager.authMiddleware,
    EnvironmentController.SaveForUser
);

router.get(
    '/user/history',
    AuthManager.authMiddleware,
    EnvironmentController.getUserHistory
);

module.exports = router;