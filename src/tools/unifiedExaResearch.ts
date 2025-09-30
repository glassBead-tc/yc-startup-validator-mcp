import { z } from "zod";
import { createRequestLogger } from "../utils/logger.js";
import axios from "axios";

/**
 * Unified Exa Research Tool - Facade Pattern Implementation
 * 
 * Consolidates all Exa research capabilities into a single tool with operations.
 * This simplifies the interface and reduces complexity while maintaining all functionality.
 * 
 * Operations supported:
 * - web_search: General web search with YC-tuned ranking
 * - company_research: Company profiles and traction signals
 * - github_search: Repository and contributor analysis
 * - youtube_search: Video content discovery
 * - reddit_search: Community sentiment and pain signals
 * - research_papers: Academic and technical papers
 * - competitor_analysis: Competitive landscape research
 * - crawl_url: Direct content extraction from URLs
 */

// Operation types enum
const OperationSchema = z.enum([
  "web_search",
  "company_research", 
  "github_search",
  "youtube_search",
  "reddit_search",
  "research_papers",
  "competitor_analysis",
  "crawl_url"
]).describe("Type of research operation to perform");

// Main input schema
const UnifiedExaResearchSchema = z.object({
  operation: OperationSchema,
  
  // Common parameters
  query: z.string()
    .optional()
    .describe("Search query or company name (required for most operations)"),
  
  // Operation-specific parameters
  parameters: z.object({
    numResults: z.number()
      .optional()
      .default(10)
      .describe("Number of results to return"),
    
    url: z.string()
      .optional()
      .describe("URL to crawl (required for crawl_url operation)"),
    
    includeContent: z.boolean()
      .optional()
      .default(true)
      .describe("Include full text content in results"),
    
    dateRange: z.object({
      start: z.string().optional(),
      end: z.string().optional()
    }).optional()
    .describe("Date range filter for results"),
    
    domains: z.array(z.string())
      .optional()
      .describe("Specific domains to search within or exclude"),
    
    searchType: z.enum(["neural", "keyword", "auto"])
      .optional()
      .default("auto")
      .describe("Search algorithm type"),
    
    // YC-specific filters
    ycRelevance: z.boolean()
      .optional()
      .default(false)
      .describe("Prioritize YC-related sources and content"),
    
    founderContent: z.boolean()
      .optional()
      .default(false)
      .describe("Focus on founder-generated content"),
  }).optional()
  .describe("Operation-specific parameters")
});

// Operation handlers
interface OperationHandler {
  execute: (params: any, apiKey: string, logger: any) => Promise<any>;
  requiredParams: string[];
  description: string;
}

