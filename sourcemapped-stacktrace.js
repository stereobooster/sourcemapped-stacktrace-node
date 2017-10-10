/*
 * sourcemapped-stacktrace.js
 * created by James Salter <iteration@gmail.com> (2014)
 *
 * https://github.com/novocaine/sourcemapped-stacktrace
 *
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// note we only include source-map-consumer, not the whole source-map library,
// which includes gear for generating source maps that we don't need

// TODO: place those function to browser specific file
// function isChromeOrEdge() {
//   return navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
// }

// function isFirefox() {
//   return navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
// }

// function isSafari() {
//   return navigator.userAgent.toLowerCase().indexOf("safari") > -1;
// }

// function isIE11Plus() {
//   return document.documentMode && document.documentMode >= 11;
// }

require("es6-promise").polyfill();
require("isomorphic-fetch");
const SourceMapConsumer = require("source-map").SourceMapConsumer;

const global_mapForUri = {};

const Fetcher = function(done, opts) {
  this.sem = 0;
  this.mapForUri = opts && opts.cacheGlobally ? global_mapForUri : {};
  // replace with a promise
  this.done = done;
};

Fetcher.prototype.fetchScript = function(uri) {
  if (this.mapForUri[uri]) {
    return;
  }
  this.sem++;
  this.mapForUri[uri] = null;

  fetch(uri).then(response => {
    this.onScriptLoad(response, uri);
  });
};

const absUrlRegex = new RegExp("^(?:[a-z]+:)?//", "i");

Fetcher.prototype.onScriptLoad = async function(response, uri) {
  if (response.status === 200 || uri.slice(0, 7) === "file://") {
    // find .map in file.
    //
    // attempt to find it at the very end of the file, but tolerate trailing
    // whitespace inserted by some packers.
    const responseText = await response.text();
    const match = responseText.match("//# [s]ourceMappingURL=(.*)[\\s]*$", "m");
    if (match && match.length === 2) {
      // get the map
      let mapUri = match[1];

      const embeddedSourceMap = mapUri.match(
        "data:application/json;(charset=[^;]+;)?base64,(.*)"
      );

      if (embeddedSourceMap && embeddedSourceMap[2]) {
        this.mapForUri[uri] = new SourceMapConsumer(atob(embeddedSourceMap[2]));
        this.done(this.mapForUri);
      } else {
        if (!absUrlRegex.test(mapUri)) {
          // relative url; according to sourcemaps spec is 'source origin'
          const lastSlash = uri.lastIndexOf("/");
          if (lastSlash !== -1) {
            const origin = uri.slice(0, lastSlash + 1);
            mapUri = origin + mapUri;
            // note if lastSlash === -1, actual script uri has no slash
            // somehow, so no way to use it as a prefix... we give up and try
            // as absolute
          }
        }

        fetch(mapUri).then(response => {
          this.sem--;
          if (response.status === 200 || mapUri.slice(0, 7) === "file://") {
            that.mapForUri[uri] = new SourceMapConsumer(response.text());
          }
          if (this.sem === 0) {
            this.done(that.mapForUri);
          }
        });
      }
    } else {
      // no map
      this.sem--;
    }
  } else {
    // HTTP error fetching uri of the script
    this.sem--;
  }

  if (this.sem === 0) {
    this.done(this.mapForUri);
  }
};

function processSourceMaps(lines, rows, mapForUri, opts) {
  const result = [];
  let map;
  for (let i = 0; i < lines.length; i++) {
    const row = rows[i];
    if (row) {
      const uri = row[1];
      const line = parseInt(row[2], 10);
      const column = parseInt(row[3], 10);
      map = mapForUri[uri];

      if (map) {
        // we think we have a map for that uri. call source-map library
        const origPos = map.originalPositionFor({ line: line, column: column });
        result.push(
          formatOriginalPosition(
            origPos.source,
            origPos.line,
            origPos.column,
            origPos.name || origName(lines[i], opts)
          )
        );
      } else {
        // we can't find a map for that url, but we parsed the row.
        // reformat unchanged line for consistency with the sourcemapped
        // lines.
        result.push(
          formatOriginalPosition(uri, line, column, origName(lines[i], opts))
        );
      }
    } else {
      // we weren't able to parse the row, push back what we were given
      result.push(lines[i]);
    }
  }

  return result;
}

function origName(origLine, opts) {
  const match = String(origLine).match(
    opts.isChromeOrEdge || opts.isIE11Plus ? / +at +([^ ]*).*/ : /([^@]*)@.*/
  );
  return match && match[1];
}

function formatOriginalPosition(source, line, column, name) {
  // mimic chrome's format
  return `    at ${name ? name : "(unknown)"} (${source}:${line}:${column})`;
}

/**
 * Re-map entries in a stacktrace using sourcemaps if available.
 *
 * @param {Array} stack - Array of strings from the browser's stack
 *                        representation. Currently only Chrome
 *                        format is supported.
 * @param {function} done - Callback invoked with the transformed stacktrace
 *                          (an Array of Strings) passed as the first
 *                          argument
 * @param {Object} [opts] - Optional options object.
 * @param {Function} [opts.filter] - Filter function applied to each stackTrace line.
 *                                   Lines which do not pass the filter won't be processesd.
 * @param {boolean} [opts.cacheGlobally] - Whether to cache sourcemaps globally across multiple calls.
 */
function mapStackTrace(stack, done, opts) {
  let expected_fields;
  let regex;
  let skip_lines;
  if (opts.isChromeOrEdge || opts.isIE11Plus) {
    regex = /^ +at.+\((.*):([0-9]+):([0-9]+)/;
    expected_fields = 4;
    // (skip first line containing exception message)
    skip_lines = 1;
  } else if (opts.isFirefox || opts.isSafari) {
    regex = /@(.*):([0-9]+):([0-9]+)/;
    expected_fields = 4;
    skip_lines = 0;
  } else {
    throw new Error("unknown browser :(");
  }

  const mapForUri = {};
  const rows = {};

  const fetcher = new Fetcher(() => {
    const result = processSourceMaps(lines, rows, fetcher.mapForUri, opts);
    done(result);
  }, opts);

  const lines = stack.split("\n").slice(skip_lines);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (opts && opts.filter && !opts.filter(line)) continue;

    const fields = line.match(regex);
    if (fields && fields.length === expected_fields) {
      rows[i] = fields;
      const uri = fields[1];
      if (!uri.match(/<anonymous>/)) {
        fetcher.fetchScript(uri);
      }
    }
  }

  // if opts.cacheGlobally set, all maps could have been cached already,
  // thus we need to call done callback right away
  if (fetcher.sem === 0) {
    fetcher.done(fetcher.mapForUri);
  }
}

exports.default = mapStackTrace;
// TODO: change to rollup https://github.com/rollup/rollup-starter-lib
// export default mapStackTrace;
