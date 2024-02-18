const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController/signIn');
const venueController = require('../controllers/userController/venueController');
const bookingController = require('../controllers/userController/bookingController');
const verifyToken = require('../middlewares/userVerifyToken');

// signIn SignUp

router.get('/', (req,res)=>{
    res.render('home')
})//

router.post('/signup', userController.userSignup) //
router.post('/signin', userController.userSignin) //
router.post('/mobileExist', userController.mobileExist) //
router.put('/changeName',verifyToken,userController.setName)

router.post('/signin/google', userController.googleSignin) //


router.get('/newVenues', venueController.newVenues)//
router.get('/venue/:_id', venueController.getTurf) //
router.get('/districtVenues/:dist',venueController.getDistrictTurfs)


router.post('/bookedSlot', verifyToken, venueController.getBookedSlots) //
router.post('/book', verifyToken, bookingController.bookTurf) //
router.post('/verifyPayment', verifyToken, bookingController.verifyPayment) //
router.get('/bookings',verifyToken,bookingController.getBookings) //
router.get(`/booking/:bookingId/refund`,verifyToken,bookingController.refundToWallet)//

module.exports = router;