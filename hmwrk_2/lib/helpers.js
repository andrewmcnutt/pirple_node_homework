// Dependencies
const mailgunJS = require('mailgun-js')
let crypto = require("crypto");
let config = require("./config");
let https = require("https");
let querystring = require("querystring");

// Container for all helpers
const helpers = {};

// Create a SHA256 hash
helpers.hash = function(str) {
  if (typeof str == "string" && str.length > 0) {
    let hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

// Parse a JSON string to an object in all cases , without throwing
helpers.parseJSONToObject = function(str) {
  try {
    let obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

// Create a string of random alphanumeric characters of a given length
helpers.createRandomString = function(strLength) {
  strLength = typeof strLength == "number" && strLength > 0 ? strLength : false;
  if (strLength) {
    // Define all the possible characters that could go into a string
    let possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

    // Start the final string
    let str = "";
    for (let i = 1; i <= strLength; i++) {
      let randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );

      str += randomCharacter;
    }

    return str;
  } else {
    return false;
  }
};

// Check if a property is a string and is has a length greater than zero
helpers.stringLengthGreaterThanZero = function(property) {
  return typeof property == "string" && property.trim().length > 0
    ? property.trim()
    : false;
};

// Check if a property is a string has a length of ten
helpers.stringLengthOfTen = function(property) {
  return typeof property == "string" && property.trim().length == 10
    ? property.trim()
    : false;
};

// Check if a property is a string has a length of twenty
helpers.stringLengthOfTwenty = function(property) {
  return typeof property == "string" && property.trim().length == 20
    ? property.trim()
    : false;
};

// Check if a property is a boolean and is true
helpers.booleanIsTrue = function(property) {
  return typeof property == "boolean" && property == true ? true : false;
};

// Email the user a receipt
helpers.emailReceipt = function(data) {
  mailgun = mailgunJS({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });

  return new Promise(async function(resolve, reject){
    try {
      await mailgun.messages().send(data);
    } catch(error) {
      reject("Could not send the user a receipt");
      return;
    }

    resolve("Emailed receipt to customer");
  });
}

// Export the helpers
module.exports = helpers;
