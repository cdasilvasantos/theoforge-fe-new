import { track as vercelTrack } from '@vercel/analytics';

export type TrackEventOptions = {
  [key: string]: string | number | boolean;
};

/**
 * Track a custom event with Vercel Analytics
 * 
 * @param eventName Name of the event to track
 * @param properties Additional properties to include with the event
 */
export function trackEvent(eventName: string, properties?: TrackEventOptions): void {
  // Only track in production to avoid skewing analytics with development data
  if (process.env.NODE_ENV !== 'production' && process.env.VERCEL_ENV !== 'production') {
    console.log(`[Analytics] Event tracked (dev mode): ${eventName}`, properties);
    return;
  }

  try {
    vercelTrack(eventName, properties);
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error);
  }
}

/**
 * Events that can be tracked across the application
 */
export const AnalyticsEvents = {
  // Character Chat Events
  CHARACTER_SELECTED: 'character_selected',
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  CONVERSATION_STARTER_CLICKED: 'conversation_starter_clicked',
  
  // Philosopher Graph Events
  PHILOSOPHER_GRAPH_NODE_CLICKED: 'philosopher_graph_node_clicked',
  PHILOSOPHER_GRAPH_SEARCH: 'philosopher_graph_search',
  PHILOSOPHER_GRAPH_FILTER_APPLIED: 'philosopher_graph_filter_applied',
  
  // Content Engagement
  CONTENT_SHARE: 'content_share', 
  BLOG_ARTICLE_VIEW: 'blog_article_view',
  FORGE_PROJECT_CLICKED: 'forge_project_clicked',
  
  // User Actions
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  DISCORD_CLICKED: 'discord_clicked',
  
  // Navigation
  NAVIGATION_CLICK: 'navigation_click',
  EXTERNAL_LINK_CLICK: 'external_link_click',
};

export default { trackEvent, AnalyticsEvents };
