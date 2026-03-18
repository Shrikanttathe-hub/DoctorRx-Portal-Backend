const mongoose = require('mongoose');
const { Schema } = mongoose;
const consultationSchema = new Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  patientName: {
    type: String,
    required: true,
  },
  illness: {
    type: String,
    required: true
  },
  surgery: {
    type: String
  },
  diabeticStatus: {
    type: String,
    enum: ["Diabetic", "Non-Diabetic"]
  },
  allergy: {
    type: String
  },
  others: {
    type: String
  },
  transactionId: {
    type: String,
    required: true
  },
  consent: {
    type: Boolean,
    required: true
  },
  isSent: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });
const Consultations = mongoose.model("Consultations", consultationSchema);
module.exports = { Consultations };