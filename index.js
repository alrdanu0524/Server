require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./src/db/db'); // Use pool directly from db file
const router = require('./src/routes/_index.routes');

const SERVER_PORT = process.env.SERVER_PORT || 5000;
const app = express();

// Middleware setup
app.use(express.json());
app.use(cors({ origin: "*" }));

// Test route
app.get("/test", (req, res) => {
  res.json({ msg: "test Ok" });
});



// API routes
app.use('/api/v1/', router);

// Start the server
app.listen(SERVER_PORT, () => {
  console.log('Server is running on port:', SERVER_PORT);
});
