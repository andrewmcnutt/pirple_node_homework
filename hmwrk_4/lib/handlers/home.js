/*
 * Create and export home sub methods
 *
 */

// Dependencies
const helpers = require("./../helpers");

// Container for cart sub methods
const home = {};

home.get = function(data, callback) {
    // Prepare data for interpolation
    const templateData = {
        "head.title" : "Bob's pizza company",
        "head.description" : "Cheap pizza!",
        "body.class" : "index"
    };

    // Read in a template as a string
    helpers.getTemplate("index", templateData, function(err, str) {
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
module.exports = home;
