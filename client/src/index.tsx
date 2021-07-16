import React from "react";
import ReactDOM from "react-dom";
import DataLoader from "./components/DataLoader";
import GraphVisualizer from "./components/GraphVisualizer";
import { ContextProvider } from "./context";
import "./styles/main.scss";

ReactDOM.render(
  <ContextProvider>
    <DataLoader />
    <GraphVisualizer />
  </ContextProvider>,
  document.getElementById("app")
);
