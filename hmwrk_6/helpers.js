/*
 * Helper functions that may be used by various parts of the app
 *
 */

// Container for all helpers
const helpers = {};

// Parse a JSON string to an object in all cases , without throwing
helpers.parseJSONToObject = function(str) {
    try {
        let obj = JSON.parse(str);
        return obj;
    } catch (e) {
        return {};
    }
};

// Export the helpers
module.exports = helpers;
