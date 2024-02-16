const venues = require('../../models/venueModel')
const bookings = require('../../models/bookingModel')
const users = require('../../models/userModel')
const Razorpay = require('razorpay')
const crypto = require('crypto')
const { log } = require('console')
const jwt = require('jsonwebtoken');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEYID,
    key_secret: process.env.RAZORPAY_SECRET
});

function isSlotTimePassed(bookedDate, bookedTime) {
    const bookingDate = new Date(`${bookedDate} ${bookedTime.substring(0, 5)}`);
    const now = new Date();
    const eightHoursAdd = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    // Check if the booking time is in the future and is less than 8 hours away
    if (bookingDate < eightHoursAdd) return true;
    return false;
}

module.exports = {
    bookTurf: async (req, res) => {
        try {
            const authHeader = req.header('Authorization');
            const verified = jwt.verify(authHeader, process.env.JWT_SECRET);
            console.log(verified.id);
            if (!req.body.turf || !req.body.method) return res.status(400).json({ message: "turf,method - id,( 'online' || 'wallet' ) field is required" })
            const { turf, slotTime, slotDate, sport, facility, method } = req.body
            const response = await venues.findOne({ _id: turf })
            let rs = response.actualPrice - (response.actualPrice * response.discountPercentage / 100)
            if (method === 'wallet') {
                if (!slotTime || !slotDate || !sport || !facility) return res.status(400).json({ message: 'slotTime, slotDate, sport, facility - datas needed to make a wallet include booking' })
                let user = await users.findOne({ _id: verified.id })
                if (user.wallet >= rs) {
                    await bookings.create({ userId: verified.id, turfId: turf, slotTime, slotDate, price: rs, sport, facility })
                    user.wallet = user.wallet - rs
                    let newData = await user.save()
                    return res.status(201).json({ message: 'booking successfully using fully wallet amount', wallet: newData.wallet })
                }
                rs = rs - user.wallet;
            }
            const options = {
                amount: rs * 100,
                currency: "INR",
                receipt: crypto.randomBytes(10).toString('hex')
            }
            instance.orders.create(options, (error, order) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'something went wrong', error: error.messaage });
                }
                console.log(order);
                res.status(200).json({order});
            })
        } catch (error) {
            console.log(error.message);
            res.status(400).json({ message: 'error occured', error: error.message });
        }
    },

    verifyPayment: async (req, res) => {
        try {
            const authHeader = req.header('Authorization');
            const verified = jwt.verify(authHeader, process.env.JWT_SECRET);
           
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, turfId, slotTime, slotDate, price, sport, facility } = req.body;
            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !turfId || !slotTime || !slotDate || !price || !sport || !facility) return res.status(400).json({ messaage: 'razorpay_order_id, razorpay_payment_id, razorpay_signature, turfId, slotTime, slotDate, price, sport, facility - fields required' })
            
            const sign = razorpay_order_id + "|" + razorpay_payment_id

            const expectedSign = crypto.createHmac('sha256',process.env.RAZORPAY_SECRET).update(sign.toString()).digest('hex')
            if (razorpay_signature === expectedSign) {
                const turf = await venues.findById(turfId)
                const setPrice = turf.actualPrice - (turf.actualPrice * turf.discountPercentage / 100);

                let user = await users.findOne({_id:verified.id})
                
                if(price/100 < setPrice){
                    const amountToBeReduce = setPrice - (price/100)
                    user = await users.findOneAndUpdate({ _id: verified.id }, { $inc: { wallet: -amountToBeReduce } }, { new: true })
                }
                await bookings.create({ orderId: razorpay_order_id, userId: verified.id, turfId, slotTime, slotDate, price: setPrice, sport, facility })
                return res.status(200).json({ message: 'payment verified succesfully', wallet:user.wallet })
            }
            return res.status(400).json({ message: 'Invalid signature sent!' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'internal server error',error:error.message })
        }
    },

    getBookings: async (req, res) => {
        try {
          const response = await bookings.find({ userId: req._id }).populate('turfId');
          const reversedResponse = response.reverse();
          res.status(200).json(reversedResponse);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error' });
        }
      },
      
      refundToWallet: async (req, res) => {
        const { bookingId } = req.params;
        try {
            const booking = await bookings.findOne({ _id: bookingId });
            if (booking.refund === 'processed') return res.status(400).json({ message: 'refund already processed for this order' })
            if (isSlotTimePassed(booking.slotDate, booking.slotTime)) return res.status(400).json({ message: 'Time for cancellation expired' });
            let updatedUser = await users.findOneAndUpdate({ _id: req._id }, { $inc: { wallet: booking.price } }, { new: true })
            booking.refund = 'processed';
            await booking.save();
            return res.status(200).json({ message: 'refund processed to users wallet', wallet: updatedUser.wallet })
        } catch (error) {
            console.log(error.message)
            res.status(400).json({ message: error.message })
        }
    }

   
}