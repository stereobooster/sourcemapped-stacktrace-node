const mapStackTrace = require("./mapStackTrace.js").default;
const createNodeResolver = require("./createNodeResolver.js").default;

exports.createNodeResolver = createNodeResolver;
exports.default = (stack, opts) => {
  opts.resolver = opts.resolver || createNodeResolver({});
  return mapStackTrace(stack, opts);
};
