import React, { createContext, useState } from "react";
import { IGraph, IGraphContext } from "../@types";

export const GraphContext = createContext<IGraphContext>(null);

export const ContextProvider = ({ children }) => {
  const [graph, setGraph] = useState<IGraph | undefined>(undefined);

  const [cachedGraph, setCachedGraph] = useState<IGraph | null>(null);

  const [renderedGraph, setRenderedGraph] = useState<IGraph | undefined>(
    undefined
  );

  const [dist, setDist] = useState(undefined);

  const getNodes = () => graph.nodes.map(({ id, group }) => ({ id, group }));

  const getLinks = () =>
    graph.links.map(({ source, target }) => ({ source, target }));

  return (
    <GraphContext.Provider
      value={{
        graph,
        cachedGraph,
        renderedGraph,
        dist,
        getNodes,
        getLinks,
        setGraph,
        setCachedGraph,
        setRenderedGraph,
        setDist,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};
