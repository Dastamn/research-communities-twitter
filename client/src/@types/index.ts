export interface INode {
  id: string;
  group?: number;
  color?: string;
}

export interface ILink {
  source: string;
  target: string;
}

export interface IGraph {
  nodes: INode[];
  links: ILink[];
}

export interface IGraphContext {
  graph: IGraph | undefined;
  cachedGraph: IGraph | null;
  renderedGraph: IGraph | undefined;
  dist: {
    [key: string]: number;
  };
  getNodes: () => INode[];
  getLinks: () => ILink[];
  setGraph: React.Dispatch<React.SetStateAction<IGraph>>;
  setCachedGraph: React.Dispatch<React.SetStateAction<IGraph>>;
  setRenderedGraph: React.Dispatch<React.SetStateAction<IGraph>>;
  setDist: React.Dispatch<
    React.SetStateAction<{
      [key: string]: number;
    }>
  >;
}

export interface IResponse {
  predictions: { [key: string]: number };
  count: { [key: string]: number };
}
