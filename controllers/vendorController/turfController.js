const mongoose = require('mongoose')
const { ObjectId } = require('mongodb');
const sports = require('../../models/sportsModel')
const venue = require('../../models/venueModel');
const jwt = require('jsonwebtoken');
const vendor = require('../../models/vendorModel')
const bookings = require('../../models/bookingModel')

module.exports = {
  getSports: async (req, res) => {

    try {
      const response = await sports.aggregate([
        {
          $project: {
            sport: 1,
            facilityDetails: {
              $filter: {
                input: "$facilityDetails",
                as: "facility",
                cond: {
                  $eq: ["$$facility.status", true],
                },
              },
            },
          },
        },
        {
          $match: {
            $expr: {
              $gt: [{ $size: "$facilityDetails" }, 0],
            },
          },
        },
      ]);

      res.status(200).json({ response });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: 'An error occurred', err: error.message });
    }
  },


  addTurf: async (req, res) => {
    const decodedToken = jwt.verify(req.headers.authorization,process.env.JWT_SECRET);
    const { venueName, mobile, district, place, actualPrice, discountPercentage, description, image, document, slots, sportFacility, lat, lng } = req.body
    if (!venueName || !mobile || !district || !place || !actualPrice || !discountPercentage || !description || !image || !document || !slots || !sportFacility || !lat || !lng) return res.status(400).json({ message: 'venueName, mobile, district, place, actualPrice, discountPercentage, description, image, document, slots, sportFacility, lat, lng - fields required' })
    venue.create({ vendorId: decodedToken.id, ...req.body }).then(response => {
      res.status(200).json({ message: 'success' })
    }).catch(error => {
      console.log(error)
      res.status(400).json({ message: 'error occured' })
    })
  },


  getTurfs: async (req, res) => {
    try {
      const decodedToken = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

      console.log("reached backend ", decodedToken.id)
      const turfs = await venue.find({ vendorId: decodedToken.id });

      res.status(200).json(turfs);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'error occurred while getting Turfs' });
    }
  },
  getTurf: async (req, res) => {

    try {
      const id = req.params.id;
      console.log(id);
      const response = await venue.findOne({ _id: id });

      if (response) {
        res.status(200).json(response);
      } else {
        res.status(404).json({ message: 'Turf not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  ,

  changeBlock: async (req, res) => {
    const { id } = req.body;
    await venue.updateOne({ _id: id }, [{ "$set": { "vendorIsBlocked": { "$eq": [false, "$vendorIsBlocked"] } } }]).then(response => {
      res.sendStatus(200)
    }).catch(err => {
      console.log(err.message);
      res.status(400).json({ message: 'error occured' })
    })
  },



  getBooking: async (req, res) => {

    try {

      const data = await bookings.find({ refund: 'not processed' })
      .populate('userId') // Populate the 'userId' field with User documents
      .populate({
        path: 'turfId',
        match: { vendorId: new ObjectId(req._id) } // Match the 'vendorId' field in Turf collection with req._id
      }); // Populate the 'turfId' field with Turf documents
    
      console.log("data",data);

      res.status(200).json(data)
    
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: 'error occured', error: error.message })
    }
  },
  
  getBookingsCancelled: async (req, res) => {

    try {

      const data = await bookings.find({ refund: 'processed' })
      .populate('userId') // Populate the 'userId' field with User documents
      .populate({
        path: 'turfId',
        match: { vendorId: new ObjectId(req._id) } // Match the 'vendorId' field in Turf collection with req._id
      }); // Populate the 'turfId' field with Turf documents
    
      console.log("data",data);

      res.status(200).json(data)
    
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: 'error occured', error: error.message })
    }
  },



}
