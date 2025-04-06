const config = require('./config');

class TrafficScheduler {
    constructor() {
        this.currentAssignments = new Map();
    }

    selectBestNode(nodes) {
        // Filter out isolated and offline nodes
        const availableNodes = nodes.filter(node => 
            node.online && 
            node.status === 'active'
        );

        if (availableNodes.length === 0) {
            return null;
        }

        // Sort nodes by score (combination of latency and bandwidth)
        const scoredNodes = availableNodes.map(node => ({
            ...node,
            score: this.calculateNodeScore(node)
        }));

        scoredNodes.sort((a, b) => b.score - a.score);

        // Add randomization factor to prevent all traffic going to the same node
        const topNodes = scoredNodes.slice(0, Math.min(3, scoredNodes.length));
        const randomIndex = Math.floor(Math.random() * topNodes.length);
        
        return topNodes[randomIndex];
    }

    calculateNodeScore(node) {
        const { latency, bandwidth } = node;
        if (!latency || latency === 0) return 0;
        
        // Basic scoring formula: bandwidth / latency
        // Higher bandwidth and lower latency = better score
        return bandwidth / latency;
    }

    assignNodeToUser(userId) {
        const currentAssignment = this.currentAssignments.get(userId);
        if (currentAssignment) {
            return currentAssignment;
        }

        // Get current node status from monitor
        const nodes = global.monitor.monitorAllNodes();
        const bestNode = this.selectBestNode(nodes);
        
        if (bestNode) {
            this.currentAssignments.set(userId, bestNode.url);
            return bestNode.url;
        }

        return null;
    }

    removeUserAssignment(userId) {
        this.currentAssignments.delete(userId);
    }

    getCurrentAssignments() {
        return Array.from(this.currentAssignments.entries());
    }
}

module.exports = new TrafficScheduler(); 