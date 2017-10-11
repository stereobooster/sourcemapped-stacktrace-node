require("es6-promise").polyfill();
require("isomorphic-fetch");

exports.createDefaultUriResolver = require("./index.js").createDefaultUriResolver;
exports.default = require("./index.js").default;