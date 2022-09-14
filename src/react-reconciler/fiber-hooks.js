import SharedInternals from "../shared/intenals";

const ReactDispatcher = SharedInternals.Dispatcher;

let currentFiber;

let currentHook;

function Hook() {
  this.memorizedState = null;
  this.next = null;
  this.dispatch = null;
}

const HooksDispatcherUpdate = {
  useState: (initialState) => {
    console.log("usestate update called");
    let hook;
    if (!currentHook) {
      hook = currentFiber.memorizedState;
    }
    currentHook = hook;
    const dispatch = hook.dispatch;
    console.log("usestate update", [hook.memorizedState, dispatch]);
    return [hook.memorizedState, dispatch];
  },
};

const mountHook = () => {
  const hook = new Hook();

  if (!currentHook) {
    currentFiber.memorizedState = hook;
  } else {
    currentHook.next = hook;
  }
  currentHook = hook;

  return hook;
};

const HooksDispatcherMount = {
  useState: (initialState) => {
    console.log("usestate mount called");
    const hook = mountHook();
    hook.memorizedState = hook.memorizedState || initialState;

    const dispatch = ((fiber, hook, action) => {
      console.log("setState called", action);
      hook.memorizedState = action;
      fiber.update();
    }).bind(null, currentFiber, hook);

    hook.dispatch = dispatch;

    return [hook.memorizedState, dispatch];
  },
};

export function renderWithHooks(current, Component, props) {
  currentHook = null;
  currentFiber = current;
  if (current.memorizedState) {
    ReactDispatcher.current = HooksDispatcherUpdate;
  } else {
    ReactDispatcher.current = HooksDispatcherMount;
  }
  const children = Component(props);
  return children;
}
