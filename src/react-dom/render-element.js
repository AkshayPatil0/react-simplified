const render = (element) => {
  if (typeof element === "string" || typeof element === "number")
    return document.createTextNode(element);
  if (typeof element === "object") {
    if (typeof element.type === "string") {
      const node = document.createElement(element.type);

      Object.keys(element.props)
        .filter((k) => k !== "children")
        .forEach((k) => {
          node[k] = element.props[k];
        });

      if (element.props.children.length > 0) {
        element.props.children.forEach((child) => {
          node.appendChild(render(child));
        });
      }

      return node;
    }
  }
};
export default render;
