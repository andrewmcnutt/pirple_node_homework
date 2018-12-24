const StringDecoder = require("string_decoder").StringDecoder;
const url = require("url");
const router = require("./router");
const handlers = require("./handlers");

const unifiedServer = function(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const queryStringObject = parsedUrl.query;
  const method = req.method.toLowerCase();
  const headers = req.headers;
  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", function(data) {
    buffer += decoder.write(data);
  });

  req.on("end", function() {
    buffer += decoder.end();

    const chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, function(statusCode, payload) {
      statusCode = typeof statusCode == "number" ? statusCode : 200;
      payload = typeof payload == "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log("Returning this response: ", statusCode, payloadString);
    });
  });
};

module.exports = unifiedServer;
