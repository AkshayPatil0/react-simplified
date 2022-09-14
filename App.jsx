import React from "./src/react";

let c = 0;

const App = () => {
  const [inc, setInc] = React.useState(1);

  return (
    <div id={"app-div" + c++}>
      <button id={"counter-button" + c++} onclick={() => setInc(inc + 1)}>
        inc: {inc}
      </button>
      <Counter inc={1} />
    </div>
  );
};

function Counter({ inc }) {
  const [count, setCount] = React.useState(1);

  return (
    <button id={"counter-button" + c++} onclick={() => setCount(count + inc)}>
      count: {count}
    </button>
  );
}

export default App;
