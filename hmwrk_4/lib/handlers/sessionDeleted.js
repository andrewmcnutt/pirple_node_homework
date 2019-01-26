/*
 * Create and export sessionDeleted sub methods
 *
 */

// Dependencies
const helpers = require("./../helpers");

// Container for cart sub methods
const sessionDeleted = {};

sessionDeleted.get = function(data, callback) {
    // Prepare data for interpolation
    var templateData = {
        "head.title": "Logged Out",
        "head.description": "You have been logged out of your account.",
        "body.class": "sessionDeleted"
    };
    // Read in a template as a string
    helpers.getTemplate("sessionDeleted", templateData, function(err, str) {
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
module.exports = sessionDeleted;
