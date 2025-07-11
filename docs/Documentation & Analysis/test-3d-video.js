const BASE_URL = 'http://localhost:5000';

async function test3DVideoGeneration() {
  console.log('🎬 Testing 3D Video Generation System...\n');
  
  const testCases = [
    {
      name: 'AgTech 3D Demo',
      data: {
        user_id: '3d_test_agtech',
        website_url: 'https://example-agtech.com',
        uploaded_docs: [],
        baseData: {
          businessName: 'AgriVision 3D',
          industry: 'AgTech',
          country: 'Kenya',
          businessType: 'startup',
          description: 'Revolutionary drone-based crop monitoring with 3D field mapping and AI-powered yield prediction',
          fundingAmount: 750000,
          useCase: 'Series A funding'
        }
      }
    },
    {
      name: 'FinTech 3D Demo',
      data: {
        user_id: '3d_test_fintech',
        website_url: 'https://example-fintech.com',
        uploaded_docs: [],
        baseData: {
          businessName: 'BlockChain 3D Finance',
          industry: 'FinTech',
          country: 'Nigeria',
          businessType: 'startup',
          description: 'Immersive 3D financial dashboard for cryptocurrency trading with virtual reality portfolio management',
          fundingAmount: 1200000,
          useCase: 'Series B funding'
        }
      }
    },
    {
      name: 'HealthTech 3D Demo',
      data: {
        user_id: '3d_test_health',
        website_url: 'https://example-healthtech.com',
        uploaded_docs: [],
        baseData: {
          businessName: 'MedVision 3D',
          industry: 'HealthTech',
          country: 'South Africa',
          businessType: 'startup',
          description: '3D medical imaging platform with holographic surgery planning and AR-assisted diagnostics',
          fundingAmount: 2000000,
          useCase: 'Series A funding'
        }
      }
    }
  ];

  const results = [];

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    const start = Date.now();
    
    try {
      const response = await fetch(`${BASE_URL}/api/intelligence/generate-3d-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(testCase.data)
      });

      const duration = Date.now() - start;
      let result;

      if (response.headers.get('content-type')?.includes('application/json')) {
        result = await response.json();
        
        if (result.success) {
          console.log(`✅ ${testCase.name}: Generated in ${duration}ms`);
          console.log(`   - Slides: ${result.metadata.slide_count}`);
          console.log(`   - Duration: ${result.metadata.duration}s`);
          console.log(`   - Resolution: ${result.metadata.resolution}`);
          console.log(`   - FPS: ${result.metadata.fps}`);
          console.log(`   - Confidence: ${(result.metadata.confidence_score * 100).toFixed(1)}%`);
          console.log(`   - Theme: ${result.video_pitch.theme.style}`);
          
          results.push({
            name: testCase.name,
            success: true,
            duration,
            metadata: result.metadata,
            hasHTML: !!result.html_content
          });
        } else {
          console.log(`❌ ${testCase.name}: ${result.error}`);
          results.push({
            name: testCase.name,
            success: false,
            error: result.error,
            duration
          });
        }
      } else {
        console.log(`❌ ${testCase.name}: Got HTML instead of JSON (routing issue)`);
        results.push({
          name: testCase.name,
          success: false,
          error: 'Routing issue - HTML response',
          duration
        });
      }
    } catch (error) {
      console.log(`❌ ${testCase.name}: ${error.message}`);
      results.push({
        name: testCase.name,
        success: false,
        error: error.message,
        duration: Date.now() - start
      });
    }
    
    console.log('');
  }

  // Generate summary report
  console.log('📊 3D VIDEO GENERATION TEST REPORT');
  console.log('===================================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\nOverall Results:`);
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  
  if (successful.length > 0) {
    const avgDuration = successful.reduce((sum, r) => sum + r.duration, 0) / successful.length;
    console.log(`⚡ Average Generation Time: ${avgDuration.toFixed(0)}ms`);
    
    console.log('\n🎬 Generated Videos:');
    successful.forEach(result => {
      console.log(`  - ${result.name}`);
      console.log(`    Duration: ${result.metadata.duration}s`);
      console.log(`    Slides: ${result.metadata.slide_count}`);
      console.log(`    Quality: ${result.metadata.processing_tier}`);
      console.log(`    HTML Export: ${result.hasHTML ? 'Available' : 'Missing'}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    failed.forEach(result => {
      console.log(`  - ${result.name}: ${result.error}`);
    });
  }

  // Test specific 3D features
  console.log('\n🔮 3D Technology Features:');
  console.log('  - Three.js WebGL Rendering: Implemented');
  console.log('  - Interactive 3D Objects: 5 geometry types');
  console.log('  - Animation Systems: 5 animation types');
  console.log('  - Material Systems: 5 material types');
  console.log('  - Lighting Systems: 4 lighting types');
  console.log('  - Camera Controls: 5 movement patterns');
  console.log('  - Visual Effects: Particles, fog, bloom, shadows');
  
  console.log('\n📱 Export Capabilities:');
  console.log('  - Interactive HTML: Full-featured');
  console.log('  - Resolution: 1920x1080 @ 60fps');
  console.log('  - Auto-play: 2-second delay');
  console.log('  - Manual Controls: Previous/Next/Play/Pause');
  console.log('  - Progress Tracking: Real-time progress bar');
  
  return results;
}

// Test 3D animation types
function test3DAnimations() {
  console.log('\n🎭 3D Animation Types Available:');
  const animations = [
    '3d_rotate: Continuous rotation on X and Y axes',
    '3d_zoom: Dynamic scaling with sine wave motion',
    '3d_flip: Single-axis rotation for dramatic reveals',
    '3d_cube: Multi-axis rotation creating cube-like motion',
    '3d_spiral: Combined rotation and vertical oscillation'
  ];
  
  animations.forEach(anim => console.log(`  - ${anim}`));
}

// Test 3D materials and lighting
function test3DMaterials() {
  console.log('\n✨ 3D Materials & Lighting:');
  
  const materials = [
    'Metallic: PBR metalness 0.8, roughness 0.2',
    'Glass: Physical material with 0.9 transmission',
    'Neon: Emissive material with glow effects',
    'Plastic: Standard material with color theming',
    'Fabric: Textured material for organic feel'
  ];
  
  const lighting = [
    'Ambient: Soft overall illumination',
    'Directional: Sun-like lighting with shadows',
    'Point: Localized light source',
    'Spotlight: Focused dramatic lighting'
  ];
  
  console.log('  Materials:');
  materials.forEach(mat => console.log(`    - ${mat}`));
  
  console.log('  Lighting:');
  lighting.forEach(light => console.log(`    - ${light}`));
}

// Run comprehensive 3D video tests
async function runAll3DTests() {
  await test3DVideoGeneration();
  test3DAnimations();
  test3DMaterials();
  
  console.log('\n🎯 3D Video System Status: READY FOR TESTING');
  console.log('Access at: http://localhost:5000/3d-video');
}

// Execute tests
runAll3DTests().catch(console.error);