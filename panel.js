// @ts-check

import { h } from "./html";

const requestTable =
  document.getElementById("request-table") || document.createElement("tbody");

/**
 * @param {Array<string|number|HTMLElement>} row
 */
function addRow(row) {
  const tr = document.createElement("tr");

  for (const cell of row) {
    const td = document.createElement("td");
    if (cell instanceof HTMLElement) {
      td.appendChild(cell);
    } else {
      td.innerText = String(cell);
    }
    tr.appendChild(td);
  }

  requestTable.appendChild(tr);
}

/**
 *
 * @param {chrome.devtools.network.Request} request
 * @returns {HTMLElement|string}
 */
function traceLink(request) {
  const traceHeader = request.response.headers.find(
    (h) => h.name === "x-cloud-trace-context"
  );
  if (!traceHeader) {
    return "n/a";
  }
  const project = "ownersbox07";
  return h("a", {
    href:
      "https://console.cloud.google.com/logs/query;query=" +
      encodeURIComponent(
        `trace="projects/${project}/traces/${traceHeader.value}"`
      ) +
      `?project=${encodeURIComponent(project)}`,
    target: "_blank",
    children: "link",
  });
}

/**
 *
 * @param {chrome.devtools.network.Request[]} requests
 * @returns
 */
function onRequests(requests) {
  requestTable.innerHTML = "";
  for (const request of requests) {
    addRow([request.request.url, request.response.status, traceLink(request)]);
  }
}

const port = chrome.runtime.connect({ name: "requests" });
port.onMessage.addListener(onRequests);
