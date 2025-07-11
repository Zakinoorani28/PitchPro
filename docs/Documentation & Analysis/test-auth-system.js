import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

class AuthSystemTester {
  constructor() {
    this.results = {
      registration: { status: 'pending', details: null },
      login: { status: 'pending', details: null },
      phoneValidation: { status: 'pending', details: null },
      paymentIntegration: { status: 'pending', details: null },
      analytics: { status: 'pending', details: null }
    };
  }

  async testPhoneValidation() {
    console.log('🔍 Testing African Phone Validation...');
    
    const testPhones = [
      { phone: '+254712345678', country: 'Kenya', valid: true },
      { phone: '+234808123456', country: 'Nigeria', valid: true },
      { phone: '+27821234567', country: 'South Africa', valid: true },
      { phone: '+1234567890', country: 'USA', valid: false }
    ];

    let passedTests = 0;
    for (const test of testPhones) {
      try {
        const response = await axios.post(`${BASE_URL}/api/auth/register`, {
          name: 'Test User',
          phone: test.phone,
          email: 'test@example.com',
          password: 'password123'
        });
        
        if (test.valid && response.status === 200) {
          passedTests++;
        } else if (!test.valid && response.status === 400) {
          passedTests++;
        }
      } catch (error) {
        if (!test.valid && error.response?.status === 400) {
          passedTests++;
        }
      }
    }

    this.results.phoneValidation = {
      status: passedTests === testPhones.length ? 'passed' : 'failed',
      details: `${passedTests}/${testPhones.length} validation tests passed`
    };
  }

  async testRegistration() {
    console.log('📝 Testing User Registration...');
    
    try {
      const userData = {
        name: 'John Mwangi',
        phone: '+254712345678',
        email: 'john@example.com',
        password: 'securepassword123'
      };

      const response = await axios.post(`${BASE_URL}/api/auth/register`, userData);
      
      if (response.data.success && response.data.token) {
        this.results.registration = {
          status: 'passed',
          details: `User registered successfully with JWT token`,
          token: response.data.token,
          user: response.data.user
        };
      } else {
        throw new Error('Registration failed - no token received');
      }
    } catch (error) {
      this.results.registration = {
        status: 'failed',
        details: error.response?.data?.error || error.message
      };
    }
  }

  async testLogin() {
    console.log('🔑 Testing User Login...');
    
    try {
      const loginData = {
        phone: '+254712345678',
        password: 'securepassword123'
      };

      const response = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
      
      if (response.data.success && response.data.token) {
        this.results.login = {
          status: 'passed',
          details: `Login successful with JWT token`,
          token: response.data.token
        };
      } else {
        throw new Error('Login failed - no token received');
      }
    } catch (error) {
      this.results.login = {
        status: 'failed',
        details: error.response?.data?.error || error.message
      };
    }
  }

  async testPaymentIntegration() {
    console.log('💳 Testing Payment Integration...');
    
    try {
      // Test M-Pesa payment
      const mpesaData = {
        amount: 1900,
        phone: '+254712345678',
        accountReference: 'PROTOLAB001'
      };

      const mpesaResponse = await axios.post(`${BASE_URL}/api/payment/mpesa`, mpesaData);
      
      // Test Flutterwave payment
      const flutterwaveData = {
        amount: 19,
        email: 'john@example.com',
        currency: 'USD',
        redirectUrl: 'https://protolab.app/success'
      };

      const flutterwaveResponse = await axios.post(`${BASE_URL}/api/payment/flutterwave`, flutterwaveData);
      
      if (mpesaResponse.data.success && flutterwaveResponse.data.success) {
        this.results.paymentIntegration = {
          status: 'passed',
          details: 'Both M-Pesa and Flutterwave integration working',
          mpesaId: mpesaResponse.data.paymentId,
          flutterwaveId: flutterwaveResponse.data.paymentId
        };
      } else {
        throw new Error('Payment integration failed');
      }
    } catch (error) {
      this.results.paymentIntegration = {
        status: 'failed',
        details: error.response?.data?.error || error.message
      };
    }
  }

  async testAnalytics() {
    console.log('📊 Testing Analytics System...');
    
    try {
      // Test basic analytics endpoint
      const analyticsResponse = await axios.get(`${BASE_URL}/api/admin/analytics`);
      
      if (analyticsResponse.data) {
        this.results.analytics = {
          status: 'passed',
          details: 'Analytics system responding',
          metrics: {
            totalUsers: analyticsResponse.data.userCount || 0,
            revenue: analyticsResponse.data.revenue || 0,
            documents: analyticsResponse.data.documentCount || 0
          }
        };
      } else {
        throw new Error('Analytics endpoint returned no data');
      }
    } catch (error) {
      this.results.analytics = {
        status: 'failed',
        details: error.response?.data?.error || error.message
      };
    }
  }

  async runFullTest() {
    console.log('🚀 Starting Comprehensive Auth System Test...\n');
    
    await this.testPhoneValidation();
    await this.testRegistration();
    await this.testLogin();
    await this.testPaymentIntegration();
    await this.testAnalytics();
    
    this.generateReport();
  }

  generateReport() {
    console.log('\n📊 COMPREHENSIVE AUTH SYSTEM TEST REPORT');
    console.log('==========================================\n');
    
    let totalTests = 0;
    let passedTests = 0;
    
    Object.entries(this.results).forEach(([testName, result]) => {
      totalTests++;
      const status = result.status === 'passed' ? '✅' : '❌';
      const statusText = result.status.toUpperCase();
      
      console.log(`${status} ${testName.toUpperCase()}: ${statusText}`);
      console.log(`   Details: ${result.details}`);
      
      if (result.status === 'passed') {
        passedTests++;
        if (result.token) console.log(`   Token: ${result.token.substring(0, 20)}...`);
        if (result.user) console.log(`   User: ${result.user.name} (${result.user.country})`);
        if (result.metrics) console.log(`   Metrics: ${JSON.stringify(result.metrics)}`);
      }
      console.log('');
    });
    
    console.log(`📈 OVERALL RESULTS: ${passedTests}/${totalTests} tests passed\n`);
    
    if (passedTests === totalTests) {
      console.log('🎯 AUTH SYSTEM STATUS: FULLY OPERATIONAL');
      console.log('=====================================');
      console.log('✅ African phone validation working');
      console.log('✅ User registration with JWT tokens');
      console.log('✅ Secure login authentication');
      console.log('✅ M-Pesa & Flutterwave payment integration');
      console.log('✅ Analytics system responding');
      console.log('\n🚀 Ready for African market deployment with comprehensive user management!');
    } else {
      console.log('⚠️  AUTH SYSTEM STATUS: NEEDS ATTENTION');
      console.log('Some components require fixes before deployment');
    }
  }
}

// Run the test
async function runTest() {
  const tester = new AuthSystemTester();
  await tester.runFullTest();
}

runTest().catch(console.error);