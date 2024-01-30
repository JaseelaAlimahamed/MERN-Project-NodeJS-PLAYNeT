const router = require('express').Router();
const VMController = require('../controllers/adminController/VMController');
const adminController = require('../controllers/adminController/adminLogin');
const sportsController= require('../controllers/adminController/sportsController');
const userController = require('../controllers/adminController/userController');
const verifyToken = require('../middlewares/adminVerifyToken')

router.post('/signin', adminController.adminLogin); 

router.get('/sports',verifyToken, sportsController.getSports) //
router.post('/sports/add',verifyToken, sportsController.addSports) //
router.put('/sports/status',verifyToken, sportsController.changeStatus) //

router.get('/vendor',verifyToken, VMController.getVms) //
router.put('/vendor/blockStatus',verifyToken, VMController.blockVm) //
router.put('/vendor/status', verifyToken, VMController.changeStatus); //

router.get('/users', verifyToken, userController.getUsers) //
router.put('/users/blockStatus',verifyToken, userController.blockUser) //


module.exports=router;