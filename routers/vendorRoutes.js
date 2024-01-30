const router = require('express').Router();
const vendorController = require('../controllers/vendorController/signup')
const turfController=require('../controllers/vendorController/turfController')
const verifyToken=require('../middlewares/vendorVerifyToken')




router.post('/vendorMobile', vendorController.mobileExist) //
router.post('/vendorSignup', vendorController.vendorSignup) //
router.post('/signin', vendorController.signin);


router.get('/turfs',verifyToken,turfController.getTurfs) //
router.get('/sports',verifyToken,turfController.getSports)
router.get('/turf/:id',turfController.getTurf)
router.post('/turf/add',verifyToken,turfController.addTurf) 
router.put('/turf/block',verifyToken,turfController.changeBlock)
router.get('/bookings',verifyToken,turfController.getBooking)
router.get('/bookings/cancelled',verifyToken,turfController.getBookingsCancelled)

module.exports=router;