const mongoose = require('mongoose')

const venueSchema = new mongoose.Schema({
    vendorId:{
        type:mongoose.Types.ObjectId,
        ref:'vendor'
    },
    venueName: String,
    mobile: Number,
    district: String,
    place:String,
    actualPrice: Number,
    discountPercentage: Number,
    description: String,
    image:String,
    document: String,
    slots: [{
        day:String,
        slots:[]
    }],
   
    sportFacility: [{
        sportId:{
            type:mongoose.Types.ObjectId,
            ref:'sports'
        },
        sport:String,
        facility:String
    }],
    lat: Number,
    lng: Number,
    isBlocked: {
        type: Boolean,
        default: false
    },
    vendorIsBlocked: {
        type: Boolean,
        default: false
    },
    approved: {
        type: Boolean,
        default: false
    }
},
{
    timestamps:{
        createdAt:'created_at',
        updatedAt:'updated_at'
    }
})

module.exports = mongoose.model('venue',venueSchema);
