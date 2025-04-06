const axios = require('axios');
const config = require('./config');

class NodeMonitor {
    constructor() {
        this.nodes = new Map();
    }

    async checkNodeStatus(nodeUrl) {
        try {
            const start = Date.now();
            const response = await axios.get(`${nodeUrl}${config.API.endpoints.health}`, {
                timeout: config.HEALTH_CHECK_TIMEOUT
            });
            const latency = Date.now() - start;
            
            return {
                online: true,
                latency,
                bandwidth: response.data.bandwidth || 0,
                lastChecked: Date.now()
            };
        } catch (error) {
            return {
                online: false,
                latency: null,
                bandwidth: 0,
                lastChecked: Date.now(),
                error: error.message
            };
        }
    }

    async monitorAllNodes() {
        const results = [];
        for (const [nodeUrl, nodeData] of this.nodes) {
            const status = await this.checkNodeStatus(nodeUrl);
            results.push({
                url: nodeUrl,
                ...status,
                ...nodeData
            });
        }
        return results;
    }

    addNode(nodeUrl, metadata = {}) {
        this.nodes.set(nodeUrl, {
            ...metadata,
            failures: 0,
            status: 'active'
        });
    }

    removeNode(nodeUrl) {
        this.nodes.delete(nodeUrl);
    }

    getNodeStatus(nodeUrl) {
        return this.nodes.get(nodeUrl);
    }
}

module.exports = new NodeMonitor(); 