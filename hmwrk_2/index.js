/*
 * Primary file for the API
 *
 */

// Dependencies
const server = require("./lib/server");
require('dotenv').config()
// var workers = require("./lib/workers");

// Declare the app
const app = {};

// Init function
app.init = function() {
  // Start the server
  server.init();

  // Start the workers
  // workers.init();

};

// Execute
app.init();

// Export the app
module.exports = app;
