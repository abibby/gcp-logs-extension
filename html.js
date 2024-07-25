/**
 * @param {string} tagName
 * @param {*} props
 * @returns {HTMLElement}
 */
export function h(tagName, { children, ...props }) {
  const e = document.createElement(tagName);
  for (const [name, value] of Object.entries(props)) {
    e.setAttribute(name, value);
  }
  if (children) {
    if (children instanceof Array) {
      for (const child of children) {
        appendChild(e, child);
      }
    } else {
      appendChild(e, children);
    }
  }
  return e;
}

/**
 *
 * @param {HTMLElement} parent
 * @param {unknown} child
 */
function appendChild(parent, child) {
  if (child instanceof Node) {
    parent.appendChild(child);
  } else {
    parent.appendChild(document.createTextNode(String(child)));
  }
}
