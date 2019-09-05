import React, { useState } from "react";
import "./App.css";
import logoUrl from "./logo.svg";
import axios from "axios";
import { TopAppBar } from "./Electron/TopAppBar/TopAppBar";

const url = "http://localhost:8080/info";

type State = {
  loading: boolean;
  error?: { message: string };
  data?: any;
};

export default function App() {
  const [state, setState] = useState<State>({ loading: false });

  if (!state.loading && !state.error && !state.data) {
    setState({ loading: true });
    axios
      .get(url)
      .then(response => {
        setState({ loading: false, data: response.data });
      })
      .catch(error => setState({ loading: false, error }));
  }

  const logo = <img alt="logo" src={logoUrl} />;
  return (
    <div className="App">
      <TopAppBar logo={logo} title="React Spring Electron Starter" />
      <header className="App-header">
        <img src={logoUrl} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {state.loading && <p>Loading...</p>}
        {state.error && <p>Error: {state.error.message}</p>}
        {state.data && (
          <p>
            Connected to {state.data.name} [v{state.data.version}]
          </p>
        )}
      </header>
    </div>
  );
}
