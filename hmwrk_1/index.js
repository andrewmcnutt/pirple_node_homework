const http = require("http");
const https = require("https");
const config = require("./config");
const unifiedServer = require("./unifiedServer");
const fs = require("fs");

const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem")
};

const httpServer = http.createServer(unifiedServer);
const httpsServer = https.createServer(httpsServerOptions, unifiedServer);

httpServer.listen(config.httpPort, () => {
  console.log(`HTTP port:${config.httpPort} env:${config.envName}`);
});
httpsServer.listen(config.httpsPort, () => {
  console.log(`HTTPS port:${config.httpsPort} env:${config.envName}`);
});
