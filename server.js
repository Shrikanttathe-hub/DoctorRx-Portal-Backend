const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const DoctorRoutes = require('./routes/doctorRoutes');
const PatientRoutes = require('./routes/patientRoutes');
const path = require('path');

// const PORT = 5000;

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use('/doctor', DoctorRoutes);
app.use('/patient', PatientRoutes);
app.use('/prescriptions', express.static(path.join(__dirname, 'prescriptions')));

// mongoose.connect(process.env.DB_URI)
//     .then(() => {
//         console.log("mogoDB Connected");
//         app.listen(PORT, () => {
//             console.log(`Server is listening on PORT : ${PORT}`);
//         })
//     })
//     .catch(err => {
//         console.error(err);
//     })

let isConnected = false;
async function connectToMongoDB(){
    try{
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch(error){
        console.log("Error Connecting to MongoDB", error);
    }
}

app.use((req, res, next) => {
    if(!isConnected){
        connectToMongoDB();
    }
    next();
})

module.exports = app