const OPERATION_HANDLERS: Record<string, OperationHandler> = {
  web_search: {
    description: "General web search with YC-tuned ranking",
    requiredParams: ["query"],
    execute: async (params, apiKey, logger) => {
      const { query, parameters = {} } = params;
      
      // Add YC-specific domains if ycRelevance is true
      let searchQuery = query;
      if (parameters.ycRelevance) {
        const ycDomains = [
          "ycombinator.com",
          "paulgraham.com",
          "startupschool.org",
          "hackernews.com"
        ];
        
        if (parameters.domains) {
          parameters.domains.push(...ycDomains);
        } else {
          parameters.domains = ycDomains;
        }
      }
      
      const response = await axios.post('https://api.exa.ai/search', {
        query: searchQuery,
        numResults: parameters.numResults || 10,
        type: parameters.searchType || 'auto',
        includeDomains: parameters.domains,
        contents: {
          text: parameters.includeContent !== false
        }
      }, {
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      return formatResults(response.data, "web_search", logger);
    }
  },
  
  company_research: {
    description: "Comprehensive company information and traction signals",
    requiredParams: ["query"],
    execute: async (params, apiKey, logger) => {
      const { query: companyName, parameters = {} } = params;
      
      // Search for company information
      const queries = [
        `${companyName} company overview funding`,
        `${companyName} founders team leadership`,
        `${companyName} traction metrics users revenue`,
        `${companyName} news announcements`
      ];
      
      const results = await Promise.all(
        queries.map(q => 
          axios.post('https://api.exa.ai/search', {
            query: q,
            numResults: 3,
            type: 'neural',
            contents: { text: true }
          }, {
            headers: {
              'X-API-Key': apiKey,
              'Content-Type': 'application/json'
            }
          }).catch(err => {
            logger.log(`Query failed: ${q}`);
            return null;
          })
        )
      );
      
      return formatCompanyResults(results.filter(r => r !== null), companyName, logger);
    }
  },
  
  github_search: {
    description: "Search GitHub repositories and analyze contributor activity",
    requiredParams: ["query"],
    execute: async (params, apiKey, logger) => {
      const { query, parameters = {} } = params;
      
      const response = await axios.post('https://api.exa.ai/search', {
        query: `site:github.com ${query}`,
        numResults: parameters.numResults || 10,
        type: 'keyword',
        contents: { text: true }
      }, {
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      return formatResults(response.data, "github", logger);
    }
  },
  
  youtube_search: {
    description: "Search YouTube for founder talks, demos, and product videos",
    requiredParams: ["query"],
    execute: async (params, apiKey, logger) => {
      const { query, parameters = {} } = params;
      
      const searchQuery = parameters.founderContent ? 
        `site:youtube.com ${query} founder CEO interview talk` :
        `site:youtube.com ${query}`;
      
      const response = await axios.post('https://api.exa.ai/search', {
        query: searchQuery,
        numResults: parameters.numResults || 10,
        type: 'neural',
        contents: { text: false } // YouTube metadata only
      }, {
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      return formatResults(response.data, "youtube", logger);
    }
  },
  
  reddit_search: {
    description: "Search Reddit and Hacker News for community sentiment",
    requiredParams: ["query"],
    execute: async (params, apiKey, logger) => {
      const { query, parameters = {} } = params;
      
      const queries = [
        `site:reddit.com ${query}`,
        `site:news.ycombinator.com ${query}`
      ];
      
      const results = await Promise.all(
        queries.map(q => 
          axios.post('https://api.exa.ai/search', {
            query: q,
            numResults: Math.floor((parameters.numResults || 10) / 2),
            type: 'keyword',
            contents: { text: true }
          }, {
            headers: {
              'X-API-Key': apiKey,
              'Content-Type': 'application/json'
            }
          }).catch(err => {
            logger.log(`Query failed: ${q}`);
            return null;
          })
        )
      );
      
      return formatCommunityResults(results.filter(r => r !== null), query, logger);
    }
  },
  
  research_papers: {
    description: "Search academic papers and technical research",
    requiredParams: ["query"],
    execute: async (params, apiKey, logger) => {
      const { query, parameters = {} } = params;
      
      const response = await axios.post('https://api.exa.ai/search', {
        query: `${query} research paper academic study`,
        numResults: parameters.numResults || 10,
        type: 'neural',
        includeDomains: [
          "arxiv.org",
          "scholar.google.com",
          "acm.org",
          "ieee.org",
          "nature.com",
          "sciencedirect.com"
        ],
        contents: { text: true }
      }, {
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      return formatResults(response.data, "research", logger);
    }
  },
  
  competitor_analysis: {
    description: "Find and analyze competitors in a market",
    requiredParams: ["query"],
    execute: async (params, apiKey, logger) => {
      const { query: companyOrMarket, parameters = {} } = params;
      
      const queries = [
        `${companyOrMarket} competitors alternatives`,
        `companies like ${companyOrMarket}`,
        `${companyOrMarket} vs comparison`
      ];
      
      const results = await Promise.all(
        queries.map(q => 
          axios.post('https://api.exa.ai/search', {
            query: q,
            numResults: 5,
            type: 'neural',
            contents: { text: true }
          }, {
            headers: {
              'X-API-Key': apiKey,
              'Content-Type': 'application/json'
            }
          }).catch(err => {
            logger.log(`Query failed: ${q}`);
            return null;
          })
        )
      );
      
      return formatCompetitorResults(results.filter(r => r !== null), companyOrMarket, logger);
    }
  },
  
  crawl_url: {
    description: "Extract content from a specific URL",
    requiredParams: ["url"],
    execute: async (params, apiKey, logger) => {
      const { parameters = {} } = params;
      
      if (!parameters.url) {
        throw new Error("URL is required for crawl_url operation");
      }
      
      const response = await axios.post('https://api.exa.ai/contents', {
        ids: [parameters.url],
        text: true
      }, {
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      return formatCrawlResults(response.data, parameters.url, logger);
    }
  }
};

// Result formatting functions
function formatResults(data: any, source: string, logger: any) {
  if (!data?.results) {
    return { success: false, source, results: [] };
  }
  
  const results = data.results.map((r: any) => ({
    title: r.title,
    url: r.url,
    snippet: r.text?.substring(0, 500) || r.snippet || '',
    publishedDate: r.publishedDate,
    relevanceScore: r.score || 0,
    source
  }));
  
  logger.log(`Formatted ${results.length} ${source} results`);
  
  return {
    success: true,
    source,
    resultsCount: results.length,
    results
  };
}

function formatCompanyResults(responses: any[], companyName: string, logger: any) {
  const companyData = {
    name: companyName,
    overview: "",
    team: "",
    traction: "",
    news: "",
    sources: [] as string[]
  };
  
  responses.forEach((resp, idx) => {
    if (resp?.data?.results) {
      const category = ["overview", "team", "traction", "news"][idx];
      const content = resp.data.results
        .slice(0, 2)
        .map((r: any) => `${r.title}: ${r.text?.substring(0, 300) || ''}`)
        .join('\n\n');
      
      companyData[category as keyof typeof companyData] = content;
      
      resp.data.results.forEach((r: any) => {
        if (r.url) companyData.sources.push(r.url);
      });
    }
  });
  
  logger.log(`Compiled company research for ${companyName}`);
  
  return {
    success: true,
    source: "company_research",
    companyData
  };
}

function formatCommunityResults(responses: any[], query: string, logger: any) {
  const communityData = {
    query,
    reddit: [] as any[],
    hackerNews: [] as any[],
    sentiment: {
      positive: 0,
      negative: 0,
      neutral: 0
    }
  };
  
  responses.forEach((resp, idx) => {
    if (resp?.data?.results) {
      const platform = idx === 0 ? "reddit" : "hackerNews";
      resp.data.results.forEach((r: any) => {
        const item = {
          title: r.title,
          url: r.url,
          snippet: r.text?.substring(0, 300) || '',
          publishedDate: r.publishedDate
        };
        
        if (platform === "reddit") {
          communityData.reddit.push(item);
        } else {
          communityData.hackerNews.push(item);
        }
        
        // Simple sentiment analysis
        const text = (r.text || '').toLowerCase();
        if (text.includes('love') || text.includes('great') || text.includes('amazing')) {
          communityData.sentiment.positive++;
        } else if (text.includes('hate') || text.includes('terrible') || text.includes('awful')) {
          communityData.sentiment.negative++;
        } else {
          communityData.sentiment.neutral++;
        }
      });
    }
  });
  
  logger.log(`Compiled community sentiment for ${query}`);
  
  return {
    success: true,
    source: "community",
    communityData
  };
}

function formatCompetitorResults(responses: any[], market: string, logger: any) {
  const competitors = new Map<string, any>();
  
  responses.forEach(resp => {
    if (resp?.data?.results) {
      resp.data.results.forEach((r: any) => {
        // Extract competitor names from titles and content
        const text = `${r.title} ${r.text || ''}`;
        const companies = extractCompanyNames(text, market);
        
        companies.forEach(company => {
          if (!competitors.has(company)) {
            competitors.set(company, {
              name: company,
              mentions: 1,
              sources: [r.url],
              snippets: [r.text?.substring(0, 200)]
            });
          } else {
            const existing = competitors.get(company);
            existing.mentions++;
            existing.sources.push(r.url);
            existing.snippets.push(r.text?.substring(0, 200));
          }
        });
      });
    }
  });
  
  // Sort by mention frequency
  const sortedCompetitors = Array.from(competitors.values())
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 10);
  
  logger.log(`Identified ${sortedCompetitors.length} competitors for ${market}`);
  
  return {
    success: true,
    source: "competitor_analysis",
    market,
    competitors: sortedCompetitors
  };
}

function formatCrawlResults(data: any, url: string, logger: any) {
  if (!data?.results || data.results.length === 0) {
    return {
      success: false,
      source: "crawl",
      url,
      content: null
    };
  }
  
  const result = data.results[0];
  
  logger.log(`Crawled content from ${url}`);
  
  return {
    success: true,
    source: "crawl",
    url,
    title: result.title,
    content: result.text,
    metadata: {
      author: result.author,
      publishedDate: result.publishedDate
    }
  };
}

// Helper function to extract company names
function extractCompanyNames(text: string, excludeCompany: string): string[] {
  // Simple heuristic: Look for capitalized words that might be company names
  const words = text.match(/[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?/g) || [];
  
  return words
    .filter(w => 
      w.length > 3 && 
      w !== excludeCompany &&
      !['The', 'This', 'That', 'These', 'Those', 'What', 'When', 'Where', 'Why', 'How'].includes(w)
    )
    .slice(0, 5);
}

// Main tool registration
export function registerUnifiedExaResearchTool(server: any, config?: { exaApiKey?: string }) {
  server.tool(
    "exa_research",
    "Unified research tool for all Exa-powered searches - web, company, GitHub, YouTube, Reddit, papers, competitors, and URL crawling",
    UnifiedExaResearchSchema.shape,
    async (params: z.infer<typeof UnifiedExaResearchSchema>) => {
      const requestId = `exa_research-${params.operation}-${Date.now()}`;
      const logger = createRequestLogger(requestId, 'exa_research');
      
      logger.start(`${params.operation} operation`);
      
      try {
        // Get API key
        const apiKey = config?.exaApiKey || process.env.EXA_API_KEY;
        if (!apiKey) {
          throw new Error("EXA_API_KEY is required");
        }
        
        // Get operation handler
        const handler = OPERATION_HANDLERS[params.operation];
        if (!handler) {
          throw new Error(`Unknown operation: ${params.operation}`);
        }
        
        // Validate required parameters
        if (params.operation !== "crawl_url" && !params.query) {
          throw new Error(`Query is required for ${params.operation} operation`);
        }
        
        // Execute operation
        logger.log(`Executing ${params.operation} with query: ${params.query || params.parameters?.url}`);
        const result = await handler.execute(params, apiKey, logger);
        
        logger.end(`${params.operation} completed successfully`);
        
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify(result, null, 2)
          }]
        };
        
      } catch (error) {
        logger.error(error);
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({
              success: false,
              operation: params.operation,
              error: error instanceof Error ? error.message : String(error)
            }, null, 2)
          }],
          isError: true
        };
      }
    }
  );
}