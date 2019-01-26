/*
 * Primary file for the API
 *
 */

// Dependencies
const server = require("./lib/server");
const cli = require("./lib/cli");
require("dotenv").config();

// Declare the app
const app = {};

// Init function
app.init = function() {
    // Start the server
    server.init();

    // Start the CLI, but make sure it starts last
    setTimeout(function(){
        cli.init();
    },50);
};

// Execute
app.init();

// Export the app
module.exports = app;
