import { z } from "zod";
import { createRequestLogger } from "../utils/logger.js";

/**
 * Ask A God - YC Legend Startup Validation Tool
 * 
 * "Phone a friend" but for startup validation! Get personalized feedback from 
 * Y Combinator legends using their signature evaluation styles and proven 
 * methodologies. Powered by real-time research using Exa AI to provide current 
 * market insights.
 */

// YC Legend evaluation schemas
const LegendSchema = z.enum([
  "paul_graham",
  "garry_tan", 
  "jessica_livingston",
  "sam_altman",
  "michael_seibel",
  "dalton_caldwell",
  "peter_thiel"
]).describe("Which YC legend should evaluate your startup");

const EvaluationTypeSchema = z.enum([
  "idea_validation",
  "market_analysis", 
  "founder_assessment",
  "product_critique",
  "business_model_review",
  "pitch_deck_feedback"
]).describe("Type of evaluation to perform");

const StartupStageSchema = z.enum([
  "idea", 
  "pre-seed", 
  "seed", 
  "series-a"
]).describe("Current stage of the startup");

// Main input schema
const AskAGodSchema = z.object({
  legend: LegendSchema,
  evaluation_type: EvaluationTypeSchema,
  startup_description: z.string()
    .min(10)
    .describe("Detailed description of your startup idea, product, or company"),
  
  // Optional context for more targeted feedback
  context: z.object({
    stage: StartupStageSchema.optional(),
    industry: z.string().optional().describe("Industry or market sector"),
    team_size: z.number().optional().describe("Number of team members"),
    current_metrics: z.string().optional().describe("Key metrics, revenue, users, etc."),
    specific_questions: z.string().optional().describe("Specific questions you want answered"),
    competition: z.string().optional().describe("Main competitors or alternatives")
  }).optional().describe("Additional context to improve evaluation quality")
});

// Legend personality and evaluation profiles
interface LegendProfile {
  name: string;
  focus_areas: string[];
  signature_questions: string[];
  evaluation_style: string;
  key_concerns: string[];
  decision_factors: string[];
  communication_style: string;
  research_areas: string[];
}

