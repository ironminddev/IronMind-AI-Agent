# IronMind AI Agent

IronMind AI Agent is an intelligent node monitoring and traffic scheduling system that serves as the "brain" of the network, providing real-time monitoring, intelligent traffic distribution, and node performance scoring.

## 🌟 Core Features

- **Real-time Node Monitoring**
  - Node uptime detection
  - Bandwidth usage monitoring
  - Latency performance measurement
  - Automated health checks

- **Intelligent Traffic Scheduling**
  - Performance-based dynamic allocation
  - Load balancing algorithms
  - Automatic fault node isolation
  - Smart recovery mechanisms

- **Node Scoring System**
  - Multi-dimensional performance evaluation
  - $IRON token reward calculation
  - Historical data tracking
  - Real-time score updates

- **Data Management**
  - Node state persistence
  - Historical data storage
  - Performance metrics analysis
  - Extensible storage backend

## 🏗️ System Architecture

The system consists of the following core modules:

- `monitor.js`: Node health monitoring module
  - Periodic health checks
  - Performance metrics collection
  - Status report generation

- `scheduler.js`: Traffic scheduler
  - Intelligent node selection
  - Load balancing
  - User assignment management

- `scoring.js`: Node scoring system
  - Performance score calculation
  - Reward allocation
  - Historical data analysis

- `isolation.js`: Node isolation management
  - Fault detection
  - Automatic isolation
  - Recovery mechanisms

- `database.js`: Data persistence
  - Node data storage
  - Historical record management
  - Data cleanup

- `config.js`: System configuration
  - Adjustable parameters
  - Environment settings
  - System constants

## 🚀 Quick Start

### Prerequisites
  - Node.js >= 14.x
  - npm >= 6.x
  - Modern browser support

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ironminddev/IronMind-AI-Agent.git
   cd IronMind-AI-Agent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the system:
   Edit `ai-agent/config.js` file to set:
   - Monitoring intervals
   - Node isolation thresholds
   - Scoring weights
   - Database settings
   - API configuration

4. Start the system:
   ```bash
   npm start
   ```

## 📡 API Endpoints

### Node Management
- `GET /health`: System health check
- `GET /nodes/status`: Get all node statuses
- `POST /nodes/assign`: Assign best node to user
- `GET /nodes/scores`: Get node performance scores
- `GET /nodes/isolated`: Get isolated nodes list

### Request Examples
```bash
# Get node status
curl http://localhost:3000/nodes/status

# Assign node
curl -X POST http://localhost:3000/nodes/assign \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123"}'
```

## ⚙️ Configuration

### Monitoring Settings
```javascript
MONITOR_INTERVAL: 30000,    // Monitoring interval (milliseconds)
HEALTH_CHECK_TIMEOUT: 5000  // Health check timeout (milliseconds)
```

### Isolation Settings
```javascript
MAX_FAILURES: 3,           // Maximum failure count
ISOLATION_DURATION: 300000 // Isolation duration (milliseconds)
```

### Scoring Weights
```javascript
SCORING_WEIGHTS: {
  bandwidth: 0.4,  // Bandwidth weight
  uptime: 0.3,     // Uptime weight
  latency: 0.3     // Latency weight
}
```

## 🔧 Development Guide

### Extending Functionality
1. AI Learning Module (Phase 2)
   - TensorFlow.js integration
   - Predictive model implementation
   - Scheduling strategy optimization

2. Database Upgrade
   - Redis integration
   - MongoDB support
   - Data migration tools

3. Monitoring Metrics Extension
   - Custom metrics
   - Alert system
   - Performance analysis

### Testing
```bash
# Run tests
npm test

# Test coverage
npm run test:coverage
```

## 📈 Performance Optimization

- Use connection pools for database connections
- Implement caching mechanisms
- Optimize data queries
- Load balancing strategies

## 🔐 Security Recommendations

- Use environment variables for sensitive information
- Implement API authentication
- Enable HTTPS
- Regular security audits

## 📝 Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License

## 🤝 Contact & Resources

- **Website**: [www.ironmindai.xyz](https://www.ironmindai.xyz)
- **Twitter**: [@IronMind_AI](https://twitter.com/IronMind_AI)
- **GitHub**: [ironminddev/IronMind-AI-Agent](https://github.com/ironminddev/IronMind-AI-Agent) 