/*
 * Unit Tests
 *
 */

// Dependencies
let lib = require("./../app/lib.js");
let assert = require("assert");

// Holder for Tests
var unit = {};

// Assert that the lib.sumArray function is returning a number
unit["lib.sumArray should return a number"] = function() {
  let testNumArr = [1, 2, 3];
  let testSumArr = lib.sumArray(testNumArr);
  assert.equal(testSumArr, 6);
};

// Assert that the lib.sumArray function is returning null
unit["lib.sumArray should return null"] = function() {
  let testNumArr = [1, 2, "3"];
  let testSumArr = lib.sumArray(testNumArr);
  assert.equal(testSumArr, null);
};

// Assert that the lib.reverseString function is returning a reversed string
unit["lib.reverseString should return reversed string"] = function() {
  let testString = "Hello World";
  let testResult = "dlroW olleH";
  assert.equal(lib.reverseString(testString), testResult);
};

// Assert that the lib.reverseString function is returning null
unit["lib.reverseString should return null"] = function() {
  let testString = 123;
  let testResult = null;
  assert.equal(lib.reverseString(testString), testResult);
};

// Assert that the lib.removeStringsAndSort function is returning a sorted array
unit["lib.removeStringsAndSort should return a sorted array"] = function() {
  let testNumArr = [1, 3, "4", 2];
  let testResult = [1, 2, 3];
  assert.deepEqual(lib.removeStringsAndSort(testNumArr), testResult);
};

// Assert that the lib.removeStringsAndSort function is returning null
unit["lib.removeStringsAndSort should return null"] = function() {
  let testNumArr = { one: 1, two: 2 };
  let testResult = null;
  assert.deepEqual(lib.removeStringsAndSort(testNumArr), testResult);
};

// Export the tests to the runner
module.exports = unit;
