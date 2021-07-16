import React, { useContext, useEffect, useState } from "react";
import { GraphContext } from "../context";

const DataDistribution = () => {
  const { renderedGraph, dist } = useContext(GraphContext);

  const [colorMap, setColorMap] = useState<{ [key: string]: string }>();

  useEffect(() => {
    if (dist && renderedGraph) {
      setTimeout(() => {
        const colorMap = {};
        for (let node of renderedGraph.nodes) {
          if (Object.keys(colorMap).length >= 2) {
            break;
          }
          colorMap[node.group] = node.color;
        }
        setColorMap(colorMap);
      }, 50);
    }
  }, [dist, renderedGraph]);

  const sum = obj => {
    return Object.keys(obj).reduce(
      (sum, key) => sum + parseFloat(obj[key] || 0),
      0
    );
  };

  if (dist && colorMap) {
    const total = Object.keys(dist).reduce((acc, curr) => acc + dist[curr], 0);
    const percentage = Object.keys(dist).reduce(
      (acc, curr) => ({ ...acc, [curr]: (dist[curr] * 100) / total }),
      {}
    );

    return (
      <div className="data-dist">
        <>
          {Object.keys(colorMap).map(key => (
            <div key={key} className="class-color">
              <div
                className="color"
                style={{ backgroundColor: colorMap[key] }}
              />
              <span className="class">
                {(key === "1" ? "Researchers" : "Normal users") +
                  ` ${percentage[key]}%`}
              </span>
            </div>
          ))}
        </>
        <div className="bar">
          {Object.keys(colorMap).map(key => (
            <div
              key={key}
              className="bar-color"
              style={{
                backgroundColor: colorMap[key],
                width: Math.round(percentage[key]) + "%",
              }}
            />
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default DataDistribution;
