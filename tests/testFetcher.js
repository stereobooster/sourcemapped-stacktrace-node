const networkStubs = {
  "http://novocaine.github.io/sourcemapped-stacktrace-demo/public_html/bork.babel.js": `"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class asa function"); } }

var BabelBorker = function () {
    function BabelBorker() {
        _classCallCheck(this, BabelBorker);
    }

    _createClass(BabelBorker, [{
        key: "bork",
        value: function bork() {
            throw new Error("bork from es6");
        }
    }]);

    return BabelBorker;
}();

window.babel_bork = function () {
    return new BabelBorker().bork();
};

\/\/# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJvcmsuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFNLFc7Ozs7Ozs7K0JBQ0s7QUFDSCxrQkFBTSxJQUFJLEtBQUosQ0FBVSxlQUFWLENBQU47QUFDSDs7Ozs7O0FBR0wsT0FBTyxVQUFQLEdBQW9CO0FBQUEsV0FBTSxJQUFJLFdBQUosR0FBa0IsSUFBbEIsRUFBTjtBQUFBLENBQXBCIiwiZmlsZSI6InN0ZG91dCIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEJhYmVsQm9ya2VyIHtcbiAgICBib3JrKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJib3JrIGZyb20gZXM2XCIpO1xuICAgIH1cbn1cblxud2luZG93LmJhYmVsX2JvcmsgPSAoKSA9PiBuZXcgQmFiZWxCb3JrZXIoKS5ib3JrKClcbiJdfQ==
`,
  "http://novocaine.github.io/sourcemapped-stacktrace-demo/public_html/smst.html": `<!DOCTYPE html>
<html>
  <!--<script type="text/javascript"
    src="https://rawgithub.com/novocaine/sourcemapped-stacktrace/master/dist/sourcemapped-stacktrace.js"></script>-->
  <script type="text/javascript" src="sourcemapped-stacktrace.js"></script>
  <script type="text/javascript" src="bork_coffee.js"></script>
  <script type="text/javascript" src="bork.babel.js"></script>
<body>
  <p>A demo of printing a stack trace from an error thrown within transpiled
    code.
  </p>

  <button type="button" onclick="errorAndPrint(coffee_bork)">
    Throw an error in sourcemapped code from coffeescript
  </button>
  <button type="button" onclick="errorAndPrint(babel_bork)">
    Throw an error in sourcemapped code from babel
  </button>

  <p>Source-mapped Stack trace (pointing to original code):</p>

  <pre id="mapped">
  </pre>

  <p>Unmapped Stack trace (pointing to transpiled code):</p>

  <pre id="unmapped">
  </pre>

  <p>Alternatively, try throwing and not catching, to compare the trace in your
  browser's console: </p>
  <button type="button" onclick="coffee_bork()">Throw uncaught</button>

    <script type="text/javascript">
      var errorAndPrint = function(bork_func) {
        try {
          bork_func();
        } catch (e) {
          // display unmapped trace
          var unmapped = document.getElementById("unmapped");
          unmapped.innerHTML = "";
          var unmappedNode = document.createTextNode(e.stack);
          unmapped.appendChild(unmappedNode);

          // invoke smst
          sourceMappedStackTrace.mapStackTrace(e.stack, function(mappedStack) {
            // mappedStack is an array of strings, one per frame in e.stack
            var mappedElem = document.getElementById("mapped");
            mappedElem.innerHTML = "";
            var textNode = document.createTextNode(e.message + "\n" +
              mappedStack.join("\n"));
            mappedElem.appendChild(textNode);
          });
        }
      }
    </script>

</body>
</html>
`
};

const testFetcher = uri => {
  if (networkStubs[uri])
    return Promise.resolve({
      status: 200,
      text: () => Promise.resolve(networkStubs[uri])
    });

  console.log(uri);
  return fetch(uri);
};

exports.default = testFetcher;
