/*
 * Create and export menu sub methods
 *
 */

// Dependencies
const _data = require("./../data");
const helpers = require("./../helpers");

// Container for menu sub methods
const menu = {};

//** GET **//
// Optional data: none
menu.get = async function(data, callback) {
    // Vars we will use when we try to update a user
    let menuData;
    let pizzaHTML;
    let toppingsHTML;
    let drinksHTML;

    // Return the menu
    try {
        menuData = await _data.read("menu", "menu");
    } catch (error) {
        callback(404, { Error: "The menu could not be found" });
        return;
    }

    pizzaHTML = menu.generateInputRadioField("Pizza Size", menuData.pizza, "pizza");
    toppingsHTML = menu.generateInputCheckboxField("Toppings", menuData.toppings);
    drinksHTML = menu.generateInputCheckboxField("Drinks", menuData.drink);

    // Prepare data for interpolation
    const templateData = {
        "head.title": "Bob's pizza company",
        "head.description": "Cheap pizza!",
        "body.class": "menu",
        pizzaHTML,
        toppingsHTML,
        drinksHTML
    };

    // Read in a template as a string
    helpers.getTemplate("menu", templateData, function(err, str) {
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

menu.generateInputCheckboxField = function(title, inputObject) {
    let inputFieldHTML = `<h1>${title}</h1>`;

    Object.values(inputObject).forEach(function(element) {
        let newInput = `<div class="inputWrapper"><input type="checkbox" name="${element}" value="${element}">${element}</div>`;
        inputFieldHTML += newInput;
    });

    return inputFieldHTML;
};

menu.generateInputRadioField = function(title, inputObject, fieldName) {
    let inputFieldTitle = `<h1>${title}</h1>`;
    let inputFields = "<div class=\"inputWrapper\">";

    Object.values(inputObject).forEach(function(element) {
        let checked = "";
        if (element == "medium") {
            checked = "checked=\"checked\"";
        }
        let newInput = `<input type="radio" name="${fieldName}" value="${element}" ${checked}>${element}<br>`;
        inputFields += newInput;
    });

    return inputFieldTitle + inputFields + "</div>";
};

// Export the menu sub methods
module.exports = menu;
