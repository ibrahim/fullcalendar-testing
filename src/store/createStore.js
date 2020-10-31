import React, { createContext, useContext, useState, useMemo } from "react";

const useMemoizedStore = (reducer, initialState) => {
  let [state, setState] = useState(initialState);
  return useMemo(() => reducer({ state, setState }), [
    state,
    setState,
    reducer
  ]);
};

const createStore = (reducer, initialState) => {
  const StoreContext = createContext();

  const StoreProvider = props => {
    let store = useMemoizedStore(reducer, initialState);
    return (
      <StoreContext.Provider value={store}>
        {props.children}
      </StoreContext.Provider>
    );
  };

  let useStore = () => {
    return useContext(StoreContext);
  };

  return [StoreProvider, useStore];
};

export default createStore;


