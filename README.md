# MCP Integration Suite Server

A ModelContextProtocol (MCP) Server for SAP Integration Suite.

## Requirements
NodeJs and NPM (Node Version > 21 because of native NodeJS fetch)

## Installation
```sh
git clone https://github.com/1nbuc/mcp-integration-suite.git
cd mcp-integration-suite
npm install
npm run build
```
Add this to your AI Clients MCP Config. 
For Claude Desktop: `~/Library/Application\ Support/Claude/claude_desktop_config.json`
```json
{
  "mcpServers": {
    "mcp-integration-suite": {
      "command": "node",
      "args": [
        "<project path>/dist/index.js"
      ],
      "autoApprove": []
    }
  }
}
```

## Custom Prompt
```
# Instructions for tool mcp-integration-suite
This server provides tools for interacting with an SAP Integration Suite via API. Sometimes also called SAP CPI


```

## TODOs
- Provide default prompt
- CSRF implementation
- Test Message mappings