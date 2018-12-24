/*
 * Create and export charge sub methods
 *
 */

// Dependencies
const _data = require("./../data");
const helpers = require("./../helpers");
const tokensHandler = require("./tokens");
let stripe = require("stripe");

// Container for charge sub methods
const charge = {};

//** POST **//
// Required data: phone
charge.post = async function(data, callback) {
  // Check for the required field
  const phone = helpers.stringLengthOfTen(data.payload.phone);

  // Vars we will use when we try to process an order
  let cartData;
  let itemCount;
  let chargeTotal;
  let userData;
  let customerList;
  let customer;
  let stripeSource;

  stripe = stripe(process.env.STRIPE_API_KEY);

  if(!phone) {
    callback(400, { Error: "Missing required field" });
    return;
  }

  // Get the token from the headers
  token = typeof data.headers.token == "string" ? data.headers.token : false;

  // Verify that the given token is valid for the phone numbers
  verifiedToken = tokensHandler.verifyToken(token, phone);

  if (!verifiedToken) {
    callback(403, {
      Error: "Missing required token in header, or token is invalid"
    });
    return;
  }

  // Lookup the user
  try {
    cartData = await _data.read("cart", phone);
  } catch(error) {
    callback(404, {Error : "The specified cart could not be found"});
    return;
  }

  itemCount = Object.values(cartData)
    .map(item => {
      return item !== "" ? item.split(",").length : 0;
    })
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    });
  chargeTotal = itemCount * 100;

  // Lookup the user
  try {
    userData = await _data.read("users", phone);
  } catch(error) {
    callback(404, { Error : "The specified user could not be found" });
    return;
  }

  if (!userData.email) {
    callback(400, { Error: "Error trying to retrieve stripe customer" });
    return;
  }

  // Lookup the stripe customers
  try {
    customerList = await stripe.customers.list({
      email: userData.email
    });
  } catch(error) {
    callback(400, { Error : "Could not retrieve cutomer list" });
    return;
  }

  // If we find customer data with the email set that person as the customer. If
  // not then create a new customer.
  if(customerList.data.length >= 1) {
    customer = customerList.data[0];
  } else {
    try {
      customer = await stripe.customers.create({
        email: userData.email
      });
    } catch(error) {
      callback(400, { Error: "Could not create a new customer" });
      return;
    }
  }

  // Create a source in stripe for the customer
  try {
    stripeSource = await stripe.customers.createSource(customer.id, {
      source: 'tok_visa'
    });
  } catch(error) {
    callback(400, { Error: "Could not create a new customer source" });
    return;
  }

  // Charge the customer
  try {
    await stripe.charges.create({
        amount: chargeTotal,
        currency: 'usd',
        customer: stripeSource.customer,
        description: "Ordering pizza"
      });
  } catch(error) {
    callback(400, { Error: "Could not process charge" });
    return;
  }

  var emailData = {
    from: 'Bob Belcher <bobsburgers@burger.org>',
    to: userData.email,
    subject: 'Receipt for order from: You want a pizza this?!',
    text: `Your pizza is on the way! The total for your order was $${itemCount}.00.`
  };

  try {
    await helpers.emailReceipt(emailData);
  } catch(error) {
    callback(400, { Error: error });
    return;
  }

  callback(200);
};

// Export the charge sub methods
module.exports = charge;
