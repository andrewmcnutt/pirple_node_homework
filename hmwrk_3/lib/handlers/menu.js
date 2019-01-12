/*
 * Create and export menu sub methods
 *
 */

// Dependencies
const _data = require("./../data");
const helpers = require("./../helpers");
const tokensHandler = require("./tokens");

// Container for menu sub methods
const menu = {};

//** GET **//
// Required data: phone
// Optional data: none
menu.get = async function(data, callback) {
    // Check that the phone number is valid
    const phone = helpers.stringLengthOfTen(data.queryStringObject.phone);

    // Vars we will use when we try to update a user
    let token;
    let verifiedToken;
    let menuData;

    // Error if the phone is invalid
    if (!phone) {
        callback(400, { Error: "Missing required field" });
        return;
    }

    // Get the token from the headers
    token = typeof data.headers.token == "string" ? data.headers.token : false;

    // Verify that the given token is valid for the phone numbers
    verifiedToken = tokensHandler.verifyToken(token, phone);

    if (!verifiedToken) {
        callback(403, {
            Error: "Missing required token in header, or token is invalid"
        });
    }

    // Return the menu
    try {
        menuData = await _data.read("menu", "menu");
    } catch (error) {
        callback(404, { Error: "The menu could not be found" });
        return;
    }

    callback(200, menuData);
};

// Export the menu sub methods
module.exports = menu;
