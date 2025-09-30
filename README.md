# Y Combinator Startup Validator MCP Server 🚀

[![npm version](https://badge.fury.io/js/yc-startup-validator-mcp.svg)](https://www.npmjs.com/package/yc-startup-validator-mcp)

A Model Context Protocol (MCP) server that provides startup validation feedback from YC legends and comprehensive validation workflows. Get insights from the minds of Paul Graham, Garry Tan, Jessica Livingston, and other Y Combinator icons.

## ✨ Features

### 🧠 "Ask A God" Toolset
Get personalized startup feedback from YC legends:
- **Paul Graham**: Essay-style deep thinking, contrarian insights, user love focus
- **Garry Tan**: Growth metrics, product-market fit, scalability assessment  
- **Jessica Livingston**: Team dynamics, founder resilience, startup psychology
- **Sam Altman**: Vision, execution, market timing analysis
- **Michael Seibel**: Product development, user feedback loops, practical building
- **Dalton Caldwell**: Technical feasibility, platform risk, defensibility
- **Peter Thiel**: Monopoly potential, 10x improvement, contrarian truth discovery

### 📊 YC Validation Workflows
Research-backed validation processes:
- **YC Idea Validator & Refinement Engine**: Complete YC application preparation
- **10x Better Framework**: Assess if your solution is truly 10x better
- **Technology Architecture Decision Engine**: Make high-quality technical specifications
- **Market Entry Intelligence**: Comprehensive market analysis
- **Competitive Analysis & Strategy**: Deep competitive landscape research

### 🔍 Powered by Exa AI
All evaluations are backed by real-time research using Exa's search capabilities for the most current insights and data.

## 🚀 Quick Start

### NPM Installation

```bash
npm install -g yc-startup-validator-mcp
```

### Claude Desktop Configuration

Add this to your Claude Desktop configuration file:

```json
{
  "mcpServers": {
    "yc-validator": {
      "command": "npx",
      "args": ["-y", "yc-startup-validator-mcp"],
      "env": {
        "EXA_API_KEY": "your-exa-api-key-here"
      }
    }
  }
}
```

### Getting Your Exa API Key

1. Visit [dashboard.exa.ai/api-keys](https://dashboard.exa.ai/api-keys)
2. Sign up or log in to get your free API key
3. Replace `your-exa-api-key-here` with your actual key

## 🛠 Available Tools

### 🧠 Ask A God Tool
**Tool**: `ask_a_god`

Get startup feedback from YC legends with their signature evaluation styles:

```
ask_a_god:
  legend: paul_graham | garry_tan | jessica_livingston | sam_altman | michael_seibel | dalton_caldwell | peter_thiel
  evaluation_type: idea_validation | market_analysis | founder_assessment | product_critique | business_model_review | pitch_deck_feedback
  startup_description: "Your startup description here"
  context: 
    stage: idea | pre-seed | seed | series-a
    industry: "Your industry"
    team_size: number
    current_metrics: "Optional metrics"
```

**Example Usage:**
```
Ask Paul Graham to validate my AI-powered fitness app idea for busy professionals
```

### 📋 YC Validation Workflows (Resources)
Access comprehensive validation processes:

- **YC Idea Validator**: `guide://yc-idea-validator` - Complete YC application preparation workflow
- **10x Better Framework**: `guide://10x-better-framework` - Assess breakthrough potential 
- **Technology Architecture**: `guide://tech-architecture-decision` - Make technical decisions
- **Market Entry Intelligence**: `guide://market-entry-intelligence` - Market analysis workflow

## 🎯 Use Cases

### For Founders
- **Validate startup ideas** with YC legend perspectives
- **Prepare YC applications** using proven frameworks
- **Get specific feedback** on pitch decks and business models
- **Research competitive landscapes** with YC-style analysis

### For Investors
- **Evaluate startups** using YC criteria and frameworks
- **Assess 10x potential** with research-backed analysis
- **Due diligence support** with comprehensive market research

### For Accelerators & VCs
- **Standardize evaluation** using proven YC methods
- **Train teams** on YC-style startup assessment
- **Research portfolio companies** and competitive landscapes

## 📖 Example Interactions

### Get Paul Graham's Take
```
"What would Paul Graham think of my AI tutoring platform for K-12 students?"

Response includes:
- Paul's likely assessment and concerns
- His signature probing questions
- Focus on user love and fundamentals
- Recommendations for next steps
```

### Validate 10x Potential
```
"Is my autonomous delivery drone solution truly 10x better?"

Uses the 10x Better Framework to assess:
- Comparison to current alternatives
- Monopoly characteristics analysis
- YC community consensus validation
- Peter Thiel contrarian insights
```

### YC Application Prep
```
"Help me prepare my YC application for a fintech startup"

Runs YC Idea Validator workflow:
- Market timing analysis
- Competitive landscape research
- Founder-market fit assessment
- Rapid validation experiments
- Application optimization
```

## 🔧 Configuration

### Claude Desktop Setup

#### For macOS:
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### For Windows:
```powershell
code %APPDATA%\Claude\claude_desktop_config.json
```

Add the YC Validator configuration:

```json
{
  "mcpServers": {
    "yc-validator": {
      "command": "npx",
      "args": ["-y", "yc-startup-validator-mcp"],
      "env": {
        "EXA_API_KEY": "your-exa-api-key-here"
      }
    }
  }
}
```

### Restart Claude Desktop
1. Completely quit Claude Desktop 
2. Start Claude Desktop again
3. Look for the 🚀 icon to verify the server is connected

## 🏗 Development

### Local Development
```bash
git clone https://github.com/b-c-nims/yc-startup-validator-mcp.git
cd yc-startup-validator-mcp
npm install
npm run dev
```

### Building
```bash
npm run build        # Build for HTTP transport
npm run build:stdio  # Build for STDIO transport
```

### Testing
```bash
npm run inspector    # Test with MCP inspector
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

## 📜 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- **Y Combinator** - For the incredible startup wisdom and frameworks
- **Exa AI** - For powering our research capabilities  
- **Claude Code** - For development assistance
- **Clear Thought** - For advanced reasoning capabilities

---

**Get legendary startup advice. Validate with YC precision. Build something people want.** 🚀

Built with ❤️ for the startup community