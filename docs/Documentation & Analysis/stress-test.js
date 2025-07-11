const { performance } = require('perf_hooks');

// Comprehensive Stress Testing Suite for ProtoLab
class ProtoLabStressTester {
  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    this.results = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      responseTimes: []
    };
  }

  async runStressTest() {
    console.log('🚀 ProtoLab Production Stress Test Starting...');
    
    // Test 1: Concurrent Pitch Generation
    await this.testPitchGeneration();
    
    // Test 2: Grant Database Load
    await this.testGrantDatabase();
    
    // Test 3: Template Customization
    await this.testTemplateSystem();
    
    // Test 4: Network Resilience
    await this.testNetworkResilience();
    
    console.log('✅ Stress testing completed');
    this.generateReport();
  }

  async testPitchGeneration() {
    console.log('\n=== Testing Pitch Generation Under Load ===');
    const concurrentUsers = 25;
    const promises = [];
    
    for (let i = 0; i < concurrentUsers; i++) {
      promises.push(this.simulateUserPitchGeneration(i));
    }
    
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    
    console.log(`Pitch Generation: ${successful}/${concurrentUsers} successful`);
    console.log(`Success Rate: ${(successful/concurrentUsers * 100).toFixed(1)}%`);
  }

  async simulateUserPitchGeneration(userId) {
    const testData = {
      company: `TestCorp${userId}`,
      industry: 'technology',
      problem: 'Market inefficiency in data processing',
      solution: 'AI-powered automation platform',
      market: 'Global B2B',
      businessModel: 'SaaS subscription'
    };

    const start = performance.now();
    try {
      const response = await fetch(`${this.baseUrl}/api/pitch/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const responseTime = performance.now() - start;
      
      this.recordSuccess(responseTime);
      return data;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  async testGrantDatabase() {
    console.log('\n=== Testing Grant Database Performance ===');
    
    const queries = [
      '/api/grants/all',
      '/api/grants/intelligence?industry=agriculture&country=kenya',
      '/api/grants/intelligence?industry=fintech&country=nigeria',
      '/api/grants/intelligence?industry=healthcare&country=southafrica'
    ];
    
    const concurrentQueries = 50;
    const promises = [];
    
    for (let i = 0; i < concurrentQueries; i++) {
      const query = queries[i % queries.length];
      promises.push(this.testDatabaseQuery(query));
    }
    
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    
    console.log(`Database Queries: ${successful}/${concurrentQueries} successful`);
    console.log(`Success Rate: ${(successful/concurrentQueries * 100).toFixed(1)}%`);
  }

  async testDatabaseQuery(endpoint) {
    const start = performance.now();
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const responseTime = performance.now() - start;
      
      this.recordSuccess(responseTime);
      return data;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  async testTemplateSystem() {
    console.log('\n=== Testing Template Customization System ===');
    
    const templates = ['african_enterprise', 'agritech_green', 'fintech_blue'];
    const themes = ['ubuntu', 'sahara', 'savanna'];
    const concurrent = 15;
    const promises = [];
    
    for (let i = 0; i < concurrent; i++) {
      promises.push(this.testTemplateGeneration(
        templates[i % templates.length],
        themes[i % themes.length]
      ));
    }
    
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    
    console.log(`Template Generation: ${successful}/${concurrent} successful`);
    console.log(`Success Rate: ${(successful/concurrent * 100).toFixed(1)}%`);
  }

  async testTemplateGeneration(templateId, themeId) {
    const requestData = {
      template: { id: templateId, name: 'Test Template' },
      theme: { id: themeId, name: 'Test Theme' },
      customization: {
        colorPrimary: '#D97706',
        colorSecondary: '#92400E',
        colorAccent: '#FCD34D'
      },
      content: {
        title: 'Stress Test Presentation',
        slides: [
          { title: 'Problem Statement', content: ['Testing load capacity'] },
          { title: 'Solution Overview', content: ['Automated stress testing'] }
        ]
      }
    };

    const start = performance.now();
    try {
      const response = await fetch(`${this.baseUrl}/api/pitch/generate-custom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const responseTime = performance.now() - start;
      
      this.recordSuccess(responseTime);
      return data;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  async testNetworkResilience() {
    console.log('\n=== Testing Network Resilience ===');
    
    // Simulate slow network conditions
    const slowRequests = 10;
    const promises = [];
    
    for (let i = 0; i < slowRequests; i++) {
      promises.push(this.testWithDelay(i * 100)); // Staggered requests
    }
    
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    
    console.log(`Network Resilience: ${successful}/${slowRequests} successful`);
    console.log(`Success Rate: ${(successful/slowRequests * 100).toFixed(1)}%`);
  }

  async testWithDelay(delayMs) {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    
    const start = performance.now();
    try {
      const response = await fetch(`${this.baseUrl}/api/grants/all`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const responseTime = performance.now() - start;
      
      this.recordSuccess(responseTime);
      return data;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  recordSuccess(responseTime) {
    this.results.totalRequests++;
    this.results.successfulRequests++;
    this.results.responseTimes.push(responseTime);
  }

  recordFailure() {
    this.results.totalRequests++;
    this.results.failedRequests++;
  }

  generateReport() {
    console.log('\n' + '='.repeat(50));
    console.log('PROTOLAB STRESS TEST REPORT');
    console.log('='.repeat(50));
    
    const { totalRequests, successfulRequests, failedRequests, responseTimes } = this.results;
    
    console.log(`Total Requests: ${totalRequests}`);
    console.log(`Successful: ${successfulRequests}`);
    console.log(`Failed: ${failedRequests}`);
    console.log(`Overall Success Rate: ${(successfulRequests/totalRequests * 100).toFixed(2)}%`);
    
    if (responseTimes.length > 0) {
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      const sortedTimes = responseTimes.sort((a, b) => a - b);
      const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
      const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
      
      console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
      console.log(`95th Percentile: ${p95.toFixed(2)}ms`);
      console.log(`99th Percentile: ${p99.toFixed(2)}ms`);
      console.log(`Min Response Time: ${Math.min(...responseTimes).toFixed(2)}ms`);
      console.log(`Max Response Time: ${Math.max(...responseTimes).toFixed(2)}ms`);
    }
    
    console.log('\nPerformance Assessment:');
    const overallSuccessRate = (successfulRequests/totalRequests * 100);
    
    if (overallSuccessRate >= 95) {
      console.log('✅ EXCELLENT - Production ready');
    } else if (overallSuccessRate >= 90) {
      console.log('⚠️  GOOD - Minor optimizations needed');
    } else if (overallSuccessRate >= 80) {
      console.log('🔶 MODERATE - Significant improvements required');
    } else {
      console.log('❌ CRITICAL - Major issues need addressing');
    }
  }
}

// Auto-run if executed directly
if (typeof window === 'undefined') {
  const tester = new ProtoLabStressTester();
  tester.runStressTest().catch(console.error);
}

module.exports = ProtoLabStressTester;