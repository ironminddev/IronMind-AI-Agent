const fs = require('fs');
const path = require('path');
const config = require('./config');

class Database {
    constructor() {
        this.dataPath = path.join(process.cwd(), config.DATABASE.path);
        this.ensureDataDirectory();
    }

    ensureDataDirectory() {
        const dir = path.dirname(this.dataPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    async saveNodeData(nodeData) {
        try {
            const data = JSON.stringify(nodeData, null, 2);
            await fs.promises.writeFile(this.dataPath, data);
            return true;
        } catch (error) {
            console.error('Error saving node data:', error);
            return false;
        }
    }

    async loadNodeData() {
        try {
            if (!fs.existsSync(this.dataPath)) {
                return {};
            }
            const data = await fs.promises.readFile(this.dataPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading node data:', error);
            return {};
        }
    }

    async saveNodeMetrics(nodeUrl, metrics) {
        try {
            const data = await this.loadNodeData();
            data[nodeUrl] = {
                ...data[nodeUrl],
                metrics,
                lastUpdated: Date.now()
            };
            await this.saveNodeData(data);
            return true;
        } catch (error) {
            console.error('Error saving node metrics:', error);
            return false;
        }
    }

    async getNodeMetrics(nodeUrl) {
        try {
            const data = await this.loadNodeData();
            return data[nodeUrl]?.metrics || null;
        } catch (error) {
            console.error('Error getting node metrics:', error);
            return null;
        }
    }

    async saveHistoricalData(nodeUrl, historicalData) {
        try {
            const data = await this.loadNodeData();
            data[nodeUrl] = {
                ...data[nodeUrl],
                historicalData,
                lastUpdated: Date.now()
            };
            await this.saveNodeData(data);
            return true;
        } catch (error) {
            console.error('Error saving historical data:', error);
            return false;
        }
    }

    async getHistoricalData(nodeUrl) {
        try {
            const data = await this.loadNodeData();
            return data[nodeUrl]?.historicalData || [];
        } catch (error) {
            console.error('Error getting historical data:', error);
            return [];
        }
    }

    async cleanupOldData(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 days
        try {
            const data = await this.loadNodeData();
            const now = Date.now();
            
            for (const [nodeUrl, nodeData] of Object.entries(data)) {
                if (now - nodeData.lastUpdated > maxAge) {
                    delete data[nodeUrl];
                }
            }
            
            await this.saveNodeData(data);
            return true;
        } catch (error) {
            console.error('Error cleaning up old data:', error);
            return false;
        }
    }
}

module.exports = new Database(); 