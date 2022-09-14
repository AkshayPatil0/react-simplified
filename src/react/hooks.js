import Dispatcher from "./dispatcher";

export function useState(initialState) {
  return Dispatcher.current.useState(initialState);
}
