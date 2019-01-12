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
    // "food" : handlers.food,
    // "order" : handlers.order,
    //
    "session/create" : handlers.sessionCreate,
    "session/deleted" : handlers.sessionDeleted,

    ping: handlers.ping,
    "api/users": handlers.users,
    "api/tokens": handlers.tokens,
    "menu": handlers.menu,
    "api/cart": handlers.cart,
    "api/charge": handlers.charge,

    "public" : handlers.common
};

// Export the request router
module.exports = router;
