/*
 * Create and export accountCreate sub methods
 *
 */

// Dependencies
const helpers = require("./../helpers");

// Container for cart sub methods
const accountCreate = {};

accountCreate.get = function(data, callback) {
    // Prepare data for interpolation
    var templateData = {
        "head.title": "Create an Account",
        "head.description": "Signup is easy and only takes a few seconds.",
        "body.class": "accountCreate"
    };
    // Read in a template as a string
    helpers.getTemplate("accountCreate", templateData, function(err, str) {
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
module.exports = accountCreate;
