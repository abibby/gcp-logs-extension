// @ts-check

import { getProject, setProject } from "./storage.js";
import { h } from "./html.js";

/** @type {HTMLElement} */
// @ts-ignore
const requestTable = document.getElementById("request-table");

/** @type {HTMLInputElement} */
// @ts-ignore
const projectInput = document.getElementById("project");

projectInput?.addEventListener("change", () => {
  setProject(projectInput.value);
  updateTable();
});

getProject().then((p) => {
  projectInput.value = p;
});

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
 * @param {chrome.devtools.network.Request} request
 * @returns {HTMLElement|string}
 */
function traceLink(request) {
  const project = projectInput.value;
  const traceHeader = request.response.headers.find(
    (h) => h.name === "x-cloud-trace-context"
  );
  if (!traceHeader) {
    return "n/a";
  }
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

/** @type {chrome.devtools.network.Request[]} */
let requests = [];

function updateTable() {
  requestTable.innerHTML = "";
  for (const request of requests) {
    addRow([request.request.url, request.response.status, traceLink(request)]);
  }
}

/**
 *
 * @param {chrome.devtools.network.Request[]} r
 * @returns
 */
async function onRequests(r) {
  requests = r;
  updateTable();
}

const requestsPort = chrome.runtime.connect({ name: "requests" });
requestsPort.onMessage.addListener(onRequests);
