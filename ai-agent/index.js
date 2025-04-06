const express = require('express');
const config = require('./config');
const monitor = require('./monitor');
const scheduler = require('./scheduler');
const scoring = require('./scoring');
const isolation = require('./isolation');
const database = require('./database');

// Initialize global references
global.monitor = monitor;
global.scheduler = scheduler;
global.scoring = scoring;
global.isolation = isolation;
global.database = database;

class IronMindAgent {
    constructor() {
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
        this.startMonitoring();
    }

    setupMiddleware() {
        this.app.use(express.json());
    }

    setupRoutes() {
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({ status: 'healthy' });
        });

        // Get node status
        this.app.get('/nodes/status', async (req, res) => {
            const nodes = await monitor.monitorAllNodes();
            res.json(nodes);
        });

        // Get best node for user
        this.app.post('/nodes/assign', async (req, res) => {
            const { userId } = req.body;
            if (!userId) {
                return res.status(400).json({ error: 'userId is required' });
            }

            const nodeUrl = await scheduler.assignNodeToUser(userId);
            res.json({ nodeUrl });
        });

        // Get node scores
        this.app.get('/nodes/scores', (req, res) => {
            const scores = Array.from(scoring.nodeScores.entries());
            res.json(scores);
        });

        // Get isolated nodes
        this.app.get('/nodes/isolated', (req, res) => {
            const isolatedNodes = isolation.getIsolatedNodes();
            res.json(isolatedNodes);
        });
    }

    async startMonitoring() {
        // Initial node data load
        const savedData = await database.loadNodeData();
        for (const [nodeUrl, nodeData] of Object.entries(savedData)) {
            monitor.addNode(nodeUrl, nodeData);
        }

        // Start monitoring loop
        setInterval(async () => {
            try {
                // Monitor all nodes
                const nodes = await monitor.monitorAllNodes();
                
                // Update scores and check isolation
                for (const node of nodes) {
                    // Update scoring
                    scoring.updateNodeScore(node.url, node);
                    
                    // Check isolation status
                    await isolation.checkNode(node.url, node);
                    
                    // Save metrics to database
                    await database.saveNodeMetrics(node.url, node);
                }

                // Attempt recovery of isolated nodes
                const isolatedNodes = isolation.getIsolatedNodes();
                for (const { url } of isolatedNodes) {
                    await isolation.attemptRecovery(url);
                }

                // Cleanup old data periodically
                await database.cleanupOldData();
            } catch (error) {
                console.error('Error in monitoring loop:', error);
            }
        }, config.MONITOR_INTERVAL);
    }

    start() {
        const port = config.API.port;
        this.app.listen(port, () => {
            console.log(`IronMind AI Agent running on port ${port}`);
        });
    }
}

// Create and start the agent
const agent = new IronMindAgent();
agent.start(); 