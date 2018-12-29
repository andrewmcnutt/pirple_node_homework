/*
 * Create and export a request router containing the routes we will accept and handle
 *
 */

// Dependencies
const handlers = require("./handlers/");

// Define a request router
const router = {
    ping: handlers.ping,
    users: handlers.users,
    tokens: handlers.tokens,
    menu: handlers.menu,
    cart: handlers.cart,
    charge: handlers.charge
};

// Export the request router
module.exports = router;
