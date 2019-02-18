/*
 * Create and export a request router containing the routes we will accept and handle
 *
 */

// Dependencies
const handlers = require("./handlers");

// Define a request router
const router = {
  hello: handlers.hello
};

// Export the request router
module.exports = router;
