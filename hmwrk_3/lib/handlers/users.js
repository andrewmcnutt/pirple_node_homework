/*
 * Create and export users sub methods
 *
 */

// Dependencies
const _data = require("./../data");
const helpers = require("./../helpers");
const tokensHandler = require("./tokens");

// Container for user sub methods
const users = {};

//** POST **//
// Required data: firstName, lastName, email, streetAddress, password
// Optional data: none
users.post = async function(data, callback) {
    // Check that all required fields are filled out
    const firstName = helpers.stringLengthGreaterThanZero(
        data.payload.firstName
    );
    const lastName = helpers.stringLengthGreaterThanZero(data.payload.lastName);
    const phone = helpers.stringLengthOfTen(data.payload.phone);
    const email = helpers.stringLengthGreaterThanZero(data.payload.email);
    const streetAddress = helpers.stringLengthGreaterThanZero(
        data.payload.streetAddress
    );
    const password = helpers.stringLengthGreaterThanZero(data.payload.password);
    const allFieldsPresent =
        firstName && lastName && phone && email && streetAddress && password;

    // Vars we will use when we try to create a new user
    let userData = {};
    let hashedPassword;

    if (allFieldsPresent === false) {
        callback(400, { Error: "Missing required fields" });
        return;
    }

    // Make sure that the user doesn't already exist
    try {
        userData = await _data.read("users", phone);
    } catch (error) {
        // No user was found
        userData = null;
    }

    if (userData !== null) {
        callback(400, { Error: "A user with that file name already exists" });
        return;
    }

    // Hash the password
    hashedPassword = helpers.hash(password);

    if (!hashedPassword) {
        callback(500, { Error: "Could not hash the user's password" });
        return;
    }

    // Create the user object
    const userObject = {
        firstName,
        lastName,
        phone,
        email,
        streetAddress,
        hashedPassword
    };

    // Store the user
    try {
        await _data.create("users", phone, userObject);
    } catch (error) {
        callback(500, { Error: error });
        return;
    }

    callback(200);
};

//** GET **//
// Required data: phone
// Optional data: none
users.get = async function(data, callback) {
    // Check that the phone number is valid
    const phone = helpers.stringLengthOfTen(data.queryStringObject.phone);

    // Vars we will use when we try to get a user
    let token;
    let verifiedToken;
    let userData;

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
        return;
    }

    // Lookup the user
    try {
        userData = await _data.read("users", phone);
    } catch (error) {
        callback(404, { Error: "The specified user could not be found" });
        return;
    }

    delete userData.hashedPassword;
    callback(200, userData);
};

//** PUT **//
// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
users.put = async function(data, callback) {
    // Check for the required field
    const phone = helpers.stringLengthOfTen(data.payload.phone);

    // Check for the optional fields
    const firstName = helpers.stringLengthGreaterThanZero(
        data.payload.firstName
    );
    const lastName = helpers.stringLengthGreaterThanZero(data.payload.lastName);
    const email = helpers.stringLengthGreaterThanZero(data.payload.email);
    const streetAddress = helpers.stringLengthGreaterThanZero(
        data.payload.streetAddress
    );
    const password = helpers.stringLengthGreaterThanZero(data.payload.password);
    const updateProperties = [
        firstName,
        lastName,
        email,
        streetAddress,
        password
    ];

    // Vars we will use when we try to update a user
    let token;
    let verifiedToken;
    let userData;

    // Error if the phone is invalid
    if (!phone) {
        callback(400, { Error: "Missing required field" });
        return;
    }

    // Error if nothing is sent to update
    if (!updateProperties.some(x => x !== false)) {
        callback(400, { Error: "Missing at least one field to update" });
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

    // Lookup the user
    try {
        userData = await _data.read("users", phone);
    } catch (error) {
        callback(404, { Error: "The specified user could not be found" });
        return;
    }

    // Update the fields that are necessary
    if (firstName) {
        userData.firstName = firstName;
    }
    if (lastName) {
        userData.lastName = lastName;
    }
    if (email) {
        userData.email = email;
    }
    if (streetAddress) {
        userData.streetAddress = streetAddress;
    }
    if (password) {
        userData.hashedPassword = helpers.hash(password);
    }

    // Store the new updates
    try {
        await _data.update("users", phone, userData);
    } catch (error) {
        callback(500, { Error: error });
        return;
    }

    callback(200);
};

//** DELETE **//
// Required field: phone
users.delete = async function(data, callback) {
    // Check that the phone number is valid
    const phone = helpers.stringLengthOfTen(data.queryStringObject.phone);

    // Vars we will use when we try to update a user
    let token;
    let verifiedToken;
    let userData;
    let hasCart;

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

    // Lookup the user
    try {
        userData = await _data.read("users", phone);
    } catch (error) {
        callback(404, { Error: "The specified user could not be found" });
        return;
    }

    // Delete the user
    try {
        await _data.delete("users", phone);
    } catch (error) {
        callback(500, { Error: "Could not delete the specified user" });
        return;
    }

    // See if the user has a cart
    hasCart = helpers.booleanIsTrue(userData.hasCart);

    if (!hasCart) {
        callback(200);
        return;
    }

    // Lookup the cart
    try {
        await _data.read("cart", phone);
    } catch (error) {
        callback(404, {
            Error: "Could not find the specified cart for deletion"
        });
        return;
    }

    // Delete the cart
    try {
        await _data.delete("cart", phone);
    } catch (error) {
        callback(500, { Error: "Could not delete the specified cart" });
        return;
    }

    callback(200);
};

// Export the users sub methods
module.exports = users;
