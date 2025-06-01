// registerServer.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 5001;
app.use(cors());
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/register', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB for registration');
});
const registrationSchema = new mongoose.Schema({
    name: String,
    phone: String,
    emailAddress: String,
    password: String,
    confirmPassword: String,
});
const Registration = mongoose.model('Registration', registrationSchema, 'register');
app.post('/api/register', async (req, res) => {
    const { name, phone, emailAddress, password, confirmPassword } = req.body;
    const existingAdmin = await Registration.findOne({ emailAddress });
    if (existingAdmin) {
        return res.status(409).json({ message: 'Admin with this email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Registration({
        name,
        phone,
        emailAddress,
        password: hashedPassword,
        confirmPassword,
    });

    try {
        await newAdmin.save();
        res.status(201).json({ message: 'Registration successful, redirecting to login.' });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
});
app.get('/api/register', async (req, res) => {
    try {
        const customers = await Registration.find({}, '-password -confirmPassword');
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`Registration Server is running on http://localhost:${PORT}`);
});
