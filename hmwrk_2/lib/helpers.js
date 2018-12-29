// Dependencies
const https = require("https");
// const mailgunJS = require("mailgun-js");
const querystring = require("querystring");
let crypto = require("crypto");
let config = require("./config");

// Container for all helpers
const helpers = {};

// Create a SHA256 hash
helpers.hash = function(str) {
    if (typeof str == "string" && str.length > 0) {
        let hash = crypto
            .createHmac("sha256", config.hashingSecret)
            .update(str)
            .digest("hex");
        return hash;
    } else {
        return false;
    }
};

// Parse a JSON string to an object in all cases , without throwing
helpers.parseJSONToObject = function(str) {
    try {
        let obj = JSON.parse(str);
        return obj;
    } catch (e) {
        return {};
    }
};

// Create a string of random alphanumeric characters of a given length
helpers.createRandomString = function(strLength) {
    strLength =
        typeof strLength == "number" && strLength > 0 ? strLength : false;
    if (strLength) {
        // Define all the possible characters that could go into a string
        let possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

        // Start the final string
        let str = "";
        for (let i = 1; i <= strLength; i++) {
            let randomCharacter = possibleCharacters.charAt(
                Math.floor(Math.random() * possibleCharacters.length)
            );

            str += randomCharacter;
        }

        return str;
    } else {
        return false;
    }
};

// Check if a property is a string and is has a length greater than zero
helpers.stringLengthGreaterThanZero = function(property) {
    return typeof property == "string" && property.trim().length > 0
        ? property.trim()
        : false;
};

// Check if a property is a string has a length of ten
helpers.stringLengthOfTen = function(property) {
    return typeof property == "string" && property.trim().length == 10
        ? property.trim()
        : false;
};

// Check if a property is a string has a length of twenty
helpers.stringLengthOfTwenty = function(property) {
    return typeof property == "string" && property.trim().length == 20
        ? property.trim()
        : false;
};

// Check if a property is a boolean and is true
helpers.booleanIsTrue = function(property) {
    return typeof property == "boolean" && property == true ? true : false;
};

// Create request object for Stripe data. This method will be used to look up
// customers, create customers, or charge customers.
helpers.stripe = function(options, data) {
    const reqData = querystring.stringify(data);
    const reqOptions = {
        host: process.env.STRIPE_HOST,
        port: process.env.STRIPE_PORT,
        path: options.path,
        method: options.method,
        agent: null,
        headers: {
            Authorization: `Bearer ${process.env.STRIPE_API_KEY}`,
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(reqData),
            "User-Agent": "Stripe/v1 NodeBindings/6.17.0",
            "X-Stripe-Client-User-Agent":
                "{\"bindings_version\":\"6.17.0\",\"lang\":\"node\",\"lang_version\":\"v10.14.1\",\"platform\":\"darwin\",\"publisher\":\"stripe\",\"uname\":\"Darwin%20Prometheus.local%2018.2.0%20Darwin%20Kernel%20Version%2018.2.0%3A%20Mon%20Nov%2012%2020%3A24%3A46%20PST%202018%3B%20root%3Axnu-4903.231.4~2%2FRELEASE_X86_64%20x86_64%0A\"}"
        },
        ciphers: "DEFAULT:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!MD5"
    };
    let stripeData;

    return new Promise(async function(resolve, reject) {
        try {
            stripeData = await helpers.request(reqOptions, reqData);
        } catch (error) {
            reject("Error calling to Stripe");
            return;
        }

        // console.log("STRIPE CUSTOMER", reqData);
        resolve(stripeData);
    });
};

// Email the user a receipt
helpers.emailReceipt = function(data) {
    const reqData = querystring.stringify(data);
    const reqOptions = {
        hostname: process.env.MAILGUN_HOST,
        port: process.env.MAILGUN_PORT,
        protocol: "https:",
        path: `/v3/${process.env.MAILGUN_DOMAIN}/messages`,
        method: "POST",
        retry: 1,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(reqData)
        },
        auth: "api:" + process.env.MAILGUN_API_KEY,
        agent: false
    };

    return new Promise(async function(resolve, reject) {
        try {
            await helpers.request(reqOptions, reqData);
        } catch (error) {
            reject("Could not send the user a receipt");
            return;
        }

        resolve("Emailed receipt to customer");
    });
};

//We send a request to either Mailgun or Stripe
helpers.request = function(reqOptions, reqData) {
    return new Promise((resolve, reject) => {
        const req = https.request(reqOptions, res => {
            let response;
            res.setEncoding("utf-8");

            res.on("data", chunk => {
                response = chunk;
            });

            res.on("end", () => {
                try {
                    resolve(JSON.parse(response));
                } catch (e) {
                    resolve(response);
                }
            });
        });

        req.on("error", e => {
            reject({ Error: `There was an error sending the request ${e}` });
        });
        req.write(reqData);
        req.end();
    });
};

// Export the helpers
module.exports = helpers;
