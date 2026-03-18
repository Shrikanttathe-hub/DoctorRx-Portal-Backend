const express = require('express');
const { Patient } = require('../models/patient.Model');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = "12357125376@#$@#14523465ekdfiq6787&*!@*^*&#^@$!##";
router.post('/sign-up', async (req, res) => {
    try {
        const { profileImage, firstName, lastName, age, email, phoneNumber, sergery, illness, password } = req.body;
        if (!profileImage || !firstName || !lastName || !age || !email || !phoneNumber || !sergery || !illness || !password) return res.status(400).json({ status: false, message: "All fields are compulsory" });
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) return res.status(400).json({ status: false, message: "Email already registred" });
        const existingPatientPhoneNumber = await Patient.findOne({ phoneNumber });
        if (existingPatientPhoneNumber) return res.status(400).json({ status: false, message: "Phone Number already registred" });
        const hashPassword = await bcrypt.hash(password, 10);
        const newPatient = new Patient({ profileImage, firstName, lastName, age, email, phoneNumber, sergery, illness, password: hashPassword });
        await newPatient.save();
        const token = jwt.sign({ id: newPatient._id, email: newPatient.email }, secretKey, { expiresIn: "1h" });
        return res.status(201).json({ status: true, message: "Sign-Up Successful", token, newPatient, role: Patient });
    }
    catch (error) {
        console.log(error, "Error Found");
        res.status(400).json({ status: false, message: "Something went wrong !", error: error.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ status: false, message: "All fields are compulsary" });
        const patient = await Patient.findOne({ email });
        if (!patient || !(await bcrypt.compare(password, patient.password))) return res.status(400).json({ status: false, message: "Invalid credentials..." });
        const token = jwt.sign({ id: patient._id, email: patient.email }, secretKey, { expiresIn: "1h" });
        res.status(201).json({ status: true, message: "Login successful", token: token, role: Patient });
    }
    catch (error) {
        res.status(400).json({ status: false, message: "something went wrong !", error: error.message });
    }
})
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ status: false, message: "Access Denied" });
        jwt.verify(token, secretKey, async (err, decode) => {
            const patient = await Patient.findById(decode?.id);
            if (!patient) return res.status(400).json({ status: false, message: "Invalid Token" });
            const patientData = {
                id: patient?._id,
                name: patient?.firstName + " " + patient?.lastName,
                phoneNumber: patient?.phoneNumber,
                role: patient?.role,
                created: patient?.createdAt,
                email: patient?.email
            }
            res.status(200).json({ status: true, message: "profile data", data: patientData });
        })
    }
    catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong", error: error.message });
    }
})
module.exports = router;