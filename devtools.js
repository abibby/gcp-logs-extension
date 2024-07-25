// @ts-check

/** @type {chrome.devtools.network.Request[]} */
const requests = [];

/** @type {Set<chrome.runtime.Port>} */
const requestPorts = new Set();

chrome.devtools.panels.create(
  "GCP Logs",
  "icon.png",
  "panel.html",
  function (panel) {}
);

chrome.devtools.network.onNavigated.addListener(function () {
  requests.length = 0;

  for (const port of requestPorts) {
    port.postMessage(requests);
  }
});
chrome.devtools.network.onRequestFinished.addListener(function (request) {
  const traceHeader = request.response.headers.find(
    (h) => h.name === "x-cloud-trace-context"
  );
  if (traceHeader === undefined) {
    return;
  }
  requests.push(request);
  for (const port of requestPorts) {
    port.postMessage(requests);
  }
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "requests") {
    return;
  }

  requestPorts.add(port);
  port.onDisconnect.addListener(() => {
    requestPorts.delete(port);
  });
  setTimeout(() => {
    port.postMessage(requests);
  }, 200);
});
