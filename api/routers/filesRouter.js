const express = require('express')
const router = express.Router()
const filesController = require('../controllers/filesController')

router.get('/', filesController.getAllFiles)
router.post('/', filesController.addFiles)
router.put('/', filesController.updateFileName)
router.delete('/', filesController.deleteFile)
module.exports = router