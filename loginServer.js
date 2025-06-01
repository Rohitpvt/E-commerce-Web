const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
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
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Registration.findOne({ emailAddress: email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`Login Server is running on http://localhost:${PORT}`);
});
