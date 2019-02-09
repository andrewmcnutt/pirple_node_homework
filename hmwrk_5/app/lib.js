/*
 * Library for functions we will test
 *
 */

// Container for module (to be exported)
var lib = {};

lib.sumArray = function(numArray = null) {
  let allNumbers = numArray.every(number => typeof number == "number");

  if (!allNumbers) {
    return null;
  }

  return numArray.reduce(
    (accumulator, currentValue) => accumulator + currentValue
  );
};

lib.reverseString = function(string = null) {
  if (typeof string !== "string") {
    return null;
  }

  return string.split("").reduce((rev, char) => char + rev, "");
};

lib.removeStringsAndSort = function(numArray = null) {
  if (!Array.isArray(numArray)) {
    return null;
  }

  return numArray.filter(item => typeof item == "number").sort();
};

// Export the module
module.exports = lib;
