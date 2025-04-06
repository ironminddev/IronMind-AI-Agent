const config = require('./config');

class NodeIsolation {
    constructor() {
        this.isolatedNodes = new Map();
        this.recoveryAttempts = new Map();
    }

    async checkNode(nodeUrl, status) {
        const nodeData = this.isolatedNodes.get(nodeUrl) || {
            failures: 0,
            lastFailure: null,
            isolationStart: null
        };

        if (!status.online) {
            nodeData.failures++;
            nodeData.lastFailure = Date.now();

            if (nodeData.failures >= config.MAX_FAILURES) {
                await this.isolateNode(nodeUrl);
            }
        } else {
            // Reset failure count on successful check
            nodeData.failures = 0;
        }

        this.isolatedNodes.set(nodeUrl, nodeData);
        return nodeData;
    }

    async isolateNode(nodeUrl) {
        const nodeData = this.isolatedNodes.get(nodeUrl);
        if (!nodeData) return;

        nodeData.isolationStart = Date.now();
        nodeData.status = 'isolated';
        this.isolatedNodes.set(nodeUrl, nodeData);

        // Notify other modules about isolation
        global.monitor.removeNode(nodeUrl);
        global.scheduler.removeNodeFromPool(nodeUrl);

        console.log(`Node ${nodeUrl} has been isolated due to repeated failures`);
    }

    async attemptRecovery(nodeUrl) {
        const nodeData = this.isolatedNodes.get(nodeUrl);
        if (!nodeData || nodeData.status !== 'isolated') return false;

        const isolationDuration = Date.now() - nodeData.isolationStart;
        if (isolationDuration < config.ISOLATION_DURATION) {
            return false;
        }

        // Check if node is healthy
        const status = await global.monitor.checkNodeStatus(nodeUrl);
        if (status.online) {
            await this.recoverNode(nodeUrl);
            return true;
        }

        return false;
    }

    async recoverNode(nodeUrl) {
        const nodeData = this.isolatedNodes.get(nodeUrl);
        if (!nodeData) return;

        nodeData.status = 'active';
        nodeData.failures = 0;
        nodeData.isolationStart = null;
        this.isolatedNodes.set(nodeUrl, nodeData);

        // Re-add node to monitoring and scheduling
        global.monitor.addNode(nodeUrl);
        global.scheduler.addNodeToPool(nodeUrl);

        console.log(`Node ${nodeUrl} has been recovered and is back online`);
    }

    getIsolatedNodes() {
        return Array.from(this.isolatedNodes.entries())
            .filter(([_, data]) => data.status === 'isolated')
            .map(([url, data]) => ({
                url,
                failures: data.failures,
                isolationStart: data.isolationStart
            }));
    }

    isNodeIsolated(nodeUrl) {
        const nodeData = this.isolatedNodes.get(nodeUrl);
        return nodeData && nodeData.status === 'isolated';
    }
}

module.exports = new NodeIsolation(); 