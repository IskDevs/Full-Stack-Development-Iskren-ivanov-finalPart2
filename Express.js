// server.js

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, '..', '..', 'Full Stack Development'))); // Navigate to the parent directory
// MongoDB connection string

// Logger middleware
app.use((req, res, next) => {
    const currentTime = new Date().toISOString();
    console.log(`[${currentTime}] ${req.method} request to ${req.url}`);
    next(); // Call the next middleware in the stack
});
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
app.post('/api/cart', async (req, res) => {
    const { userName, userPhone, userAddress, items } = req.body;
    const newCart = new Cart({ userName, userPhone, userAddress, items });
  
    try {
        await newCart.save();
        res.status(201).send({ message: 'Cart saved successfully!' });
    } catch (error) {
        res.status(500).send({ message: 'Error saving cart', error });
    }
  });
  app.put('/api/subjects/inventory/:id', async (req, res) => {
    const { id } = req.params; // Get the subject ID from the URL parameters
    const { inventory } = req.body; // Get the new inventory value from the request body

    // Check if inventory is a valid number
    if (typeof inventory !== 'number' || isNaN(inventory) || !Number.isInteger(inventory)) {
        return res.status(400).send({ message: 'Invalid inventory value provided. It must be an integer.' });
    }

    // Log the ID for debugging
    console.log("ID being passed to query:", id);

    try {
        // Update the inventory in the database using the custom 'id' field
        const result = await client.collection('Subjects').updateOne(
            { id: parseInt(id) }, // Use the custom 'id' field, convert to integer
            { $set: { inventory: inventory } } // Set the new inventory value
        );

        if (result.modifiedCount === 1) {
            res.status(200).send({ message: 'Inventory updated successfully!' });
        } else {
            res.status(404).send({ message: 'Subject not found or inventory not updated.' });
        }
    } catch (error) {
        console.error('Error updating inventory:', error); // Log the error
        res.status(500).send({ message: 'Error updating inventory', error: error.message }); // Send error message
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});