# MCP Integration Suite Server

Ein ModelContextProtocol (MCP) Server für die SAP Integration Suite, der Integration Package Discover und Design unterstützt.

## Features

- **Integration Package Discover**: Alle verfügbaren Integration Packages anzeigen und Details zu einzelnen Packages abrufen
- **Integration Package Design**: Neue Integration Packages erstellen und bestehende aktualisieren

## Tools

Der Server implementiert folgende MCP-Tools:

1. `discoverIntegrationPackages`: Listet alle verfügbaren Integration Packages auf
2. `getIntegrationPackageDetails`: Ruft Details eines spezifischen Integration Package ab
3. `createIntegrationPackage`: Erstellt ein neues Integration Package
4. `updateIntegrationPackage`: Aktualisiert ein bestehendes Integration Package

## Resources

Der Server implementiert folgende MCP-Ressourcen:

- `integrationPackages://`: Listet alle Integration Packages auf
- `integrationPackages://{id}`: Ruft ein spezifisches Integration Package ab

## Installation

```bash
# Abhängigkeiten installieren
npm install

# TypeScript kompilieren
npm run build
```

## Konfiguration

Erstellen Sie eine `.env`-Datei mit folgenden Umgebungsvariablen:

```
PORT=3000
MCP_BASE_URL=https://your-sap-integration-suite-url
MCP_AUTH_TOKEN=your-auth-token
USE_WEBSOCKET=false
```

## Verwendung

```bash
# Server starten
npm start

# Oder im Entwicklungsmodus mit automatischem Neuladen
npm run dev
```

## Integration mit LLMs und AI-Assistenten

Dieser MCP-Server kann in LLMs und AI-Assistenten integriert werden, um diesen Zugriff auf SAP Integration Suite Funktionen zu geben.

```typescript
// Beispiel-Integration mit einem AI-Assistenten
import { McpClient } from "@modelcontextprotocol/sdk/client";

const client = new McpClient();
await client.connect(transport);

// Integration Package entdecken
const packagesList = await client.tools.discoverIntegrationPackages();

// Neues Integration Package erstellen
const newPackage = await client.tools.createIntegrationPackage({
	name: "Mein neues Package",
	shortText: "Beschreibung für mein neues Package",
	version: "1.0.0",
});
```
