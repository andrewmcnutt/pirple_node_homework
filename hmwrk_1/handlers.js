const handlers = {
  hello: (data, callback) => {
    callback(200, { message: "hello there!" });
  },
  notFound: (data, callback) => {
    callback(404);
  }
};

module.exports = handlers;
