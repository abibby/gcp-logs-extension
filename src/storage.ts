type EvaluationExceptionInfo =
  chrome.devtools.inspectedWindow.EvaluationExceptionInfo;

export async function getProject(): Promise<string> {
  return localStorage.getItem(await key()) ?? "";
}

export async function setProject(project: string): Promise<void> {
  localStorage.setItem(await key(), project);
}

/**
 * @returns {Promise<string>}
 */
async function key() {
  const href = await windowHref();
  const url = new URL(href);
  return `project-${url.origin}`;
}

let getHrefPromise: Promise<string> | undefined;

export function windowHref(): Promise<string> {
  if (getHrefPromise === undefined) {
    getHrefPromise = windowEval(() => location.href);
  }
  return getHrefPromise;
}

class EvalError extends Error {
  constructor(public readonly cause: EvaluationExceptionInfo) {
    super(cause.description);
  }
}

function windowEval<T>(cb: () => T, ...args: unknown[]): Promise<T> {
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
