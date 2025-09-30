import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { log } from "../utils/logger.js";
import { readFileSync } from "fs";
import { join } from "path";

interface UserGuideResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  contentPath?: string;
  content?: string;
}

// Define available YC validation workflow resources
const USER_GUIDE_RESOURCES: UserGuideResource[] = [
  {
    uri: "guide://yc-idea-validator",
    name: "YC Idea Validator & Refinement Engine",
    description: "Complete YC application preparation workflow with market timing analysis, competitive research, founder-market fit assessment, and rapid validation experiments",
    mimeType: "text/markdown",
    contentPath: "orchestrations/meta/yc-idea-validator-refinement-engine.md"
  },
  {
    uri: "guide://10x-better-framework",
    name: "10x Better Framework Guide",
    description: "Research-validated 80/20 framework to assess if your solution is truly 10x better - includes YC community consensus insights, Peter Thiel principles, red flags, and 30-minute assessment process",
    mimeType: "text/markdown",
    contentPath: "orchestrations/meta/10x-better-framework.md"
  },
  {
    uri: "guide://tech-architecture-decision",
    name: "Technology Architecture Decision Engine",
    description: "Meta-workflow for making high-quality technology decisions by orchestrating 15+ validation workflows across 5 phases - helps create bulletproof technical specifications",
    mimeType: "text/markdown",
    contentPath: "orchestrations/meta/technology-architecture-decision-engine.md"
  },
  {
    uri: "guide://workflow-design-research",
    name: "Workflow Design Research Engine",
    description: "Meta-meta workflow that researches how to create better workflows - analyzes successful processes, user needs, and optimization opportunities to design evidence-based orchestrations",
    mimeType: "text/markdown",
    contentPath: "orchestrations/meta/workflow-design-research-engine.md"
  },
  {
    uri: "guide://fact-checking-workflow", 
    name: "Fact-Checking Workflow Guide",
    description: "Three-step workflow for validating startup claims and market research - extract claims, search for evidence using Exa AI, and verify accuracy for investor presentations",
    mimeType: "text/markdown",
    contentPath: "workflows/factCheckingWorkflow.md"
  },
  {
    uri: "guide://company-research-workflow",
    name: "Company Research Workflow Guide", 
    description: "Comprehensive competitive analysis workflow - discover companies, gather information, analyze competitors, and synthesize insights for market positioning",
    mimeType: "text/markdown",
    contentPath: "workflows/companyResearch.md"
  },
  {
    uri: "guide://deep-research-workflow",
    name: "Deep Research Workflow Guide",
    description: "Advanced iterative market research methodology - conducts multi-stage investigation with query generation, parallel searches, and comprehensive synthesis for due diligence",
    mimeType: "text/markdown",
    contentPath: "workflows/deepResearch.md"
  }
];

export function registerUserGuideResources(server: McpServer): void {
  // Register each user guide resource
  USER_GUIDE_RESOURCES.forEach(guide => {
    server.resource(
      guide.uri,
      guide.name,
      {
        description: guide.description,
        mimeType: guide.mimeType
      },
      async () => {
        log(`Serving user guide resource: ${guide.uri}`);
        
        // Load content from file if contentPath is specified
        let content: string;
        if (guide.contentPath) {
          // Use relative path from the built .smithery directory
          const fullPath = join(process.cwd(), 'src', 'resources', guide.contentPath);
          try {
            content = readFileSync(fullPath, 'utf-8');
          } catch (error) {
            log(`Error reading workflow file ${fullPath}: ${error}`);
            content = "Error loading workflow content";
          }
        } else if (guide.content) {
          content = guide.content;
        } else {
          content = "Content not available";
        }
        
        return {
          contents: [{
            uri: guide.uri,
            mimeType: guide.mimeType,
            text: content
          }]
        };
      }
    );
  });
  
  log(`Registered ${USER_GUIDE_RESOURCES.length} user guide resources`);
}