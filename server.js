require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const DoctorRoutes = require('./routes/doctorRoutes');
const PatientRoutes = require('./routes/patientRoutes');
const path = require('path');

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use('/doctor', DoctorRoutes);
app.use('/patient', PatientRoutes);
app.use('/prescriptions', express.static(path.join(__dirname, 'prescriptions')));

mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log("mogoDB Connected");
        app.listen(PORT, () => {
            console.log(`Server is listening on PORT : ${PORT}`);
        })
    })
    .catch(err => {
        console.error(err);
    })

