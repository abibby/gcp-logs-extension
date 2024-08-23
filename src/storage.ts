type EvaluationExceptionInfo =
  chrome.devtools.inspectedWindow.EvaluationExceptionInfo;

export async function getProject(): Promise<string> {
  return windowEval(async () => {
    return localStorage.getItem(`gcp-logs-project-${location.href}`) ?? "";
  });
}

export async function setProject(project: string): Promise<void> {
  return windowEval(async (project: string) => {
    localStorage.setItem(`gcp-logs-project-${location.href}`, project);
  }, project);
}

class EvalError extends Error {
  constructor(public readonly cause: EvaluationExceptionInfo) {
    super(cause.description);
  }
}

function windowEval<R, A extends unknown[]>(
  cb: (...args: A) => R,
  ...args: A
): Promise<R> {
  return new Promise((resolve, reject) => {
    const src = `(${cb.toString()})(...${JSON.stringify(args)})`;
    chrome.devtools.inspectedWindow.eval(src, (result, err) => {
      if (err) {
        reject(new EvalError(err));
      } else {
        resolve(result as any);
      }
    });
  });
}
