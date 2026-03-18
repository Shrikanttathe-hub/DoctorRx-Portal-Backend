const mongoose = require('mongoose');
const { Schema } = mongoose;
const DoctorSchema = new Schema({
    profileImage: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: true
    },
    yearsOfExp: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "Doctor"
    }
}, { timestamps: true });
const Doctor = mongoose.model("Doctor", DoctorSchema);
module.exports = { Doctor };