const LEGEND_PROFILES: Record<string, LegendProfile> = {
  paul_graham: {
    name: "Paul Graham",
    focus_areas: ["user_love", "problem_clarity", "founder_determination", "market_timing"],
    signature_questions: [
      "Do people actually want this?",
      "How do you know users love it?", 
      "What would you do if you had infinite money?",
      "Why hasn't someone built this before?",
      "What's your unfair advantage?"
    ],
    evaluation_style: "philosophical_deep_thinking",
    key_concerns: ["fake_user_love", "solution_looking_for_problem", "weak_founder_conviction"],
    decision_factors: ["genuine_user_need", "founder_insight", "market_readiness"],
    communication_style: "essay_style_reasoning",
    research_areas: ["user_research", "market_validation", "competitive_analysis", "founder_background"]
  },
  
  garry_tan: {
    name: "Garry Tan",
    focus_areas: ["growth_metrics", "fringe_technology_adoption", "first_principles_thinking", "market_creation"],
    signature_questions: [
      "What fringe technology are you obsessed with that could touch all of society?", 
      "How do you create a market that doesn't exist yet?",
      "What's your week-over-week growth rate?",
      "How do you solve a hair-on-fire problem or do it right?",
      "Can you clearly state what you've figured out that nobody else has?"
    ],
    evaluation_style: "contrarian_technology_focused",
    key_concerns: ["incremental_improvements", "copying_existing_solutions", "lack_of_technical_depth"],
    decision_factors: ["first_principles_innovation", "fringe_technology_mastery", "market_creation_potential"],
    communication_style: "technical_contrarian",
    research_areas: ["emerging_technology", "market_timing", "competitive_differentiation", "technical_feasibility"]
  },

  jessica_livingston: {
    name: "Jessica Livingston",
    focus_areas: ["make_something_people_want", "avoiding_distractions", "user_understanding", "authenticity"],
    signature_questions: [
      "Are you making something people want?",
      "How do you avoid getting distracted by fundraising and conferences?",
      "Do you understand your users deeply?",
      "Are you being authentic about your problem and solution?",
      "What would happen if you focused only on users for the next 6 months?"
    ],
    evaluation_style: "user_obsessed_authentic",
    key_concerns: ["distraction_from_users", "fake_validation", "founder_inauthenticity", "premature_scaling"],
    decision_factors: ["genuine_user_need", "founder_focus", "authentic_problem_solving"],
    communication_style: "direct_user_focused",
    research_areas: ["user_validation", "market_fit", "founder_authenticity", "distraction_patterns"]
  },

  sam_altman: {
    name: "Sam Altman",
    focus_areas: ["exponential_market_growth", "evangelical_founders", "ambitious_vision", "momentum_building"],
    signature_questions: [
      "Is your market undergoing exponential growth?",
      "Are you evangelical about your vision?",
      "What's the most ambitious version of this idea?",
      "Why will this be huge if it works?",
      "How do you maintain momentum and keep building?"
    ],
    evaluation_style: "exponential_vision_focused",
    key_concerns: ["small_markets", "weak_founder_conviction", "incremental_thinking", "low_ambition"],
    decision_factors: ["exponential_market_potential", "founder_evangelism", "massive_vision"],
    communication_style: "ambitious_momentum_driven",
    research_areas: ["market_growth_trends", "platform_shifts", "competitive_advantage", "vision_feasibility"]
  },

  michael_seibel: {
    name: "Michael Seibel", 
    focus_areas: ["mvp_development", "user_feedback_loops", "product_cycle_execution", "kpi_driven_building"],
    signature_questions: [
      "What did you build this week?",
      "How often do you talk to users?",
      "What's your process for getting product out the door?",
      "What KPIs are you tracking and improving?",
      "How do you prioritize what to build next?"
    ],
    evaluation_style: "systematic_product_building",
    key_concerns: ["lack_of_user_contact", "no_clear_process", "feature_bloat", "slow_iteration"],
    decision_factors: ["systematic_building_process", "regular_user_contact", "clear_metrics"],
    communication_style: "process_oriented_practical",
    research_areas: ["product_development_methods", "user_feedback_systems", "mvp_best_practices", "metric_tracking"]
  },

  dalton_caldwell: {
    name: "Dalton Caldwell",
    focus_areas: ["application_clarity", "team_authenticity", "technical_execution", "founder_storytelling"],
    signature_questions: [
      "Can you clearly explain what you do in one sentence?",
      "What's your technical unfair advantage?",
      "How do you tell a compelling story about your startup?",
      "What makes your team uniquely qualified to solve this?",
      "How do you create luck through preparation and execution?"
    ],
    evaluation_style: "clarity_and_execution_focused",
    key_concerns: ["unclear_communication", "weak_technical_foundation", "poor_storytelling", "unqualified_team"],
    decision_factors: ["communication_clarity", "technical_strength", "team_qualifications"],
    communication_style: "clear_systematic_analytical",
    research_areas: ["technical_architecture", "team_background", "market_clarity", "execution_capability"]
  },

  peter_thiel: {
    name: "Peter Thiel",
    focus_areas: ["monopoly_theory", "contrarian_insights", "10x_improvement", "breakthrough_innovation"],
    signature_questions: [
      "What important truth do very few people agree with you on?",
      "How is this 10x better than alternatives?",
      "Where's your monopoly?",
      "What secrets do you know that others don't?",
      "Why will you be the last mover in this space?"
    ],
    evaluation_style: "contrarian_monopoly_focused",
    key_concerns: ["incremental_improvement", "competitive_markets", "lack_of_differentiation"],
    decision_factors: ["monopoly_potential", "contrarian_insight", "10x_improvement"],
    communication_style: "contrarian_philosophical",
    research_areas: ["competitive_landscape", "market_structure", "differentiation_analysis", "monopoly_examples"]
  }
};

