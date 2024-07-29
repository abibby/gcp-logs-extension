import { useEffect, useState } from "preact/hooks";

type Request = chrome.devtools.network.Request;
export function useRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  useEffect(() => {
    function onRequests(requests: Request[]) {
      setRequests(requests);
    }

    const requestsPort = chrome.runtime.connect({ name: "requests" });
    requestsPort.onMessage.addListener(onRequests);
    return () => {
      requestsPort.onMessage.removeListener(onRequests);
      requestsPort.disconnect();
    };
  }, []);

  return requests;
}
