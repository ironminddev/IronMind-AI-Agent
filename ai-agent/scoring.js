const config = require('./config');

class NodeScoring {
    constructor() {
        this.nodeScores = new Map();
        this.historicalData = new Map();
    }

    calculateNodeScore(nodeData) {
        const { bandwidth, uptime, latency } = nodeData;
        const weights = config.SCORING_WEIGHTS;

        // Normalize values
        const normalizedBandwidth = this.normalizeValue(bandwidth, 0, 1000); // Assuming max bandwidth is 1000 Mbps
        const normalizedUptime = uptime / 100; // Assuming uptime is percentage
        const normalizedLatency = this.normalizeValue(latency, 0, 1000, true); // Assuming max latency is 1000ms

        // Calculate weighted score
        const score = (
            normalizedBandwidth * weights.bandwidth +
            normalizedUptime * weights.uptime +
            normalizedLatency * weights.latency
        );

        return score;
    }

    normalizeValue(value, min, max, inverse = false) {
        if (!value || value === 0) return 0;
        
        const normalized = (value - min) / (max - min);
        return inverse ? 1 - normalized : normalized;
    }

    updateNodeScore(nodeUrl, nodeData) {
        const score = this.calculateNodeScore(nodeData);
        this.nodeScores.set(nodeUrl, {
            score,
            timestamp: Date.now(),
            metrics: {
                bandwidth: nodeData.bandwidth,
                uptime: nodeData.uptime,
                latency: nodeData.latency
            }
        });

        // Store historical data
        if (!this.historicalData.has(nodeUrl)) {
            this.historicalData.set(nodeUrl, []);
        }
        this.historicalData.get(nodeUrl).push({
            score,
            timestamp: Date.now(),
            metrics: nodeData
        });

        // Keep only last 24 hours of data
        this.cleanupHistoricalData();
    }

    cleanupHistoricalData() {
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        for (const [nodeUrl, data] of this.historicalData) {
            this.historicalData.set(
                nodeUrl,
                data.filter(entry => entry.timestamp > oneDayAgo)
            );
        }
    }

    getNodeScore(nodeUrl) {
        return this.nodeScores.get(nodeUrl);
    }

    getHistoricalData(nodeUrl) {
        return this.historicalData.get(nodeUrl) || [];
    }

    calculateReward(nodeUrl) {
        const score = this.nodeScores.get(nodeUrl);
        if (!score) return 0;

        // Basic reward calculation based on score
        // This can be adjusted based on token economics
        const baseReward = 100; // Base reward in $IRON tokens
        return baseReward * score.score;
    }
}

module.exports = new NodeScoring(); 