import { h } from "preact";
import styles from "./request-table.module.css";

type Request = chrome.devtools.network.Request;

type RequestTableProps = {
  requests: Request[];
  project: string;
};

export function RequestTable({ requests, project }: RequestTableProps) {
  return (
    <table class={styles.table}>
      <thead>
        <tr>
          <th>Path</th>
          <th>Status</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => {
          const url = new URL(request.request.url);
          const link = traceLink(request, project);
          return (
            <tr key={request.startedDateTime + request.request.url}>
              <td>{url.pathname}</td>
              <td>{request.response.status}</td>
              <td>
                {link && (
                  <a href={link} target="_blank">
                    trace
                  </a>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function traceLink(request: Request, project: string): string | undefined {
  const traceHeader = request.response.headers.find(
    (h) => h.name === "x-cloud-trace-context"
  );
  if (!traceHeader) {
    return undefined;
  }
  return (
    "https://console.cloud.google.com/logs/query;query=" +
    encodeURIComponent(
      `trace="projects/${project}/traces/${traceHeader.value}"`
    ) +
    `?project=${encodeURIComponent(project)}`
  );
}
