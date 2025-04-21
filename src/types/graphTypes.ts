// src/types/graphTypes.ts

// Define the structure of philosopher data for the graph nodes
export interface PhilosopherNode {
    id: string;
    name: string;
    val?: number; // Optional: influence/importance metric for node size
    description?: string;
    imageUrl?: string;
    keyIdeas?: string[];
    relationships?: { [key: string]: string[] }; // type -> array of target IDs
    radius?: number; // Optional: Visual radius for collision/drawing
    // Position properties managed by force graph
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | undefined; // Fixed position (undefined or coordinate)
    fy?: number | undefined;
    // Additional properties for philosopher graph
    community?: number;
    era?: string;
    birth?: string;
    death?: string;
    birthYear?: number;
    deathYear?: number;
    school?: string;
    centrality?: number;
    degree?: number;
    influenceScore?: number;
    size?: number;
  }
  
  // Define the structure for graph links (edges)
  export interface PhilosopherLink {
    source: string | PhilosopherNode; // Source node ID or node object
    target: string | PhilosopherNode; // Target node ID or node object
    relation?: string; // Optional: describe the type of relationship (e.g., 'taught', 'influenced')
    strength?: number; // Optional: strength of the relationship
    // Properties managed by force graph
    index?: number;
  }
