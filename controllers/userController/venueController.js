const mongoose = require('mongoose')
const sports = require('../../models/sportsModel')
const venue = require('../../models/venueModel');
const jwt = require('jsonwebtoken');
const bookings = require('../../models/bookingModel')



module.exports = {
    newVenues: async (req, res) => {
        try {
            const data = await venue.find();
            console.log(data);
            const lastFourObjects = data.slice(-4);
            console.log(lastFourObjects); // Extract the last four objects
            res.status(200).json(lastFourObjects);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    getTurf: async (req, res) => {
        try {
            const { _id } = req.params;
            const response = await venue.findOne({ _id });
            res.status(200).json(response);
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: 'error occurred' });
        }
    },
    getDistrictTurfs: async (req, res) => {

        try {
            const { dist } = req.params;
            const response = await venue.find({ district: dist });
            res.status(200).json(response);
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: 'error occurred' });
        }
    },
    
    getBookedSlots: async (req, res) => {
        try {
            const id = req.body.turfId
            const date = req.body.date

            if (!req.body.turfId || !req.body.date) res.status(400).json({ message: 'turfId, slotDate - fields required' })
            const response = await bookings.find({ turfId: id, refund: 'not processed' }, { slotTime: 1, _id: 0 })

            res.status(200).json(response)
        } catch (error) {
            console.log(error)
        }
    },


}