import { useCallback, useEffect, useState } from "preact/hooks";
import { getProject, setProject } from "../storage";

export function useProject(): [string, (v: string) => void] {
  const [projectState, setProjectState] = useState("");
  const saveProject = useCallback((project: string) => {
    setProjectState(project);
    setProject(project);
  }, []);
  useEffect(() => {
    getProject().then((project) => setProjectState(project));
  }, []);
  return [projectState, saveProject];
}
