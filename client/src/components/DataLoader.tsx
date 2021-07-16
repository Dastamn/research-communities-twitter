import React, { useContext, useEffect, useState } from "react";
import { useFilePicker } from "use-file-picker";
import { postGraphData } from "../api";
import { GraphContext } from "../context";
import { edgeListCsvToJson, validateFeatures } from "../utils";
import DataDistribution from "./DataDistribution";

const fileSelectorConfig = {
  accept: [".csv"],
  multiple: false,
};

const Loader = () => {
  const { graph, cachedGraph, getNodes, setGraph, setCachedGraph, setDist } =
    useContext(GraphContext);

  const [predicted, setPredicted] = useState(false);

  const [
    selectEdgeListFile,
    { filesContent: edgeListFilesContent, clear: clearEdgeList },
  ] = useFilePicker(fileSelectorConfig);

  const [
    selectFeaturesFile,
    { filesContent: featuresFilesContent, clear: clearFeatures },
  ] = useFilePicker(fileSelectorConfig);

  useEffect(() => {
    if (edgeListFilesContent.length) {
      const [file] = edgeListFilesContent;
      try {
        const graphData = edgeListCsvToJson(file.content);
        setGraph(graphData);
      } catch (error) {
        alert("Invalid file format.");
        clearEdgeList();
      }
    }
  }, [edgeListFilesContent.length]);

  useEffect(() => {
    if (featuresFilesContent.length && graph) {
      const [file] = featuresFilesContent;
      const val = validateFeatures(file.content, graph.nodes);
      if (!val) {
        alert("Some nodes lack attributes, please provide valid features.");
        clearFeatures();
      } else {
        const nodes = getNodes();
        nodes.forEach((node, index) => (node.group = index));
        setGraph({ nodes, links: graph.links });
      }
    }
  }, [featuresFilesContent.length]);

  const featuresFileSelectionHandler = () => {
    if (graph) {
      selectFeaturesFile();
    } else {
      alert("Please provide a graph edge list first.");
    }
  };

  const predictionHandler = async () => {
    if (featuresFilesContent.length && graph) {
      const [file] = featuresFilesContent;
      try {
        const data = await postGraphData(graph.links, file.content);
        console.log(data);
        const { predictions, count } = data;
        const nodes = getNodes();
        nodes.forEach(node => (node.group = predictions[node.id]));
        setGraph({ nodes, links: graph.links });
        setPredicted(true);
        setDist(count);
      } catch (error) {
        alert(
          `An error occured while fetching for predictions...\nError: ${error}`
        );
      }
    } else {
      alert("Please provide a graph edge list and node features first.");
    }
  };

  const dataDeletionHandler = () => {
    clearEdgeList();
    clearFeatures();
    setGraph(undefined);
    setPredicted(false);
    setDist(undefined);
  };

  const checkboxHandler = e => {
    if (e.target.checked) {
      setCachedGraph(graph);
      const nodes = getNodes();
      const filetredNodes = nodes.filter(node => node.group == 1);
      const nodeSet = new Set(filetredNodes.map(({ id }) => id));
      const links = graph.links.filter(
        ({ source, target }) => nodeSet.has(source) && nodeSet.has(target)
      );
      setGraph({ nodes: filetredNodes, links });
    } else {
      setGraph(cachedGraph);
      setCachedGraph(null);
    }
  };

  return (
    <div className="control-wrapper">
      <div className="control-panel">
        {/* <h1>Controls</h1> */}
        <div className="control-content">
          <div className="interaction">
            <button
              onClick={() => selectEdgeListFile()}
              disabled={!!featuresFilesContent.length}
            >
              Upload edge list
            </button>
            <button
              onClick={featuresFileSelectionHandler}
              disabled={!edgeListFilesContent.length}
            >
              Upload node features
            </button>
            <button
              className="primary"
              onClick={predictionHandler}
              disabled={!featuresFilesContent.length}
            >
              Get predictions
            </button>
            <button
              className="danger"
              onClick={dataDeletionHandler}
              disabled={!graph}
            >
              Clear
            </button>
            {predicted && (
              <label className="check">
                <input type="checkbox" onChange={checkboxHandler} />
                Only display researchers
              </label>
            )}
          </div>
          <DataDistribution />
        </div>
      </div>
    </div>
  );
};

export default Loader;
