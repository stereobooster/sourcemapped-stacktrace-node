const mapStackTrace = require("../src/index-node.js").default;
const createDefaultUriResolver = require("../src/index-node.js")
  .createDefaultUriResolver;
const testFetcher = require("./testFetcher.js").default;
const testResolver = createDefaultUriResolver(testFetcher);

const stacktrace = `Error: bork from es6
    at BabelBorker.bork (http://novocaine.github.io/sourcemapped-stacktrace-demo/public_html/bork.babel.js:15:19)
    at window.babel_bork (http://novocaine.github.io/sourcemapped-stacktrace-demo/public_html/bork.babel.js:23:30)
    at errorAndPrint (http://novocaine.github.io/sourcemapped-stacktrace-demo/public_html/smst.html:37:11)
    at HTMLButtonElement.onclick (http://novocaine.github.io/sourcemapped-stacktrace-demo/public_html/smst.html:16:61)`;

const mapedStackTrace = `    at BabelBorker.bork (bork.es6:3:14)
    at window.babel_bork (bork.es6:7:44)
    at errorAndPrint (http://novocaine.github.io/sourcemapped-stacktrace-demo/public_html/smst.html:37:11)
    at HTMLButtonElement.onclick (http://novocaine.github.io/sourcemapped-stacktrace-demo/public_html/smst.html:16:61)`;

// TODO: provide tests for different browsers
// TDOD: write tests that would run inside browser
test("works for chrome trace", done => {
  mapStackTrace(stacktrace, {
    isChromeOrEdge: true,
    uriResolver: testResolver
  }).then(result => {
    expect(result).toBe(mapedStackTrace);
    done();
  });
});
