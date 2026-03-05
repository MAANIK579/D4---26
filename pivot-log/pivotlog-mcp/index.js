#!/usr/bin/env node

import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const API_KEY = process.env.PIVOTLOG_API_KEY;
const API_URL = (process.env.PIVOTLOG_API_URL || 'http://localhost:3000').replace(/\/$/, '');

if (!API_KEY) {
    console.error('ERROR: PIVOTLOG_API_KEY is not set. Copy it from your PivotLog dashboard.');
    process.exit(1);
}

// ─── Create the MCP Server ──────────────────────────────────────────────────

const server = new McpServer({
    name: 'PivotLog',
    version: '1.0.0',
    description: 'Log failures (The Wall) and solutions (The Pivot) to your PivotLog account.',
});

// ─── Tool: log_wall ─────────────────────────────────────────────────────────

server.tool(
    'log_wall',
    'Log a new failure or blocker (The Wall) to PivotLog. Use this when you encounter an error, bug, or obstacle during development. Returns a log_id that can be used later with resolve_pivot.',
    {
        initial_goal: z.string().describe('What you were trying to accomplish when the problem occurred.'),
        the_wall: z.string().describe('The specific error, blocker, or failure encountered.'),
        domain: z.string().describe('Category/domain of the issue (e.g., "React", "Node.js", "CSS", "TypeScript", "DevOps").'),
    },
    async ({ initial_goal, the_wall, domain }) => {
        try {
            const response = await fetch(`${API_URL}/api/mcp/log`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({ initial_goal, the_wall, domain }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    content: [{ type: 'text', text: `❌ Failed to log wall: ${data.error || 'Unknown error'}` }],
                    isError: true,
                };
            }

            return {
                content: [{
                    type: 'text',
                    text: `✅ Wall logged successfully!\n\n📋 Log ID: ${data.log_id}\n🎯 Goal: ${initial_goal}\n🧱 Wall: ${the_wall}\n🏷️ Domain: ${domain}\n📊 Status: In Progress\n\nUse resolve_pivot with the log_id above once you find the solution.`,
                }],
            };
        } catch (error) {
            return {
                content: [{ type: 'text', text: `❌ Network error: ${error.message}. Is your PivotLog server running at ${API_URL}?` }],
                isError: true,
            };
        }
    }
);

// ─── Tool: resolve_pivot ────────────────────────────────────────────────────

server.tool(
    'resolve_pivot',
    'Resolve a previously logged wall by providing the solution (The Pivot). Use this once you have found the fix or workaround for a logged issue.',
    {
        log_id: z.string().describe('The UUID log_id returned from a previous log_wall call.'),
        the_pivot: z.string().describe('The solution, fix, or workaround that resolved the issue.'),
    },
    async ({ log_id, the_pivot }) => {
        try {
            const response = await fetch(`${API_URL}/api/mcp/resolve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({ log_id, the_pivot }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    content: [{ type: 'text', text: `❌ Failed to resolve pivot: ${data.error || 'Unknown error'}` }],
                    isError: true,
                };
            }

            return {
                content: [{
                    type: 'text',
                    text: `✅ Pivot resolved successfully!\n\n📋 Log ID: ${data.log_id}\n🔄 Pivot: ${the_pivot}\n📊 Status: Resolved`,
                }],
            };
        } catch (error) {
            return {
                content: [{ type: 'text', text: `❌ Network error: ${error.message}. Is your PivotLog server running at ${API_URL}?` }],
                isError: true,
            };
        }
    }
);

// ─── Start the server ───────────────────────────────────────────────────────

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('PivotLog MCP Server is running...');
}

main().catch((error) => {
    console.error('Fatal error starting PivotLog MCP Server:', error);
    process.exit(1);
});
