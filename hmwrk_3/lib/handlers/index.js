// Dependencies
// HTML
const homeSubmethods = require("./home");
const commonSubmethods = require("./common");

//API
const usersSubmethods = require("./users");
const tokensSubmethods = require("./tokens");
const menuSubmethods = require("./menu");
const cartSubmethods = require("./cart");
const chargeSubmethods = require("./charge");

//Define the handlers
const handlers = {};


// API Handlers
const createHandler = function(submethods) {
    return function(data, callback) {
        const acceptableMethods = ["post", "get", "put", "delete"];
        if (acceptableMethods.indexOf(data.method) > -1) {
            submethods[data.method](data, callback);
        } else {
            callback(405);
        }
    };
};

// Ping handler
handlers.ping = function(data, callback) {
    callback(200, { message: "hello there!" });
};

// HTML handlers
// Home handler
handlers.home = function(data, callback) {
    // Reject any request that isn't a GET
    if (data.method == "get") {
        homeSubmethods[data.method](data, callback);
    } else {
        callback(405, undefined, "html");
    }
};

// Common handler
handlers.common = function(data, callback) {
    // Reject any request that isn't a GET
    if (data.method == "get") {
        commonSubmethods[data.method](data, callback);
    } else {
        callback(405, undefined, "html");
    }
};

// API handlers
// Users handler
handlers.users = createHandler(usersSubmethods);

// Tokens handler
handlers.tokens = createHandler(tokensSubmethods);

// Menu handler
handlers.menu = createHandler(menuSubmethods);

// Cart handler
handlers.cart = createHandler(cartSubmethods);

// Charge handler
handlers.charge = createHandler(chargeSubmethods);

// Not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};

// Export the handlers
module.exports = handlers;
