const mongoose = require('mongoose');
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { Schema } = mongoose;
const preScriptionSchema = new Schema({
  consultationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consultations",
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient", required: true
  },
  careAdvice: {
    type: String,
    required: true,
  },
  medicine: {
    type: String,
    required: true,
  },
  pdfUrl: {
    type: String
  },
  isSent: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });
const PreScription = mongoose.model("PreScription", preScriptionSchema);
module.exports = { PreScription };