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

// directory can differ depending on where exoress.js is 
app.use(express.static(path.join(__dirname, '..', '..', 'Full Stack Development'))); // Navigate to the parent directory
// MongoDB connection string

// Logger middleware
app.use((req, res, next) => {
    const currentTime = new Date().toISOString();
    console.log(`[${currentTime}] ${req.method} request to ${req.url}`);
    next(); // Call the next middleware in the stack
});
const mongoURI = 'mongodb+srv://ii209:ii209@fullstackiskrenivanov.v1vgx.mongodb.net/?retryWrites=true&w=majority';
console.log('Website Loaded')

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
// POST endpoint to save cart data
app.post('/api/cart', async (req, res) => {
  const { userName, userPhone, userAddress, items } = req.body;

  try {
      const cartData = {
          name,
          phone,
          address,
          items
      };

      await client.collection('Cart').insertOne(cartData); // Insert the cart data into the Cart collection
      res.status(201).send({ message: 'Cart saved successfully!' });
  } catch (error) {
      console.error('Error saving cart:', error);
      res.status(500).send({ message: 'Error saving cart', error });
  }
});

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
        console.error('Error fetching user information:', error);
        res.status(500).send('Error fetching user info');
    }
});

// Get all cart items
app.get('/api/cart', async (req, res) => {
    try {
        const carts = await client.collection('Cart').find().toArray();
        res.json(carts);
    } catch (error) {
        console.error('Error fetching cart items(cart api):', error);
        res.status(500).send('Error fetching cart items (cart api)');
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
        console.log('new inv value set')

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
app.put('/api/subjects/:id', async (req, res) => {
    const { id } = req.params; // Get the subject ID from the URL parameters
    const updateFields = req.body; // Get the new values from the request body

    // Log the ID for debugging
    console.log("ID being passed to query:", id);
    console.log("Update fields:", updateFields);

    try {
        // Update the subject in the database using the custom 'id' field
        const result = await client.collection('Subjects').updateOne(
            { id: parseInt(id) }, // Use the custom 'id' field, convert to integer
            { $set: updateFields } // Set the new values from the request body
        );

        if (result.modifiedCount === 1) {
            res.status(200).send({ message: 'Subject updated successfully!' });
        } else {
            res.status(404).send({ message: 'Subject not found or no updates were made.' });
        }
    } catch (error) {
        console.error('Error updating subject:', error); // Log the error
        res.status(500).send({ message: 'Error updating subject', error: error.message }); // Send error message
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});