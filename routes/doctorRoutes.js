const express = require('express');
const { Doctor } = require('../models/doctor.model');
const { Consultations } = require('../models/consultation.model');
const { PreScription } = require('../models/prescription.model');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const secretKey = "12357125376@#$@#14523465ekdfiq6787&*!@*^*&#^@$!##";

const generatePDF = (prescription) => {
    const dir = path.join(__dirname, "../prescriptions");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    const pdfPath = path.join(dir, `${prescription._id}.pdf`);
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(20).text("Doctor Prescription", { align: "center" });
    doc.moveDown();
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    doc.text(`Care Advice: ${prescription.careAdvice}`);
    doc.moveDown();
    doc.text(`Medicine: ${prescription.medicine}`);
    doc.end();
    return `/prescriptions/${prescription._id}.pdf`;
};
router.post('/sign-up', async (req, res) => {
    try {
        const { profileImage, firstName, lastName, specialty, email, phoneNumber, yearsOfExp, password } = req.body;
        if (!profileImage || !firstName || !lastName || !specialty || !email || !phoneNumber || !yearsOfExp || !password) return res.status(400).json({ status: false, message: "All fields are compulsory" });
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) return res.status(400).json({ status: false, message: "Email already registred" });
        const existingDoctorPhone = await Doctor.findOne({ phoneNumber });
        if (existingDoctorPhone) return res.status(400).json({ status: false, message: "Phone Number already registred" });
        const hashPassword = await bcrypt.hash(password, 10);
        const newDoctor = new Doctor({ profileImage, firstName, lastName, specialty, email, phoneNumber, yearsOfExp, password: hashPassword });
        await newDoctor.save();
        const token = jwt.sign({ id: newDoctor._id, email: newDoctor.email }, secretKey, { expiresIn: "1h" });
        return res.status(201).json({ status: true, message: "Sign-Up Successful", token, newDoctor });
    }
    catch (error) {
        console.log(error, "Error Found");
        res.status(400).json({ status: false, message: "Something went wrong !", error: error.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ status: false, message: "All fields are compulsory" });
        const doctor = await Doctor.findOne({ email });
        if (!doctor || !(await bcrypt.compare(password, doctor.password))) return res.status(400).json({ status: false, message: "Invalid credentials..." });
        const token = jwt.sign({ id: doctor._id, email: doctor.email }, secretKey, { expiresIn: "1h" });
        res.status(200).json({ status: true, message: "Login successful", token: token });
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
            const doctor = await Doctor.findById(decode?.id);
            if (!doctor) return res.status(400).json({ status: false, message: "Invalid Token" });
            const doctorData = {
                id: doctor?._id,
                profileImage: doctor?.profileImage,
                firstName: doctor?.firstName,
                lastName: doctor?.lastName,
                specialty: doctor?.specialty,
                email: doctor?.email,
                phoneNumber: doctor?.phoneNumber,
                experience: doctor?.yearsOfExp,
                role: doctor?.role,
                created: doctor?.createdAt,
            }
            res.status(200).json({ status: true, message: "profile data", data: doctorData });
        })
    }
    catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong", error: error.message });
    }
})
router.get('/doctors-list', async (req, res) => {
    try {
        const doctors = await Doctor.find({}).sort({ createdAt: -1 });
        res.send({ count: doctors.length, data: doctors });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: "Something went wrong !" });
    }
})
router.post("/consultation", async (req, res) => {
    try {
        const { doctorId, patientId, patientName, illness, transactionId, consent } = req.body;
        if (!doctorId || !patientId || !illness || !transactionId || consent === undefined || !patientName) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing"
            });
        }
        const consultation = new Consultations(req.body);
        await consultation.save();
        res.status(201).json({
            success: true,
            message: "Consultation saved",
            data: consultation
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error saving consultation"
        });
    }
});

router.get("/consultation/:doctorId", async (req, res) => {
    try {
        const { doctorId } = req.params
        const consultations = await Consultations.find({ doctorId }).sort({ createdAt: -1 });
        res.status(200).json({ count: consultations.length, data: consultations });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: "Something went wrong !" });
    }
});
router.post('/prescription', async (req, res) => {
    try {
        const { consultationId, patientId, careAdvice, medicine } = req.body
        if (!consultationId || !patientId || !careAdvice || !medicine) {
            return res.status(400).json({ message: "All fields required" });
        }
        let prescription = await PreScription.findOne({ consultationId });
        if (prescription) {
            prescription.careAdvice = careAdvice;
            prescription.medicine = medicine;
            prescription.pdfUrl = generatePDF(prescription, careAdvice, medicine);
            await prescription.save();
            return res.status(200).json({
                message: "Prescription Updated Successfully",
                data: prescription
            });
        } else {
            prescription = new PreScription({ consultationId, patientId, careAdvice, medicine });
            prescription.isSent = true;
            await prescription.save();
            prescription.pdfUrl = generatePDF(prescription);
            await prescription.save();
            await Consultations.findByIdAndUpdate(consultationId, { isSent: true });
        }
        res.status(201).json({
            message: "Prescription created Successfully",
            data: prescription
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error creating prescription",
            error: error.message
        });
    }
});
router.get('/prescription/:consultationId', async (req, res) => {
    try {
        const prescription = await PreScription.findOne({
            consultationId: req.params.consultationId
        });
        if (!prescription) {
            return res.status(404).json({ message: "Not found" });
        }
        res.json(prescription);
    } catch (err) {
        res.status(500).json({ message: "Error fetching prescription" });
    }
});
router.put('/send-prescription/:consultationId', async (req, res) => {
    try {
        const prescription = await PreScription.findOne({
            consultationId: req.params.consultationId
        });
        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }
        prescription.isSent = true;
        await prescription.save();
        await Consultations.findByIdAndUpdate(req.params.consultationId, {
            isSent: true
        });
        res.json({
            message: "Prescription sent successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error sending prescription"
        });
    }
});
router.get('/patient-prescriptions/:patientId', async (req, res) => {
    try {
        const prescriptions = await PreScription.find({
            patientId: req.params.patientId,
        }).sort({ createdAt: -1 });

        res.json({
            data: prescriptions
        });

    } catch (err) {
        res.status(500).json({ message: "Error fetching prescriptions" });
    }
});
module.exports = router;