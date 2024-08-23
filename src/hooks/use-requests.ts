import { useState } from "preact/hooks";
import { usePort } from "./use-port";

type Request = chrome.devtools.network.Request;
export function useRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const requestsPort = usePort<Request[]>("requests");
  requestsPort.useMessages((requests) => {
    setRequests(requests);
  }, []);
  return requests;
}
