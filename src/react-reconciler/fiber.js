import { renderWithHooks } from "./fiber-hooks";

const tags = {
  Root: "ROOT",
  FunctionalComponent: "FunctionalComponent",
  HtmlNode: "HtmlNode",
  TextNode: "TextNode",
};

export function createContainer(container) {
  const root = new Fiber(tags.Root);
  root.ref = container;
  return root;
}

const getTag = (element) => {
  if (typeof element.type === "function") return tags.FunctionalComponent;
  if (typeof element.type === "string") return tags.HtmlNode;
};

const getChild = (element, fiber) => {
  if (typeof element.type === "function") {
    return renderWithHooks(fiber, element.type, element.props);
  }
  if (typeof element.type === "string") {
    if (element.props.children)
      return element.props.children.length > 0
        ? element.props.children
        : element.props.children[0];
  }
};

const createElementFiber = (element) => {
  if (typeof element === "string" || typeof element === "number") {
    return new Fiber(tags.TextNode, element);
  }
  return new Fiber(getTag(element), element.type, element.props);
};

const checkAndAddSiblings = (children, rootFiber) => {
  if (Array.isArray(children) && children.length > 1) {
    const childElement = children[0];
    updateContainer(childElement, rootFiber, false, children.slice(1));
    return true;
  }
};

const addChildFiber = (rootElement, rootFiber) => {
  const children = getChild(rootElement, rootFiber);

  if (!children) {
    rootFiber.completeWork();
    return;
  }
  if (checkAndAddSiblings(children, rootFiber)) return;
  updateContainer(children, rootFiber);
};

export function updateContainer(element, rootFiber, isSibling, siblings) {
  console.log("update container called", { element, rootFiber });
  if (element == null) return rootFiber.completeWork();

  if (checkAndAddSiblings(element, rootFiber)) return;
  const childFiber = createElementFiber(element);

  if (isSibling) {
    rootFiber.sibling = childFiber;
    childFiber.return = rootFiber.return;
  } else {
    rootFiber.child = childFiber;
    childFiber.return = rootFiber;
  }

  if (siblings && siblings.length > 0) {
    updateContainer(siblings[0], childFiber, true, siblings.slice(1));
  }

  addChildFiber(element, childFiber);
}

function Fiber(tag, type, props) {
  this.tag = tag;
  this.type = type || null;
  this.props = props || null;

  switch (tag) {
    case tags.TextNode:
      this.ref = document.createTextNode(type);
      this.displayName = type;
      break;

    case tags.HtmlNode:
      this.displayName = type;
      this.ref = document.createElement(this.type);

      Object.keys(props)
        .filter((k) => k !== "children")
        .forEach((k) => {
          this.ref[k] = props[k];
        });
      break;
    case tags.FunctionalComponent:
      this.displayName = type.name;
      break;
  }
}

Fiber.prototype.beginWork = function () {
  this.completed = false;
};

Fiber.prototype.completeWork = function () {
  console.log("complete work", this.displayName);

  if (this.completed) return;
  switch (this.tag) {
    // case tags.HtmlNode:
    // case tags.TextNode:
    //   if (this.ref && this.child) {
    //     appendChildren(this, this.child);
    //   }
    //   break;
    case tags.FunctionalComponent:
      this.ref = this.child?.ref;
      break;

    // case tags.Root:
    //   this.ref.appendChild(this.child.ref);
    //   break;
  }

  this.completed = true;

  if (allSiblingsCompleted(this)) {
    if (this.return) {
      appendChildren(this.return, this);
      this.return.completeWork();
    }
  }
};

Fiber.prototype.update = function () {
  switch (this.tag) {
    case tags.FunctionalComponent:
      this.ref.remove();
      this.completed = false;
      console.log("fiber update called");
      const children = renderWithHooks(this, this.type, this.props);
      console.log("fiber update", { children });
      updateContainer(children, this);
      break;
  }
};

const appendChildren = (rootFiber, childFiber) => {
  if (rootFiber.tag === tags.FunctionalComponent) return;

  let lastChild = childFiber;

  while (lastChild) {
    rootFiber.ref.appendChild(lastChild.ref);
    lastChild = lastChild.sibling;
  }
};

const allSiblingsCompleted = (fiber) => {
  const parent = fiber.return;

  if (!parent) return true;
  let lastChild = parent.child;

  while (lastChild) {
    if (!lastChild.completed) {
      return false;
    }
    lastChild = lastChild.sibling;
  }
  return true;
};
