/*
 * Create and export checkout sub methods
 *
 */

// Dependencies
const helpers = require("./../helpers");

// Container for cart sub methods
const checkout = {};

checkout.get = function(data, callback) {
    // Prepare data for interpolation
    const templateData = {
        "head.title" : "Bob's pizza company",
        "head.description" : "Cheap pizza!",
        "body.class" : "checkout"
    };

    // Read in a template as a string
    helpers.getTemplate("checkout", templateData, function(err, str) {
        if (!err && str) {
            // Add the universal header and footer
            helpers.addUniversalTemplates(str, templateData, function(err, str) {
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
module.exports = checkout;
