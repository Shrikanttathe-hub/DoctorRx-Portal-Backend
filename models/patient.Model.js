const mongoose = require("mongoose");
const { Schema } = mongoose;
const PatientSchema = new Schema(
  {
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
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    sergery: {
      type: String,
      required: true,
    },
    illness: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Patient",
    },
  },
  { timestamps: true },
);
const Patient = mongoose.model("Patient", PatientSchema);
module.exports = { Patient };
