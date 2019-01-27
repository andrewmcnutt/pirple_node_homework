/*
 * CLI-related tasks
 *
 */

// Dependencies
const readline = require("readline");
const util = require("util");
const debug = util.debuglog("cli");
const events = require("events");
class _events extends events {}
const e = new _events();
const os = require("os");
const v8 = require("v8");
const _data = require("./data");
const helpers = require("./helpers");

// Instantiate the cli module object
const cli = {};

// Input handlers
e.on("help", function() {
    cli.responders.help();
});

e.on("exit", function() {
    cli.responders.exit();
});

e.on("list menu items", function() {
    cli.responders.listMenuItems();
});

e.on("recent orders", function() {
    cli.responders.recentOrders();
});

e.on("order lookup", function() {});

e.on("recent sign ups", function() {
    cli.responders.recentSignUps();
});

e.on("user lookup", function() {});

// Responders object
cli.responders = {};

// Help / Man
cli.responders.help = function() {
    // Codify the commands and their explanations
    const commands = {
        exit: "Kill the CLI (and the rest of the application)",
        help: "Show this help page",
        "list menu items": "Get a list of all the possible menu items",
        "recent orders":
            "Show a list of all orders placed within the last 24 hours",
        "order lookup --{orderId}":
            "Get a specific order using an order id(The users phone)",
        "recent sign ups":
            "Show a list of all users who have logged in within the last 24 hours.",
        "user lookup --{userId}":
            "Get a specific user using a user id(The users phone)"
    };

    // Show a header for the help page that is as wide as the screen
    cli.horizontalLine();
    cli.centered("CLI MANUAL");
    cli.horizontalLine();
    cli.verticalSpace(2);

    // Show each command, followed by its explanation, in white and yellow respectively
    for (let key in commands) {
        if (commands.hasOwnProperty(key)) {
            let value = commands[key];
            let line = "      \x1b[33m " + key + "      \x1b[0m";
            let padding = 60 - line.length;
            for (let i = 0; i < padding; i++) {
                line += " ";
            }
            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    }
    cli.verticalSpace(1);

    // End with another horizontal line
    cli.horizontalLine();
};

// Create a vertical space
cli.verticalSpace = function(lines) {
    lines = typeof lines == "number" && lines > 0 ? lines : 1;
    for (let i = 0; i < lines; i++) {
        console.log("");
    }
};

// Create a horizontal line across the screen
cli.horizontalLine = function() {
    // Get the available screen size
    let width = process.stdout.columns;

    // Put in enough dashes to go across the screen
    let line = "";
    for (let i = 0; i < width; i++) {
        line += "-";
    }
    console.log(line);
};

// Create centered text on the screen
cli.centered = function(str) {
    str = typeof str == "string" && str.trim().length > 0 ? str.trim() : "";

    // Get the available screen size
    let width = process.stdout.columns;

    // Calculate the left padding there should be
    let leftPadding = Math.floor((width - str.length) / 2);

    // Put in left padded spaces before the string itself
    let line = "";
    for (let i = 0; i < leftPadding; i++) {
        line += " ";
    }
    line += str;
    console.log(line);
};

// Exit
cli.responders.exit = function() {
    process.exit(0);
};

// List menu items
cli.responders.listMenuItems = async function() {
    let menuData;
    // Return the menu
    try {
        menuData = await _data.read("menu", "menu");
    } catch (error) {
        console.log("Error: The menu could not be found");
        return;
    }

    cli.verticalSpace();
    console.log("Below is a list of menu items and thier options");
    cli.verticalSpace();

    Object.keys(menuData).forEach(function(itemType) {
        console.log(itemType.toUpperCase());
        console.log(
            "The options for this item are: " +
                Object.values(menuData[itemType])
        );
        cli.verticalSpace();
    });
};

// List recent orders
cli.responders.recentOrders = async function() {
    let recentOrdersList;

    // Return orders
    try {
        recentOrdersList = await _data.list("cart");
    } catch (error) {
        console.log("Error: No orders could be found");
        return;
    }

    recentOrdersList.forEach(async function(fileName) {
        let fileIsRecent;
        let fileData;

        // Check if file was recently used
        try {
            fileIsRecent = await _data.recentlyUsedFile("cart", fileName);
        } catch (error) {
            console.log("Error: Could not locate file in path");
            return;
        }

        // If the file is recent list it in the console
        if (fileIsRecent) {
            try {
                fileData = await _data.read(
                    "cart",
                    fileName.replace(".json", "")
                );
            } catch (error) {
                console.log("Error: Could not read the recent file");
                return;
            }

            cli.verticalSpace();
            console.log("Recent Order: " + fileName.replace(".json", ""));
            console.log(fileData);
            cli.verticalSpace();
        }
    });
};

// List recent sign ups
cli.responders.recentSignUps = async function() {
    let recentSignUpsList;

    // Return users
    try {
        recentSignUpsList = await _data.list("users");
    } catch (error) {
        console.log("Error: No users could be found");
        return;
    }

    recentSignUpsList.forEach(async function(fileName) {
        let fileIsRecent;
        let fileData;

        // Check if file was recently created
        try {
            fileIsRecent = await _data.recentlyCreatedFile("users", fileName);
        } catch (error) {
            console.log("Error: Could not locate file in path");
            return;
        }

        // If the file is recently created list it in the console
        if (fileIsRecent) {
            try {
                fileData = await _data.read(
                    "users",
                    fileName.replace(".json", "")
                );
            } catch (error) {
                console.log("Error: Could not read the recent file");
                return;
            }

            cli.verticalSpace();
            console.log(
                "Recent User Sign Up: " + fileName.replace(".json", "")
            );
            console.log(fileData);
            cli.verticalSpace();
        }
    });
};

// Input processor
cli.processInput = function(str) {
    str = typeof str == "string" && str.trim().length > 0 ? str.trim() : false;
    // Only process the input if the user actually wrote something, otherwise ignore it
    if (str) {
        // Codify the unique strings that identify the different unique questions allowed be the asked
        var uniqueInputs = [
            "exit",
            "help",
            "list menu items",
            "recent orders",
            "order lookup",
            "recent sign ups",
            "user lookup"
        ];

        // Go through the possible inputs, emit event when a match is found
        var matchFound = false;
        uniqueInputs.some(function(input) {
            if (str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;
                // Emit event matching the unique input, and include the full string given
                e.emit(input, str);
                return true;
            }
        });

        // If no match is found, tell the user to try again
        if (!matchFound) {
            console.log("Sorry, try again");
        }
    }
};

// Init script
cli.init = function() {
    // Send to console, in dark blue
    console.log("\x1b[34m%s\x1b[0m", "The CLI is running");

    // Start the interface
    var _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ""
    });

    // Create an initial prompt
    _interface.prompt();

    // Handle each line of input separately
    _interface.on("line", function(str) {
        // Send to the input processor
        cli.processInput(str);

        // Re-initialize the prompt afterwards
        _interface.prompt();
    });

    // If the user stops the CLI, kill the associated process
    _interface.on("close", function() {
        process.exit(0);
    });
};

// Export the module
module.exports = cli;