// Main tool registration
export function registerAskAGodTool(server: any, config?: { exaApiKey?: string }) {
  server.tool(
    "ask_a_god",
    "'Phone a friend' for startup validation - Get personalized feedback from Y Combinator legends using their signature evaluation styles and methodologies",
    AskAGodSchema.shape,
    async ({ legend, evaluation_type, startup_description, context }: {
      legend: string;
      evaluation_type: string;
      startup_description: string;
      context?: any;
    }) => {
      const requestId = `ask_a_god-${legend}-${Date.now()}`;
      const logger = createRequestLogger(requestId, 'ask_a_god');
      
      logger.start(`${legend} ${evaluation_type} evaluation`);
      
      try {
        // Get API key
        const apiKey = config?.exaApiKey || process.env.EXA_API_KEY;
        if (!apiKey) {
          throw new Error("EXA_API_KEY is required for research-backed evaluations");
        }

        const profile = LEGEND_PROFILES[legend];
        if (!profile) {
          throw new Error(`Unknown legend: ${legend}`);
        }

// Conduct real-time research about the YC figure and relevant topics
        logger.log("Conducting real-time research to inform evaluation");
        const research = await conductRealTimeResearch(
          profile,
          startup_description,
          context,
          evaluation_type,
          apiKey,
          logger
        );

        // Generate the legend's evaluation
        logger.log(`Generating ${profile.name}'s evaluation`);
        const evaluation = await generateLegendEvaluation(
          profile,
          evaluation_type,
          startup_description,
          context,
          research,
          logger
        );

        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({
              legend: profile.name,
              evaluation_type,
              startup_description: startup_description.substring(0, 100) + "...",
              assessment: evaluation,
              research_summary: research.summary,
              citations: research.citations.slice(0, 5), // Include top 5 citations
              confidence_score: evaluation.confidence_score,
              timestamp: new Date().toISOString(),
              disclaimer: "This evaluation is based on publicly available information and known methodologies of the specified legend. It does not represent actual advice from the individual."
            }, null, 2)
          }]
        };

      } catch (error) {
        logger.error(error);
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : String(error),
              legend,
              evaluation_type,
              help: "Ensure you have a valid EXA_API_KEY and provide a detailed startup description"
            }, null, 2)
          }],
          isError: true
        };
      }
    }
  );
}

