const Router = require('express')
const router = new Router()
const controller = require('./FileController')
const AuthManager = require('../authentification/AuthManager');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', controller.getFile)
router.post('/', upload.single('file'), controller.postFile)
router.delete('/', controller.deleteFile)

router.get(
    '/profile',
    AuthManager.authMiddleware,
    controller.getProfileFile
)

router.post(
    '/profile',
    AuthManager.authMiddleware,
    upload.single('file'),
    controller.postProfileFile
)

module.exports = router