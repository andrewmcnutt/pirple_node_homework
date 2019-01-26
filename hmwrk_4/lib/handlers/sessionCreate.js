/*
 * Create and export sessionCreate sub methods
 *
 */

// Dependencies
const helpers = require("./../helpers");

// Container for cart sub methods
const sessionCreate = {};

sessionCreate.get = function(data, callback) {
    // Prepare data for interpolation
    var templateData = {
        "head.title": "Login to your account.",
        "head.description":
            "Please enter your phone number and password to access your account.",
        "body.class": "sessionCreate"
    };
    // Read in a template as a string
    helpers.getTemplate("sessionCreate", templateData, function(err, str) {
        if (!err && str) {
            // Add the universal header and footer
            helpers.addUniversalTemplates(str, templateData, function(
                err,
                str
            ) {
                if (!err && str) {
                    // Return that page as HTML
                    callback(200, str, "html");
                } else {
                    callback(500, undefined, "html");
                }
            });
        } else {
            callback(500, undefined, "html");
        }
    });
};

// Export the cart sub methods
module.exports = sessionCreate;
