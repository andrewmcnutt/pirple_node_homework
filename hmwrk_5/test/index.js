/*
 * Test runner
 *
 */
 
// Application logic for the test runner
_app = {};

// Holder of all tests
_app.tests = {};

// Dependencies
_app.tests.unit = require("./unit");

// Count all the tests
_app.countTests = function() {
  let counter = 0;

  for (let key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      counter += Object.keys(_app.tests[key]).length;
    }
  }

  return counter;
};

// Run a specific test
_app.runTest = function(testFunction) {
  try {
    testFunction();
    return {
      pass: true
    };
  } catch (e) {
    return {
      pass: false,
      error: e
    };
  }
};

// Run all the tests, collecting the errors and successes
_app.callTests = function() {
  let errors = [];
  let successes = 0;
  let limit = _app.countTests();
  let counter = 0;
  let testsToRun = [];

  for (let key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      for (let i = 0; i < Object.keys(_app.tests[key]).length; i++) {
        let obj = {};
        let objKey = Object.keys(_app.tests[key])[i];
        obj[objKey] = Object.values(_app.tests[key])[i];
        testsToRun.push(obj);
      }
    }
  }

  for (let test in testsToRun) {
    let testFunction = Object.values(testsToRun[test])[0];
    let testName = Object.keys(testsToRun[test])[0];
    let testResult = _app.runTest(testFunction);
    counter++;

    if (testResult.pass === true) {
      console.log("\x1b[32m%s\x1b[0m", testName);
      successes++;
    }

    if (testResult.pass === false) {
      errors.push({
        name: testName,
        error: testResult.error
      });
      console.log("\x1b[31m%s\x1b[0m", testName);
    }

    if (counter == limit) {
      _app.produceTestReport(limit, successes, errors);
    }
  }
};

// Product a test outcome report
_app.produceTestReport = function(limit, successes, errors) {
  console.log("");
  console.log("--------BEGIN TEST REPORT--------");
  console.log("");
  console.log("Total Tests: ", limit);
  console.log("Pass: ", successes);
  console.log("Fail: ", errors.length);
  console.log("");

  // If there are errors, print them in detail
  if (errors.length > 0) {
    console.log("--------BEGIN ERROR DETAILS--------");
    console.log("");
    errors.forEach(function(testError) {
      console.log("\x1b[31m%s\x1b[0m", testError.name);
      console.log(testError.error);
      console.log("");
    });
    console.log("");
    console.log("--------END ERROR DETAILS--------");
  }
  console.log("");
  console.log("--------END TEST REPORT--------");
  process.exit(0);
};

// Run the tests
_app.callTests();
