import { createContainer, updateContainer } from "../react-reconciler/fiber";

function DOMRoot(container) {
  this.root = createContainer(container);

  this.render = (children) => {
    updateContainer(children, this.root);
  };
}

export default function (container) {
  const root = new DOMRoot(container);
  window.root = root;
  return root;
}
