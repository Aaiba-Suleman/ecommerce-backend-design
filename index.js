const app = require("./server");

// Tell Vercel to use Express app
module.exports = (req, res) => {
  app(req, res);
};
