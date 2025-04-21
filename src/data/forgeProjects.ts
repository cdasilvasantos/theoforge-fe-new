// src/data/forgeProjects.ts

import { ForgeProjectData } from '@/lib/forgeUtils';

// Placeholder data for Forge projects (formerly playgroundProjects)
export const forgeProjects: ForgeProjectData[] = [
  {
    id: 'philosopher-graph',
    title: 'Philosopher Knowledge Graph',
    content: 'Explore connections between philosophers and ideas using a dynamic knowledge graph interface. Demonstrates graph database integration and visualization.',
    githubUrl: 'https://github.com/theoforge/philosopher-graph-demo', 
    tryUrl: '/forge/philosopher-graph', 
    tags: ['Knowledge Graph', 'Neo4j', 'Next.js', 'Visualization'],
    featured: true,
    image: '/images/forge/philosphers/forge_philospher_project.png',
    status: 'Active', 
  },
  {
    id: 'mcp-agents',
    title: 'Multi-Agent Collaboration Platform (MCP)',
    content: 'A framework for coordinating multiple AI agents to solve complex problems collaboratively. Architecture and initial tooling.',
    githubUrl: 'https://github.com/theoforge/mcp', 
    tryUrl: undefined,
    tags: ['Agents', 'MCP', 'Collaboration', 'AI Orchestration', 'TBA'],
    featured: false,
    image: '/images/forge/mcp/forge_mcp_project.png',
    status: 'Coming Soon', 
  },
  {
    id: 'rag-search',
    title: 'RAG-Enhanced Enterprise Search',
    content: 'Leveraging Retrieval-Augmented Generation to provide accurate, context-aware answers from internal knowledge bases.',
    githubUrl: 'https://github.com/theoforge/rag-search', 
    tryUrl: undefined,
    tags: ['RAG', 'Search', 'LLM', 'Vector Database', 'TBA'],
    featured: false,
    image: '/images/forge/rag/forge_rag_project.png',
    status: 'Coming Soon', 
  },
  {
    id: 'char-agents',
    title: 'Advanced Character Agents',
    content: 'Developing sophisticated AI agents with distinct personalities, memory, and interaction styles for specialized applications.',
    githubUrl: 'https://github.com/theoforge/character-agents', 
    tryUrl: undefined,
    tags: ['Agents', 'LLM', 'Genesis Engine', 'Memory', 'TBA'],
    featured: false,
    image: '/images/forge/characters/forge_characters_project.png',
    status: 'Coming Soon', 
  },
  // Add more projects as needed
];
