import React, { useContext, useEffect } from "react";
import { ForceGraph3D } from "react-force-graph";
import { GraphContext } from "../context";

const Graph = () => {
  const { graph, renderedGraph, setRenderedGraph } = useContext(GraphContext);

  useEffect(() => {
    setRenderedGraph(graph && JSON.parse(JSON.stringify(graph)));
  }, [graph]);

  return (
    <ForceGraph3D
      // graphData={graph && JSON.parse(JSON.stringify(graph))}
      graphData={renderedGraph}
      showNavInfo={false}
      nodeAutoColorBy="group"
      backgroundColor="rgb(28, 28, 30)"
    />
  );
};

export default Graph;
