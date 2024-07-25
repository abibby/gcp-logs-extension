// @ts-check

/**
 * @returns {Promise<string>}
 */
export async function getProject() {
  return localStorage.getItem(await key()) ?? "";
}

/**
 * @returns {Promise<void>}
 */
export async function setProject(project) {
  localStorage.setItem(await key(), project);
}

/**
 * @returns {Promise<string>}
 */
async function key() {
  const href = await evalWindow(() => location.href);
  const url = new URL(href);
  return `project-${url.origin}`;
}

/**
 * @template T
 * @param {() => T} cb
 * @param {unknown[]} args
 * @returns {Promise<T>}
 */
function evalWindow(cb, ...args) {
  return new Promise((resolve, reject) => {
    const src = `(${cb.toString()})(...${JSON.stringify(args)})`;
    chrome.devtools.inspectedWindow.eval(src, (result, err) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
