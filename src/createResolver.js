const falseFetcher = require("./falseFetcher.js").default;

const createResolver = ({ uriFetcher, fsFetcher, store }) => {
  return uri => {
    if (store[uri]) {
      return store[uri];
    }

    if (uri.match(/<anonymous>/)) {
      return (store[uri] = falseFetcher(uri));
    }

    // TODO need more heuristic here
    // if it starts as from http://, https://, file://
    // if it starts from ../node_modules (webpack thing)
    // use referer to try restor path
    if (uri.match(/^\.\.\/node_modules/)) {
      uri = uri.replace("../", "");
      return (store[uri] = fsFetcher(uri));
    }

    if (uri.match(/node_modules/)) {
      return (store[uri] = falseFetcher(uri));
    }

    if (uri.indexOf("/") === -1) {
      return (store[uri] = falseFetcher(uri));
    }

    let result;

    try {
      result = uriFetcher(uri).then(response => {
        if (response.status === 200) {
          return response.text();
        } else {
          console.log(`${uri}: ${response}`);
          // ignore error
          return false;
        }
      });
    } catch (e) {
      console.log(`${uri}: ${e}`);
      result = falseFetcher(uri);
    }

    return (store[uri] = result);
  };
};

exports.default = createResolver;
