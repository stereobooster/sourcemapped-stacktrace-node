const mapStackTrace = require("../src/indexNode.js").default;
const createNodeResolver = require("../src/indexNode.js").createNodeResolver;
const uriFetcher = require("./testFetcher.js").uriFetcher;
const fsFetcher = require("./testFetcher.js").fsFetcher;
const testResolver = createNodeResolver({ uriFetcher, fsFetcher });

const chromeTrace = `Error: bork from es6
    at BabelBorker.bork (http://novocaine.github.io/sourcemapped-stacktrace-demo/public_html/bork.babel.js:15:19)
    at window.babel_bork (http://novocaine.github.io/sourcemapped-stacktrace-demo/public_html/bork.babel.js:23:30)
    at errorAndPrint (http://novocaine.github.io/sourcemapped-stacktrace-demo/public_html/smst.html:37:11)
    at HTMLButtonElement.onclick (http://novocaine.github.io/sourcemapped-stacktrace-demo/public_html/smst.html:16:61)`;

const chromeMapedTrace = `    at BabelBorker.bork (bork.es6:3:14)
    at window.babel_bork (bork.es6:7:44)
    at errorAndPrint (http://novocaine.github.io/sourcemapped-stacktrace-demo/public_html/smst.html:37:11)
    at HTMLButtonElement.onclick (http://novocaine.github.io/sourcemapped-stacktrace-demo/public_html/smst.html:16:61)`;

test("works for chrome trace", done => {
  mapStackTrace(chromeTrace, {
    isChromeOrEdge: true,
    resolver: testResolver
  }).then(result => {
    expect(result).toBe(chromeMapedTrace);
    done();
  });
});

const puppeteerTrace = `Error: TypeError: Cannot read property 'resize' of undefined
    at e.resize (http://localhost:45678/static/js/main.6d5a67e2.js:1:450823)
    at new e (http://localhost:45678/static/js/main.6d5a67e2.js:1:448489)
    at s.componentDidMount (http://localhost:45678/static/js/main.6d5a67e2.js:1:642286)
    at commitLifeCycles (http://localhost:45678/static/js/main.6d5a67e2.js:1:556593)
    at n (http://localhost:45678/static/js/main.6d5a67e2.js:1:560698)
    at u (http://localhost:45678/static/js/main.6d5a67e2.js:1:562365)
    at c (http://localhost:45678/static/js/main.6d5a67e2.js:1:562808)
    at m (http://localhost:45678/static/js/main.6d5a67e2.js:1:564831)
    at d (http://localhost:45678/static/js/main.6d5a67e2.js:1:564340)
    at Object.updateContainer (http://localhost:45678/static/js/main.6d5a67e2.js:1:630809)
    at Page._handleException (/mapbox-prerender/node_modules/puppeteer/lib/Page.js:295:38)
    at Session.Page.client.on.exception (/mapbox-prerender/node_modules/puppeteer/lib/Page.js:86:60)
    at emitOne (events.js:115:13)
    at Session.emit (events.js:210:7)
    at Session._onMessage (/mapbox-prerender/node_modules/puppeteer/lib/Connection.js:199:12)
    at Connection._onMessage (/mapbox-prerender/node_modules/puppeteer/lib/Connection.js:98:19)
    at emitOne (events.js:115:13)
    at WebSocket.emit (events.js:210:7)
    at Receiver._receiver.onmessage (/mapbox-prerender/node_modules/ws/lib/WebSocket.js:143:47)
    at Receiver.dataMessage (/mapbox-prerender/node_modules/ws/lib/Receiver.js:389:14)`;

const puppeteerMappedTrace = `    at resize (../node_modules/mapbox-gl/dist/mapbox-gl.js:398:5239)
    at resize (../node_modules/mapbox-gl/dist/mapbox-gl.js:398:2910)
    at s.componentDidMount (../node_modules/react-mapbox-gl/lib/map.js:139:0)
    at componentDidMount (../node_modules/react-dom/cjs/react-dom.production.min.js:169:71)
    at Nh (../node_modules/react-dom/cjs/react-dom.production.min.js:180:195)
    at c (../node_modules/react-dom/cjs/react-dom.production.min.js:183:347)
    at k (../node_modules/react-dom/cjs/react-dom.production.min.js:184:366)
    at p (../node_modules/react-dom/cjs/react-dom.production.min.js:188:389)
    at y (../node_modules/react-dom/cjs/react-dom.production.min.js:187:415)
    at c (../node_modules/react-dom/cjs/react-dom.production.min.js:248:42)
    at Page._handleException (/mapbox-prerender/node_modules/puppeteer/lib/Page.js:295:38)
    at Session.Page.client.on.exception (/mapbox-prerender/node_modules/puppeteer/lib/Page.js:86:60)
    at emitOne (events.js:115:13)
    at Session.emit (events.js:210:7)
    at Session._onMessage (/mapbox-prerender/node_modules/puppeteer/lib/Connection.js:199:12)
    at Connection._onMessage (/mapbox-prerender/node_modules/puppeteer/lib/Connection.js:98:19)
    at emitOne (events.js:115:13)
    at WebSocket.emit (events.js:210:7)
    at Receiver._receiver.onmessage (/mapbox-prerender/node_modules/ws/lib/WebSocket.js:143:47)
    at Receiver.dataMessage (/mapbox-prerender/node_modules/ws/lib/Receiver.js:389:14)`;

test("works for puppeteer trace", done => {
  mapStackTrace(puppeteerTrace, {
    isChromeOrEdge: true,
    resolver: testResolver
  }).then(result => {
    expect(result).toBe(puppeteerMappedTrace);
    done();
  });
});

