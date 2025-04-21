/**
 * Site configuration for TheoForge
 * Contains default metadata, URLs, and other site-wide settings
 */
export const siteConfig = {
  name: "TheoForge",
  description: "TheoForge specializes in AI strategy and implementation, helping organizations build reliable, high-impact AI solutions.",
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://theoforge.ai",
  ogImage: "/logo.png",
  author: "TheoForge Team",
  twitterHandle: "@theoforge",
  keywords: [
    "AI Strategy", 
    "AI Consulting", 
    "AI Implementation", 
    "Genesis Engine", 
    "Enterprise AI",
    "Knowledge Graphs",
    "Interactive AI",
    "LLM"
  ],
  links: {
    twitter: "https://twitter.com/theoforge",
    github: "https://github.com/theoforge",
    linkedin: "https://www.linkedin.com/in/keithwilliams5/",
    youtube: "https://www.youtube.com/@Firehose360",
    discord: "https://discord.gg/fp4NrUjCa5"
  },
};
