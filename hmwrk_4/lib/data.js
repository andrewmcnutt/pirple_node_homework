/*
 * Library for storing and editing data.
 *
 */
const util = require("util");
const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");
// eslint-disable-next-line
const _dirName = __dirname;

// Promisify fs functions
const fsOpen = util.promisify(fs.open);
const fsReadFile = util.promisify(fs.readFile);
const fsTruncate = util.promisify(fs.ftruncate);
const fsWriteFile = util.promisify(fs.writeFile);
const fsClose = util.promisify(fs.close);
const fsUnlink = util.promisify(fs.unlink);

// Container for the module
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(_dirName, "../.data/");

// Write data to file
lib.create = function(dir, file, data) {
    return new Promise(async function(resolve, reject) {
        let stringData = JSON.stringify(data);
        let fileToCreate;

        // Open the file for writing
        try {
            fileToCreate = await fsOpen(
                lib.baseDir + dir + "/" + file + ".json",
                "wx"
            );
        } catch (err) {
            reject("Could not create new file, it may already exist");
            return;
        }

        // Write the new data to the file
        try {
            await fsWriteFile(fileToCreate, stringData);
        } catch (err) {
            reject("Error writing to new file");
            return;
        }

        // Close the file
        try {
            await fsClose(fileToCreate);
        } catch (err) {
            reject("Error closing new file");
            return;
        }

        resolve("File created");
    });
};

//Read data from a file
lib.read = function(dir, file) {
    return new Promise(async function(resolve, reject) {
        let fileToRead;

        // Read the file for the user we want to create the token for
        try {
            fileToRead = await fsReadFile(
                lib.baseDir + dir + "/" + file + ".json",
                "utf8"
            );
        } catch (err) {
            reject(null);
            return;
        }

        resolve(helpers.parseJSONToObject(fileToRead));
    });
};

// Update data inside a file
lib.update = function(dir, file, data) {
    return new Promise(async function(resolve, reject) {
        let stringData = JSON.stringify(data);
        let fileToUpdate;

        // Open the file for writing
        try {
            fileToUpdate = await fsOpen(
                lib.baseDir + dir + "/" + file + ".json",
                "r+"
            );
        } catch (err) {
            reject(
                "Could not open the file for updating, it may not exist yet"
            );
            return;
        }

        // Remove all data in the file
        try {
            await fsTruncate(fileToUpdate);
        } catch (err) {
            reject("Error truncating file");
            return;
        }

        // Write the new data to the file
        try {
            await fsWriteFile(fileToUpdate, stringData);
        } catch (err) {
            reject("Error writing to existing file");
            return;
        }

        // Close the file
        try {
            await fsClose(fileToUpdate);
        } catch (err) {
            reject("Error closing the file");
            return;
        }

        resolve("File updated");
    });
};

// Delet a file
lib.delete = function(dir, file) {
    return new Promise(async function(resolve, reject) {
        // Unlink the file
        try {
            await fsUnlink(lib.baseDir + dir + "/" + file + ".json");
        } catch (err) {
            reject("Error deleting file");
            return;
        }

        resolve("Unlinked the file");
    });
};

// List all the items in a directory
lib.list = function(dir) {
    return new Promise(async function(resolve, reject) {
        try {
            await fs.readdir(lib.baseDir + dir + "/", function(err, data) {
                resolve(data);
            });
        } catch (err) {
            reject("Unable to locate any files");
            return;
        }
    });
};

// Return boolean telling us if a file was updated within the last 24 hours
lib.recentlyUsedFile = function(dir, file) {
    return new Promise(async function(resolve, reject) {
        try {
            await fs.stat(lib.baseDir + dir + "/" + file, function(err, stats) {
                let mtime = new Date(util.inspect(stats.mtime));
                let timeDiff = Date.now() - mtime.getTime();
                let timeDiffInMinutes = Math.floor(timeDiff / 60000);
                let isRecent = false;

                if (timeDiffInMinutes <= 1440) {
                    isRecent = true;
                }

                resolve(isRecent);
            });
        } catch (err) {
            reject("Unable to locate any file");
            return;
        }
    });
};

// Return boolean telling us if a file was created within the last 24 hours
lib.recentlyCreatedFile = function(dir, file) {
    return new Promise(async function(resolve, reject) {
        try {
            await fs.stat(lib.baseDir + dir + "/" + file, function(err, stats) {
                let birthtime = new Date(util.inspect(stats.mtime));
                let timeDiff = Date.now() - birthtime.getTime();
                let timeDiffInMinutes = Math.floor(timeDiff / 60000);
                let isRecent = false;

                if (timeDiffInMinutes <= 1440) {
                    isRecent = true;
                }

                resolve(isRecent);
            });
        } catch (err) {
            reject("Unable to locate any file");
            return;
        }
    });
};

// Export the data library
module.exports = lib;