const puppeteerDoubleMappedTrace = `    at resize (src/ui/map.js:508:8)
    at pitch (src/ui/map.js:331:31)
    at s.componentDidMount (../node_modules/react-mapbox-gl/lib/map.js:139:0)
    at componentDidMount (../node_modules/react-dom/cjs/react-dom.production.min.js:169:71)
    at Nh (../node_modules/react-dom/cjs/react-dom.production.min.js:180:195)
    at c (../node_modules/react-dom/cjs/react-dom.production.min.js:183:347)
    at k (../node_modules/react-dom/cjs/react-dom.production.min.js:184:366)
    at p (../node_modules/react-dom/cjs/react-dom.production.min.js:188:389)
    at y (../node_modules/react-dom/cjs/react-dom.production.min.js:187:415)
    at c (../node_modules/react-dom/cjs/react-dom.production.min.js:248:42)
    at Page._handleException (/mapbox-prerender/node_modules/puppeteer/lib/Page.js:295:38)
    at Session.Page.client.on.exception (/mapbox-prerender/node_modules/puppeteer/lib/Page.js:86:60)
    at emitOne (events.js:115:13)
    at Session.emit (events.js:210:7)
    at Session._onMessage (/mapbox-prerender/node_modules/puppeteer/lib/Connection.js:199:12)
    at Connection._onMessage (/mapbox-prerender/node_modules/puppeteer/lib/Connection.js:98:19)
    at emitOne (events.js:115:13)
    at WebSocket.emit (events.js:210:7)
    at Receiver._receiver.onmessage (/mapbox-prerender/node_modules/ws/lib/WebSocket.js:143:47)
    at Receiver.dataMessage (/mapbox-prerender/node_modules/ws/lib/Receiver.js:389:14)`;

test("works for puppeteer trace - double", done => {
  mapStackTrace(`dummy\n${puppeteerMappedTrace}`, {
    isChromeOrEdge: true,
    resolver: testResolver
  }).then(result => {
    expect(result).toBe(puppeteerDoubleMappedTrace);
    done();
  });
});

const typeScriptTrace = `Error: SyntaxError: Unexpected token < in JSON at position 0
    at http://localhost:45678/static/js/0.81dd690f.chunk.js:1:3016
    at r (http://localhost:45678/static/js/0.81dd690f.chunk.js:1:1684)
    at Object.next (http://localhost:45678/static/js/0.81dd690f.chunk.js:1:1019)
    at r (http://localhost:45678/static/js/0.81dd690f.chunk.js:1:1175)
    at Object.next (http://localhost:45678/static/js/0.81dd690f.chunk.js:1:1019)
    at c (http://localhost:45678/static/js/0.81dd690f.chunk.js:1:761)
    at <anonymous>`;

const typeScriptMapedTrace = `    at json (pages/InsightsPage.tsx:58:32)
    at call (../static/js/0.81dd690f.chunk.js:61:22)
    at step (../static/js/0.81dd690f.chunk.js:42:52)
    at call (../static/js/0.81dd690f.chunk.js:46:96)
    at step (../static/js/0.81dd690f.chunk.js:42:52)
    at next (../static/js/0.81dd690f.chunk.js:33:57)
    at <anonymous>`;

test("works for TypeScript trace", done => {
  mapStackTrace(typeScriptTrace, {
    isChromeOrEdge: true,
    resolver: testResolver
  }).then(result => {
    expect(result).toBe(typeScriptMapedTrace);
    done();
  });
});

const newKeywordTrace = `[Error: Error: Map container is already initialized.
  at t._initContainer (http://localhost:45678/static/js/main.c9e3855f.js:1:643360)
  at t.initialize (http://localhost:45678/static/js/main.c9e3855f.js:1:632349)
  at new t (http://localhost:45678/static/js/main.c9e3855f.js:1:608947)
  at Object.e.map (http://localhost:45678/static/js/main.c9e3855f.js:1:745755)
  at t.componentDidMount (http://localhost:45678/static/js/main.c9e3855f.js:1:606131)
  at commitLifeCycles (http://localhost:45678/static/js/main.c9e3855f.js:1:214171)
  at E (http://localhost:45678/static/js/main.c9e3855f.js:1:201972)
  at w (http://localhost:45678/static/js/main.c9e3855f.js:1:200782)
  at _ (http://localhost:45678/static/js/main.c9e3855f.js:1:200313)
  at b (http://localhost:45678/static/js/main.c9e3855f.js:1:200150)]`;

const newKeywordMapedTrace = `    at t._initContainer (../node_modules/leaflet/dist/leaflet-src.js:4013:0)
    at _initContainer (../node_modules/leaflet/dist/leaflet-src.js:3089:0)
    at apply (../node_modules/leaflet/dist/leaflet-src.js:301:0)
    at Object.e.map (../node_modules/leaflet/dist/leaflet-src.js:4626:0)
    at t.componentDidMount (components/InteractiveMap.tsx:34:19)
    at componentDidMount (../node_modules/react-dom/cjs/react-dom.production.min.js:159:12)
    at hg (../node_modules/react-dom/cjs/react-dom.production.min.js:185:0)
    at R (../node_modules/react-dom/cjs/react-dom.production.min.js:182:154)
    at G (../node_modules/react-dom/cjs/react-dom.production.min.js:181:376)
    at x (../node_modules/react-dom/cjs/react-dom.production.min.js:181:220)`;

test("works for new keyword", done => {
  mapStackTrace(newKeywordTrace, {
    isChromeOrEdge: true,
    resolver: testResolver
  }).then(result => {
    console.log(result)
    expect(result).toBe(newKeywordMapedTrace);
    done();
  });
});
