import { ILink, INode } from "../@types";

export const genRandomColor = () =>
  Math.floor(Math.random() * 16777215).toString(16);

export const lineSplit = (content: string) => {
  const lines = content.split(/\r\n/g);
  if (lines.length && !lines[lines.length - 1].length) {
    lines.pop();
  }
  return lines;
};

export const comaSplit = (line: string) => line.split(/, ?/g);

export const edgeListCsvToJson = (content: string, hasHeader = true) => {
  const links: ILink[] = [];
  const nodes: INode[] = [];
  const nodeCache = new Set<string>();
  let edgeList = lineSplit(content);
  if (hasHeader) {
    edgeList.shift();
  }
  for (let edge of edgeList) {
    const edgeNodes = comaSplit(edge);
    const [source, target] = edgeNodes;
    links.push({ source, target });
    if (!nodeCache.has(source)) {
      nodes.push({ id: source });
    }
    if (!nodeCache.has(target)) {
      nodes.push({ id: target });
    }
    nodeCache.add(source);
    nodeCache.add(target);
  }
  return { nodes, links };
};

export const validateFeatures = (
  content: string,
  nodes: INode[],
  hasHeader = true
) => {
  const lines = lineSplit(content);
  let idIndex = 0;
  if (hasHeader) {
    const header = lines.shift();
    const elems = comaSplit(header);
    const index = elems.indexOf("id");
    if (index != -1) {
      idIndex = index;
    }
  }
  const idArray = lines.map(line => comaSplit(line)).map(args => args[idIndex]);
  const idSet = new Set(idArray);
  for (let { id } of nodes) {
    if (!idSet.has(id)) {
      return false;
    }
  }
  return true;
};