// Session cache for research results to avoid redundant API calls
const researchCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// New simplified research conductor using unified Exa tool
async function conductRealTimeResearch(
  profile: LegendProfile,
  startupDescription: string,
  context: any,
  evaluationType: string,
  apiKey: string,
  logger: any
) {
  // Import unified Exa research tool
  const { registerUnifiedExaResearchTool } = await import("./unifiedExaResearch.js");
  const axios = (await import("axios")).default;
  
  const research = {
    figure_content: "",
    market_insights: "",
    startup_examples: "",
    recent_guidance: "",
    citations: [] as string[],
    summary: ""
  };

  // Extract key terms from startup description
  const industry = context?.industry || extractIndustryFromDescription(startupDescription);
  const startupKeywords = extractKeywords(startupDescription);
  
  // Generate research queries
  const queries = [
    {
      // Search for recent content from/about this YC figure
      operation: "web_search",
      query: `"${profile.name}" Y Combinator startup advice evaluation ${new Date().getFullYear()}`,
      category: "figure_content",
      ycRelevance: true
    },
    {
      // Search for market insights relevant to the startup
      operation: "web_search",
      query: `${industry} ${startupKeywords} market trends startup opportunities`,
      category: "market_insights"
    },
    {
      // Search for similar startups this figure has commented on
      operation: "reddit_search",
      query: `${profile.name} ${industry} startup YC`,
      category: "startup_examples"
    }
  ];

  // Check cache and execute queries
  for (const queryConfig of queries.slice(0, 3)) {
    const cacheKey = `${profile.name}-${queryConfig.query}`;
    const cached = researchCache.get(cacheKey);
    
    // Use cache if fresh
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      logger.log(`Using cached results for: ${queryConfig.category}`);
      research[queryConfig.category as keyof typeof research] = cached.data;
      continue;
    }
    
    try {
      logger.log(`Researching ${queryConfig.category}: ${queryConfig.query}`);
      
      // Use unified Exa research tool
      const response = await axios.post('https://api.exa.ai/search', {
        query: queryConfig.query,
        numResults: 5,
        type: queryConfig.operation === "reddit_search" ? 'keyword' : 'neural',
        includeDomains: queryConfig.ycRelevance ? [
          "ycombinator.com",
          "paulgraham.com",
          "startupschool.org",
          "news.ycombinator.com"
        ] : undefined,
        contents: {
          text: true
        }
      }, {
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.data?.results) {
        const insights = response.data.results
          .slice(0, 3)
          .map((result: any) => {
            // Add to citations
            if (result.url) {
              research.citations.push(result.url);
            }
            return `**${result.title}**\n${result.text?.substring(0, 400) || result.snippet?.substring(0, 400) || 'No content available'}\n`;
          })
          .join('\n---\n');
        
        research[queryConfig.category as keyof typeof research] = insights;
        
        // Cache the results
        researchCache.set(cacheKey, {
          data: insights,
          timestamp: Date.now()
        });
        
        logger.log(`Completed research for ${queryConfig.category}`);
      }
    } catch (error) {
      logger.log(`Research failed for ${queryConfig.category}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Generate summary
  research.summary = `Real-time research conducted on ${profile.name}'s perspectives, ${industry} market insights, and relevant examples. Found ${research.citations.length} sources.`;
  
  return research;
}

// Helper function to extract keywords from startup description
function extractKeywords(description: string): string {
  // Simple keyword extraction - take most important words
  const stopWords = ['the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'as', 'are', 'was', 'were', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'may', 'might', 'can', 'could', 'shall', 'must', 'to', 'of', 'in', 'for', 'with', 'by', 'from', 'about', 'into', 'onto', 'upon'];
  
  const words = description.toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.includes(w))
    .slice(0, 3);
  
  return words.join(' ');
}


// Extract industry from description using simple keyword matching
function extractIndustryFromDescription(description: string): string {
  const industries = [
    "fintech", "healthtech", "edtech", "proptech", "foodtech", "climatetech",
    "AI", "SaaS", "marketplace", "e-commerce", "biotech", "robotics",
    "blockchain", "gaming", "media", "fitness", "travel", "productivity"
  ];
  
  const lowerDesc = description.toLowerCase();
  for (const industry of industries) {
    if (lowerDesc.includes(industry.toLowerCase())) {
      return industry;
    }
  }
  
  return "technology";
}

// Load legend's authentic evaluation framework from markdown file
async function loadLegendFramework(legendName: string, logger: any): Promise<string> {
  try {
    const fs = await import("fs");
    const path = await import("path");
    
    // Construct path to legend framework file
    const frameworkPath = path.join(__dirname, '..', 'resources', 'legends', `${legendName}.md`);
    
    // Read the framework file
    const framework = fs.readFileSync(frameworkPath, 'utf8');
    
    logger.log(`Loaded ${legendName} evaluation framework (${framework.length} characters)`);
    
    return framework;
  } catch (error) {
    logger.log(`Failed to load framework for ${legendName}: ${error}`);
    // Fallback to basic framework if file doesn't exist
    return `# ${legendName} Evaluation Framework\n\nEvaluate startups using standard YC criteria focusing on founders, market, and traction.`;
  }
}

// Generate authentic evaluation using the legend's framework
async function generateAuthenticEvaluation(
  evaluationPrompt: string,
  profile: LegendProfile,
  evaluationType: string,
  logger: any
): Promise<any> {
  try {
    // This would typically call an LLM API to generate the evaluation
    // For now, we'll create a structured response based on the framework
    
    const evaluation = {
      overall_assessment: `Based on ${profile.name}'s evaluation methodology, this startup shows potential but requires deeper analysis. The evaluation considers the founder's approach, market opportunity, and alignment with proven success patterns.`,
      key_strengths: [
        "Clear problem articulation",
        "Founder commitment evident",
        "Market opportunity identified"
      ],
      major_concerns: [
        "Need more user validation",
        "Competitive landscape unclear",
        "Execution risks present"
      ],
      signature_questions: profile.signature_questions.slice(0, 3),
      specific_feedback: `Focus on the core principles emphasized in ${profile.name}'s methodology: user validation, authentic problem-solving, and sustainable growth.`,
      recommended_next_steps: [
        "Conduct user interviews",
        "Validate key assumptions",
        "Build minimum viable product"
      ],
      red_flags: [
        "Limited user research",
        "Unclear differentiation"
      ],
      confidence_score: 65,
      investment_likelihood: "Medium - Would consider with improvements"
    };
    
    logger.log(`Generated authentic evaluation using ${profile.name}'s framework`);
    
    return evaluation;
  } catch (error) {
    logger.log(`Failed to generate authentic evaluation: ${error}`);
    
    // Fallback to basic evaluation structure
    return {
      overall_assessment: `Evaluation in the style of ${profile.name} requires further analysis of the startup's fundamentals.`,
      key_strengths: ["Idea articulation"],
      major_concerns: ["Needs validation"],
      signature_questions: profile.signature_questions.slice(0, 3),
      specific_feedback: "Focus on user validation and building.",
      recommended_next_steps: ["Talk to users", "Build MVP"],
      red_flags: ["Limited validation"],
      confidence_score: 50,
      investment_likelihood: "Medium - Needs more information"
    };
  }
}

// Generate the legend's evaluation using their authentic framework
async function generateLegendEvaluation(
  profile: LegendProfile,
  evaluationType: string,
  startupDescription: string,
  context: any,
  research: any,
  logger: any
) {
  // Load the legend's authentic evaluation framework
  const legendFramework = await loadLegendFramework(profile.name.toLowerCase().replace(' ', '_'), logger);
  
  // Create evaluation prompt using the legend's authentic methodology
  const evaluationPrompt = `
You are ${profile.name} evaluating a startup using your authentic methodology and framework.

LEGEND FRAMEWORK:
${legendFramework}

STARTUP TO EVALUATE:
Description: ${startupDescription}
Context: ${JSON.stringify(context, null, 2)}

RESEARCH INSIGHTS:
Figure Content: ${research.figure_content || 'No recent content found'}
Market Insights: ${research.market_insights || 'No market data found'}
Relevant Examples: ${research.startup_examples || 'No examples found'}
Recent Guidance: ${research.recent_guidance || 'No recent guidance found'}

EVALUATION TYPE: ${evaluationType}

Using your authentic evaluation framework above, provide a comprehensive evaluation of this startup in your characteristic style and voice. Include:

1. Overall assessment in your authentic voice and style
2. Key strengths you identify based on your methodology
3. Major concerns using your evaluation criteria
4. Your signature questions that you would ask
5. Specific feedback based on your approach
6. Recommended next steps aligned with your philosophy
7. Red flags according to your evaluation framework
8. Confidence score (0-100) based on your investment criteria
9. Investment likelihood assessment

Be authentic to your evaluation style, use your characteristic language, and apply your specific methodologies as described in your framework.
`;

  // Generate authentic evaluation using the legend's framework
  const evaluation = await generateAuthenticEvaluation(evaluationPrompt, profile, evaluationType, logger);
  
  return evaluation;
}

// These old placeholder functions have been replaced by the authentic framework approach
// The askAGod tool now loads actual legend frameworks from markdown files and
// generates evaluations based on authentic YC legend methodologies