# 🏥 DoctorRx Portal - Online Consultation & Prescription System

DoctorRx is a MERN-stack healthcare web application that enables patients to consult doctors online and receive digital prescriptions. It simplifies doctor-patient interaction with a secure and user-friendly interface.

---

## Live Features

### Doctor Module
- Sign-Up for Doctor
- Secure Login, (JWT Based)
- Profile Management
- View Patient Consultations
- Write, Edit & Send Prescriptions
- Download Prescription (PDF)

### Patient Module
- Register & Login (JWT Based)
- View Doctors List
- Multi-step Consultation Form
- Online Payment (UPI QR Based)
- Receive Prescriptions

---

## Tech Stack

| Frontend : React.js, CSS, Axios 
| Backend  : Node.js, Express.js 
| Database : MongoDB 
| Auth     : JWT 
| Payment  : UPI QR 


---

## Installation Guide

## 1 Clone Repository

git clone https://github.com/Shrikanttathe-hub/DoctorRx-Portal-Frontend.git (Frontend)
git clone https://github.com/Shrikanttathe-hub/DoctorRx_Backend.git (Backend)
cd doctorRx-Portal

## 2 Install Dependencies
cd backend or cd frontend
npm install

## 3 Environment Variables
PORT=5000
MONGO_URI=mongodb+srv://sptathe:Shrikant358@cluster0.47eryog.mongodb.net/DoctorRx-Portal?appName=Cluster0
JWT_SECRET=12357125376@#$@#14523465ekdfiq6787&*!@*^*&#^@$!## (For Doctor Routes / Patinet Routes)

## 4 Run Application
npm start (Backend) 
npm run dev (Frontend) 

## Doctor Routes
GET	/doctor/doctors-list	---  Get all doctors
GET	/doctor/profile	----  Get doctor profile
GET	/doctor/consultation/:doctorId	---- Get consultations
POST	/doctor/prescription ---- 	Create prescription
GET	/doctor/prescription/:consultationId ---- 	Get prescription
PUT	/doctor/send-prescription/:consultationId	-----  Send prescription

## Patient Routes
Method	Endpoint	Description
GET	/patient/profile	Get patient profile
POST	/doctor/consultation	Create consultation

## MongoDb Credentials
Username : sptathe@gmail.com
Password : Shrikant@358 