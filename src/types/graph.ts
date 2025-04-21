/**
 * Base interface for graph nodes
 */
export interface GraphNode {
  id: string | number;
  name?: string;
  era?: string;
  schools?: string[];
  description?: string; // Explicitly add description
  born?: string | number;
  wikipediaUrl?: string; // Explicitly add wikipediaUrl
  died?: string | number;
  image?: string;
  community?: number | string; // Added by community detection
  color?: string; // Explicitly add color for node styling
  influenceScore?: number; // Explicitly add influenceScore
  contributions?: string[]; // Explicitly add contributions as an optional array of strings
  key_ideas?: string[]; // Explicitly add key_ideas as an optional array of strings
  // D3 simulation properties (added dynamically)
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | undefined; // Align with potential NodeObject type
  fy?: number | undefined; // Align with potential NodeObject type
  size?: number;
  // Index signature to allow for other dynamically added properties (e.g., by D3 or custom logic)
  // Use with caution, prefer explicit properties when possible.
  [key: string]: unknown;
}

/**
 * Base interface for graph links
 */
export interface GraphLink {
  source: string | number | GraphNode;
  target: string | number | GraphNode;
  weight?: number;
  relation?: string;
  // Index signature to allow for dynamically added properties (e.g., by D3 or custom logic)
  // Use with caution, prefer explicit properties when possible.
  [key: string]: unknown;
}

/**
 * Type alias for the structure of the graph data (nodes and links)
 */
export type PhilosopherData = {
  nodes: GraphNode[];
  links: GraphLink[];
};

/**
 * Graph data structure
 */
export interface GraphData<NodeType extends GraphNode = GraphNode, LinkType extends GraphLink = GraphLink> {
  nodes: NodeType[];
  links: LinkType[];
}

/**
 * Configuration options for the force graph
 */
export interface ForceGraphConfig {
  nodeRelSize?: number;
  linkDirectionalArrowLength?: number;
  linkDirectionalArrowRelPos?: number;
  linkCurvature?: number;
  cooldownTicks?: number;
  enableNodeDrag?: boolean;
  enableZoomPanInteraction?: boolean;
  // Index signature allows passing any other valid react-force-graph config options
  [key: string]: unknown;
}

/**
 * Community information for legend display
 */
export interface CommunityInfo {
  id: number | string;
  name: string;
  description?: string;
  color?: string;
}

/**
 * Relation type information for legend display
 */
export interface RelationInfo {
  type: string;
  name: string;
  description?: string;
  color?: string;
}
