// server.js

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', '..', 'Full Stack Development'))); // Navigate to the parent directory
// MongoDB connection string
const mongoURI = 'mongodb+srv://ii209:ii209@fullstackiskrenivanov.v1vgx.mongodb.net/?retryWrites=true&w=majority';

// Create a MongoDB client
let client;

// Connect to MongoDB
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((connection) => {
        client = connection.db('FullStack-SubjectCatalog'); // Specify the database name
        console.log('MongoDB connected...');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// API Endpoints

// Get all subjects
app.get('/api/subjects', async (req, res) => {
    try {
        const subjects = await client.collection('Subjects').find().toArray();
        res.json(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).send('Error fetching subjects');
    }
});

// Get all user info
app.get('/api/userinfo', async (req, res) => {
    try {
        const users = await client.collection('UserInfo').find().toArray();
        res.json(users);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).send('Error fetching user info');
    }
});

// Get all cart items
app.get('/api/cart', async (req, res) => {
    try {
        const carts = await client.collection('Cart').find().toArray();
        res.json(carts);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).send('Error fetching cart items');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});