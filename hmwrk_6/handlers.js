/*
 * Handlers for various routes of the app
 *
 */

//Define the handlers
const handlers = {
  hello: (data, callback) => {
    callback(200, { message: "hello there!" });
  },
  notFound: (data, callback) => {
    callback(404);
  }
};

// Export the handlers
module.exports = handlers;
