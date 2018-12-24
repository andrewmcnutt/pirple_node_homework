/*
 * Create and export cart sub methods
 *
 */

// Dependencies
const _data = require("./../data");
const helpers = require("./../helpers");
// const config = require("./../config");
const tokensHandler = require("./tokens");

// Container for cart sub methods
const cart = {};

//** POST **//
// Required data: phone
// Optional data: pizza, toppings, drink
cart.post = async function(data, callback) {
  // Check for the required field
  const phone = helpers.stringLengthOfTen(data.payload.phone);

  // Check for the optional fields
  const pizza = helpers.stringLengthGreaterThanZero(data.payload.pizza);
  const toppings = helpers.stringLengthGreaterThanZero(data.payload.toppings);
  const drink = helpers.stringLengthGreaterThanZero(data.payload.drink);
  const updateProperties = [pizza, toppings, drink];

  // Vars we will use when we try to create a cart
  let token
  let verifiedToken
  let userData
  let createNewCart = {};

  // Error if the phone is invalid
  if(!phone) {
    callback(400, { Error: "Missing required field" });
    return;
  }

  // Error if nothing is sent to create the cart
  if(!updateProperties.some(x => x !== false)) {
    callback(400, { Error: "Missing at least one field to create a cart"});
  }

  // Get the token from the headers
  token = typeof(data.headers.token) == "string" ? data.headers.token : false;

  // Verify that the given token is valid for the phone numbers
  verifiedToken = tokensHandler.verifyToken(token, phone);

  if (!verifiedToken) {
    callback(403, {
      Error: "Missing required token in header, or token is invalid"
    });
  }

  // Lookup the user
  try {
    userData = await _data.read("users", phone);
  } catch(error) {
    callback(404, { Error: "The specified user could not be found" });
    return;
  }

  // Create the cart object
  hasPizza = pizza ? pizza : '';
  hasToppings = toppings ? toppings : '';
  hasDrink = drink ? drink : '';

  const cartObject = {
    pizza: hasPizza,
    toppings: hasToppings,
    drink: hasDrink
  };

  // Store the cart
  try {
    createNewCart = await _data.create("cart", phone, cartObject);
  } catch(error) {
    callback(500,{ Error: "Could not create the new cart"});
    return;
  }

  // Set hasCart to true in the user's object
  userData.hasCart = true;

  // Save the new user data
  try {
    await _data.update("users", phone, userData);
  } catch(error) {
    callback(500,{ Error: "Could not update the user with new cart"});
    return;
  }

  callback(200);
};

//** GET **//
// Required data: phone
// Optional data: none
cart.get = async function(data, callback) {
  // Check that the phone number is valid
  const phone = helpers.stringLengthOfTen(data.queryStringObject.phone);

  // Vars we will use when we try to create a cart
  let token
  let verifiedToken
  let cartData

  // Error if the phone is invalid
  if(!phone) {
    callback(400, { Error: "Missing required field" });
    return;
  }

  // Get the token from the headers
  token = typeof(data.headers.token) == "string" ? data.headers.token : false;

  // Verify that the given token is valid for the phone numbers
  verifiedToken = tokensHandler.verifyToken(token, phone);

  if (!verifiedToken) {
    callback(403, {
      Error: "Missing required token in header, or token is invalid"
    });
  }

  // Lookup the cart
  try {
    cartData = await _data.read("cart", phone);
  } catch(error) {
    callback(404, { Error: "The specified cart could not be found" });
    return;
  }

  callback(200, cartData);
};

//** PUT **//
// Required data: phone
// Optional data: pizza, toppings, drink
cart.put = async function(data, callback) {
  // Check for the required field
  const phone = helpers.stringLengthOfTen(data.payload.phone);

  // Check for the optional fields
  const pizza = helpers.stringLengthGreaterThanZero(data.payload.pizza);
  const toppings = helpers.stringLengthGreaterThanZero(data.payload.toppings);
  const drink = helpers.stringLengthGreaterThanZero(data.payload.drink);
  const updateProperties = [pizza, toppings, drink];

  // Vars we will use when we try to create a cart
  let token
  let verifiedToken
  let cartData

  // Error if the phone is invalid
  if(!phone) {
    callback(400, { Error: "Missing required field" });
    return;
  }

  // Error if nothing is sent to create the cart
  if(!updateProperties.some(x => x !== false)) {
    callback(400, { Error: "Missing at least one field to update a cart"});
  }

  // Get the token from the headers
  token = typeof(data.headers.token) == "string" ? data.headers.token : false;

  // Verify that the given token is valid for the phone numbers
  verifiedToken = tokensHandler.verifyToken(token, phone);

  if (!verifiedToken) {
    callback(403, {
      Error: "Missing required token in header, or token is invalid"
    });
  }

  // Lookup the cart
  try {
    cartData = await _data.read("cart", phone);
  } catch(error) {
    callback(404, { Error: "The specified cart could not be found" });
    return;
  }

  // Update the fields that are necessary
  if(pizza) {
    cartData.pizza = pizza;
  }
  if(toppings) {
    cartData.toppings = toppings;
  }
  if(drink) {
    cartData.drink = drink;
  }

  // Save the new user data
  try {
    await _data.update("cart", phone, cartData);
  } catch(error) {
    callback(500,{ Error: "Could not update the cart"});
    return;
  }

  callback(200);
};

//** DELETE **//
// Required field: phone
cart.delete = async function(data, callback) {
  // Check that the phone number is valid
  const phone = helpers.stringLengthOfTen(data.queryStringObject.phone);

  // Vars we will use when we try to create a cart
  let token
  let verifiedToken
  let cartData

  // Error if the phone is invalid
  if(!phone) {
    callback(400, { Error: "Missing required field" });
    return;
  }

  // Get the token from the headers
  token = typeof(data.headers.token) == "string" ? data.headers.token : false;

  // Verify that the given token is valid for the phone numbers
  verifiedToken = tokensHandler.verifyToken(token, phone);

  if (!verifiedToken) {
    callback(403, {
      Error: "Missing required token in header, or token is invalid"
    });
  }

  // Lookup the cart
  try {
    cartData = await _data.read("cart", phone);
  } catch(error) {
    callback(404, { Error: "The specified cart could not be found" });
    return;
  }

  // Delete the cart
  try {
    await _data.delete("cart", phone);
  } catch(error) {
    callback(500, { Error : "Could not delete the specified cart" });
    return;
  }

  callback(200);
};

// Export the cart sub methods
module.exports = cart;
