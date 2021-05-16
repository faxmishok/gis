const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const connectPG = require('./src/connect');
const fetchDataToServe = require('./src/fetch');

// Set env variables
require('dotenv').config();

// Middleware to parse json body and url
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Enable CORS Policy
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server and set the port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));

//Handle unhandled promise errors
process.on('unhandledRejection', (err) => {
  console.log(`Unhandled Error: ${err}`);
  process.exit(1);
});

// Establish DB Connection
const client = connectPG();

// Fetch Data
fetchDataToServe(app, client);
