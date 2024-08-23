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

class RequestParams {
  readonly #map: [string, string][] = [];
  public set(key: string, value: string) {
    this.#map.push([key, value]);
  }

  public toString(): string {
    return this.#map
      .map(
        ([key, value]) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(value)
      )
      .join(";");
  }
}

function traceLink(request: Request, project: string): string | undefined {
  const traceHeader = request.response.headers.find(
    (h) => h.name === "x-cloud-trace-context"
  );
  if (!traceHeader) {
    return undefined;
  }
  const buffer = 60 * 1000;
  const startedDateTime = new Date(request.startedDateTime);
  const start = new Date(startedDateTime.getTime() - buffer);
  const end = new Date(startedDateTime.getTime() + request.time + buffer);

  const rp = new RequestParams();
  rp.set("query", `trace="projects/${project}/traces/${traceHeader.value}"`);
  rp.set("cursorTimestamp", startedDateTime.toISOString());
  rp.set("startTime", start.toISOString());
  rp.set("endTime", end.toISOString());

  const url = new URL(
    "https://console.cloud.google.com/logs/query;" + rp.toString()
  );
  url.searchParams.set("project", project);

  return url.toString();
}
// https://console.cloud.google.com/logs/query
//  ;query=trace%3D%22projects%2Fownersbox04%2Ftraces%2F833543b24ecb1f4e7eb9d08bdaabc0c7%22
//  ;cursorTimestamp=2024-07-29T20:02:14.384854Z
//  ;startTime=2024-07-29T20:01:14.296Z
//  ;endTime=2024-07-29T20:03:14.402Z?project=ownersbox04
