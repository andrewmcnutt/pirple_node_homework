/*
 * Create and export home sub methods
 *
 */

// Dependencies
const helpers = require("./../helpers");

// Container for cart sub methods
const common = {};

common.get = function(data, callback) {
    // Get the filename being requested
    var trimmedAssetName = data.trimmedPath.replace("common/", "").trim();
    if (trimmedAssetName.length > 0) {
        // Read in the asset's data
        helpers.getStaticAsset(trimmedAssetName, function(err, data) {
            if (!err && data) {
                // Determine the content type (default to plain text)
                var contentType = "plain";

                if (trimmedAssetName.indexOf(".css") > -1) {
                    contentType = "css";
                }

                if (trimmedAssetName.indexOf(".png") > -1) {
                    contentType = "png";
                }

                if (trimmedAssetName.indexOf(".jpg") > -1) {
                    contentType = "jpg";
                }

                if (trimmedAssetName.indexOf(".ico") > -1) {
                    contentType = "favicon";
                }

                // Callback the data
                callback(200, data, contentType);
            } else {
                callback(404);
            }
        });
    } else {
        callback(404);
    }
};

// Export the cart sub methods
module.exports = common;
