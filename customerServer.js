const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5002;
app.use(cors());
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/register', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB for customer data');
});
const registrationSchema = new mongoose.Schema({
    name: String,
    phone: String,
    emailAddress: String,
    password: String,
    confirmPassword: String,
});
const Registration = mongoose.model('Registration', registrationSchema, 'register');
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Registration.find({}, '-password -confirmPassword');
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`Customer Data Server is running on http://localhost:${PORT}`);
});
