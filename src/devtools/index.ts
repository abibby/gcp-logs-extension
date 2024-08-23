type DTRequest = chrome.devtools.network.Request;
type DTPort = chrome.runtime.Port;

const requests: DTRequest[] = [];

const requestPorts = new Set<DTPort>();

chrome.devtools.panels.create(
  "GCP Logs",
  "icon.png",
  "src/panel/index.html",
  function (panel) {}
);

chrome.devtools.network.onNavigated.addListener(function () {
  requests.length = 0;

  for (const port of requestPorts) {
    port.postMessage(requests);
  }
});

chrome.devtools.network.onRequestFinished.addListener(function (
  request: DTRequest
) {
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
  }, 100);
});
