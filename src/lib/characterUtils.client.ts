/**
 * Client-side Character Utilities
 * 
 * Client-compatible version of characterUtils without server-only dependencies.
 */

import { LRUCache } from './cacheSystem';

/**
 * Represents a character's data structure in the system
 */
export interface CharacterData {
  id: string;
  name: string;
  title?: string;
  shortBio?: string;
  fullBio?: string;
  imagePath?: string;
  conversationTopics?: string[];
  conversation_starters?: string[];
  systemPrompt?: string;
  background?: {
    full_bio?: string;
    short_bio?: string;
  };
  description?: string;
  cognitive_profile?: {
    cognitive_style?: string;
  };
  emotional_profile?: {
    dominant_emotions?: string[] | string;
  };
  social_profile?: {
    social_orientation?: string;
  };
  philosophical_stance?: {
    worldview_summary?: string;
  };
  speech_patterns?: {
    communication_style?: string;
  };
}

// Client-side cache for character data
const characterCache = new LRUCache<string, CharacterData>({
  max: 50,
  ttl: 1000 * 60 * 10 // 10 minutes
});

/**
 * Format character name by capitalizing first letter
 */
export function formatCharacterName(name: string): string {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Get all characters from the API
 * Client-side implementation that fetches from the API
 */
export function getAllCharacters(): Promise<CharacterData[]> {
  return fetch('/api/characters', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to fetch characters: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    return Array.isArray(data) ? data : [];
  })
  .catch(error => {
    console.error('Error fetching characters:', error);
    return [];
  });
}

/**
 * Get character by ID
 * Client-side implementation that fetches from API or cache
 */
export function getCharacterById(characterId: string): Promise<CharacterData | null> {
  // Check cache first
  const cachedCharacter = characterCache.get(characterId);
  if (cachedCharacter) {
    return Promise.resolve(cachedCharacter);
  }
  
  return fetch(`/api/characters/${characterId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to fetch character: ${response.status}`);
    }
    return response.json();
  })
  .then(character => {
    // Store in cache
    characterCache.set(characterId, character);
    return character;
  })
  .catch(error => {
    console.error(`Error loading character data for ${characterId}:`, error);
    return null;
  });
}

/**
 * Generate a short bio for a character based on available data
 */
export function generateCharacterBio(character: CharacterData): string {
  if (!character) return '';
  
  if (character.background?.full_bio) {
    return character.background.full_bio;
  }
  
  if (character.background?.short_bio) {
    return character.background.short_bio;
  }
  
  if (character.shortBio) {
    return character.shortBio;
  }
  
  if (character.fullBio) {
    return character.fullBio;
  }
  
  return `${formatCharacterName(character.name)} is an AI character created with TheoForge's Genesis Engine.`;
}
