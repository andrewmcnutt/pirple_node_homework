/*
 * Primary file for the API
 *
 */

// Dependencies
const config = require("./config");
const server = require("./server");
const cluster = require("cluster");
const os = require("os");

// Declare the app
const app = {};

// Init function
app.init = function() {

    if(cluster.isMaster) {
      // Fork the process
      for(var i = 0; i < os.cpus().length; i++) {
        console.log('Start workers');
        cluster.fork();
      }
    } else {
      // Start the server
      server.init();
    }
};

// Execute
app.init();

// Export the app
module.exports = app;
