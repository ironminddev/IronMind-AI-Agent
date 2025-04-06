module.exports = {
    // Node monitoring settings
    MONITOR_INTERVAL: 30000, // 30 seconds
    HEALTH_CHECK_TIMEOUT: 5000, // 5 seconds
    
    // Node isolation settings
    MAX_FAILURES: 3, // Number of failures before isolation
    ISOLATION_DURATION: 300000, // 5 minutes
    
    // Scoring weights
    SCORING_WEIGHTS: {
        bandwidth: 0.4,
        uptime: 0.3,
        latency: 0.3
    },
    
    // Database settings
    DATABASE: {
        type: 'json', // 'json', 'redis', 'mongodb'
        path: './data/nodes.json'
    },
    
    // API settings
    API: {
        port: 3000,
        endpoints: {
            health: '/healthcheck',
            status: '/status',
            nodes: '/nodes'
        }
    }
}; 