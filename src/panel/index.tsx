import { h, render } from "preact";
import { RequestTable } from "../components/request-table";
import { useRequests } from "../hooks/use-requests";
import { useProject } from "../hooks/use-project";
import { bindValue } from "@zwzn/spicy";

function App() {
  const requests = useRequests();
  const [project, setProject] = useProject();

  return (
    <div>
      <h1>GCP Logs</h1>
      <input type="text" value={project} onInput={bindValue(setProject)} />
      <RequestTable requests={requests} project={project} />
    </div>
  );
}

render(<App />, document.getElementById("app")!);
