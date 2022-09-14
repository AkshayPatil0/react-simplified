export default function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children?.length > 1 ? children : children[0],
    },
  };
}
