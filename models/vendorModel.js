const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    password: String,
    image: String,
    status: {
        type: String,
        enum: ["approved", "pending", "rejected"],
        default: "pending"
    },
    reason: {
        type: String,
        default:''
    },
    blockStatus: {
        type: Boolean,
        default: false
    },
    rejectUpdate:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('vendor', VendorSchema);