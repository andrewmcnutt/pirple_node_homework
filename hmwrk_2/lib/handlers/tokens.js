/*
 * Create and export tokens sub methods
 *
 */

// Dependencies
const _data = require("./../data");
const helpers = require("./../helpers");

// Container for tokens sub methods
const tokens = {};

//** POST **//
// Required data: phone, password
// Optional data: none
tokens.post = async function(data, callback) {
  // Check that the phone number and password are valid
  const phone = helpers.stringLengthOfTen(data.payload.phone);
  const password = helpers.stringLengthGreaterThanZero(data.payload.password);

  // Vars we will use when we try to create a new token
  const tokenId = helpers.createRandomString(20);
  const expires = Date.now() + 1000 * 60 * 60 * 60;
  const tokenObject = {
    id: tokenId,
    expires
  };

  let userData;
  let hashedPassword;
  let createNewToken;

  // Check that all required fields are filled out
  if (!phone || !password) {
    callback(400, { Error: "Missing required field" });
    return;
  }

  // Look up user who matched that phone number
  try {
    userData = await _data.read("users", phone);
  } catch (error) {
    callback(400, { Error: "Could not find the specified user" });
    return;
  }

  hashedPassword = helpers.hash(password);

  if (hashedPassword != userData.hashedPassword) {
    callback(400, {
      Error: "Password did not match the specified users's stored password"
    });
    return;
  }

  // If the hash is valid add the users phone to the token object.
  tokenObject.phone = phone;

  // Store the token
  try {
    createNewToken = await _data.create("tokens", tokenId, tokenObject);
  } catch (error) {
    callback(500, { Error: "Could not create the new token" });
    return;
  }

  callback(200, tokenObject);
};

//** GET **//
// Required data : id
// Optional data: none
tokens.get = async function(data, callback) {
  // Check that the id is valid
  const id = helpers.stringLengthOfTwenty(data.queryStringObject.id);

  // Vars we will use when we try to get a token
  let token;

  // Check that all required fields are filled out
  if (!id) {
    callback(400, { Error: "Missing required field"});
  }

  // Lookup the token
  try {
    token = await _data.read("tokens", id);
  } catch (error) {
    callback(400, { Error: "Could not find the token for the specified user" });
    return;
  }

  callback(200,token);
};

//** PUT **//
// Required data : id, extend
// Optional data : none
tokens.put = async function(data, callback) {
  // Check that the id & extend is valid
  const id = helpers.stringLengthOfTwenty(data.payload.id);
  const extend = helpers.booleanIsTrue(data.payload.extend);

  // Vars we will use when we try to update a token
  let token;

  // Check that all required fields are filled out
  if (!id || !extend) {
    callback(400, { Error: "Missing required field(s) or field(s) are invalid"});
    return;
  }

  // Lookup the token
  try {
    token = await _data.read("tokens", id);
  } catch (error) {
    callback(400, { Error: "Specified token does not exist"});
    return;
  }

  // Check to make sure token isn't already expired
  if (token.expires < Date.now()) {
    callback(400, { Error: "The token has already expired, and cannot be extended"});
    return;
  }

  // Set the expiration an hour from now
  // TODO change back to hour instead of 60 days
  token.expires = Date.now() + 1000 * 60 * 60 * 60;


  // Store the new updates
  try {
    await _data.update("tokens", id, token);
  } catch(error) {
    callback(500,{ Error: "Could not update the token's expiration"});
    return;
  }

  callback(200);
};

//** DELETE **//
// Required data: id
// Optional data: none
tokens.delete = async function(data, callback) {
  // Check that the id is valid
  const id = helpers.stringLengthOfTwenty(data.queryStringObject.id);

  // Vars we will use when we try to delete a token
  let token;


  // Check that all required fields are filled out
  if (!id) {
    callback(400, { Error: "Missing required field"});
    return;
  }

  // Lookup the token
  try {
    token = await _data.read("tokens", id);
  } catch (error) {
    callback(400, { Error: "Specified token does not exist"});
    return;
  }

  // Delete the token
  try {
    await _data.delete("tokens", id);
  } catch(error) {
    callback(500, { Error: "Could not delete the specified token"});
    return;
  }

  callback(200);
};


// Verify if a given token id is currently valid for a given user
tokens.verifyToken = async function(id, phone) {
 // Look up the token
 try {
   tokenData = await _data.read("tokens", id);
 } catch(error) {
   return false;
 }

 // Check that the token is for the given user data and has not expired.
 if(tokenData.phone == phone && tokenData.expires > Date.now()) {
   return true;
 } else {
   return false;
 }
};

// Export the tokens sub methods
module.exports = tokens;
