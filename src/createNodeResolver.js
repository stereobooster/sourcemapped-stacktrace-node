// require("es6-promise").polyfill();
const fetch = require('cross-fetch');

const defaultFsFetcher = require("./fsFetcher.js").default;
const createResolver = require("./createResolver.js").default;

const createNodeResolver = ({
  uriFetcher = fetch,
  fsFetcher = defaultFsFetcher,
  store = {}
}) =>
  createResolver({
    uriFetcher,
    fsFetcher,
    store
  });

exports.default = createNodeResolver;
