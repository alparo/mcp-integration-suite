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

# TODOs
- Provide default prompt
- CSRF implementation
- Test Message mappings