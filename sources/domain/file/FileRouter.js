const Router = require('express')
const router = new Router()
const controller = require('./FileController')

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', controller.getFile)
router.post('/', upload.single('file'), controller.postFile)
router.delete('/', controller.deleteFile)

module.exports = router