/*
 * Create and export a request router containing the routes we will accept and handle
 *
 */

// Dependencies
const handlers = require("./handlers/");

// Define a request router
const router = {
    "" : handlers.home,
    "account/create" : handlers.accountCreate,
    "session/create" : handlers.sessionCreate,
    "session/deleted" : handlers.sessionDeleted,
    "session/checkout": handlers.sessionCheckout,
    ping: handlers.ping,
    "session/menu": handlers.menu,
    "api/users": handlers.users,
    "api/tokens": handlers.tokens,
    "api/cart": handlers.cart,
    "api/charge": handlers.charge,
    "public" : handlers.common
};

// Export the request router
module.exports = router;
