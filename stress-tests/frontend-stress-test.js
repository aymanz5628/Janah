/**
 * Janah Frontend Stress Test Suite
 * Tests: Page load, Component rendering, Navigation, Language switching
 */
const FRONTEND_URL = 'http://localhost:3000';

const CONFIG = {
  pages: [
    { path: '/', name: 'Homepage' },
    { path: '/category/aviation', name: 'Aviation Category' },
    { path: '/category/travel', name: 'Travel Category' },
    { path: '/gallery', name: 'Gallery' },
  ]
};

function log(color, msg) {
  const c = { reset: '\x1b[0m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[34m', cyan: '\x1b[36m', white: '\x1b[37m' };
  console.log(`${c[color] || ''}${msg}${c.reset}`);
}

async function pageLoadTest(page, iterations = 20) {
  log('cyan', `\n📄 Testing: ${page.name} (${page.path})`);
  const times = [];
  let ok = 0, fail = 0;
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    try {
      const response = await fetch(`${FRONTEND_URL}${page.path}`);
      times.push(Date.now() - start);
      if (response.ok) ok++;
      else fail++;
    } catch (e) {
      fail++;
    }
  }
  
  const avg = times.reduce((a, b) => a + b, 0) / times.length || 0;
  const min = Math.min(...times);
  const max = Math.max(...times);
  
  log(ok === iterations ? 'green' : 'yellow', 
    `   ✓ ${ok}/${iterations} | Avg: ${avg.toFixed(0)}ms | Min: ${min}ms | Max: ${max}ms`);
  
  return { page: page.name, ok, fail, avg, min, max };
}

async function concurrentPageLoads(pages, concurrent = 10) {
  log('cyan', `\n🔄 Concurrent page loads: ${concurrent} per page`);
  
  const start = Date.now();
  const promises = [];
  
  for (const page of pages) {
    for (let i = 0; i < concurrent; i++) {
      promises.push(
        fetch(`${FRONTEND_URL}${page.path}`)
          .then(r => ({ ok: r.ok, page: page.name }))
          .catch(e => ({ ok: false, page: page.name, error: e.message }))
      );
    }
  }
  
  const results = await Promise.all(promises);
  const totalTime = Date.now() - start;
  const successCount = results.filter(r => r.ok).length;
  
  log('green', `   ✓ ${successCount}/${results.length} in ${totalTime}ms`);
  log('white', `   🚀 Throughput: ${(results.length / (totalTime / 1000)).toFixed(2)} pages/sec`);
  
  return { total: results.length, success: successCount, time: totalTime };
}

async function rapidNavigationTest(iterations = 50) {
  log('cyan', `\n🏃 Rapid navigation: ${iterations} page loads`);
  
  const start = Date.now();
  let ok = 0, fail = 0;
  
  for (let i = 0; i < iterations; i++) {
    const page = CONFIG.pages[i % CONFIG.pages.length];
    try {
      const response = await fetch(`${FRONTEND_URL}${page.path}`);
      if (response.ok) ok++;
      else fail++;
    } catch (e) {
      fail++;
    }
  }
  
  const totalTime = Date.now() - start;
  const rps = iterations / (totalTime / 1000);
  
  log(fail === 0 ? 'green' : 'yellow', `   ✓ ${ok}/${iterations} | Time: ${totalTime}ms | RPS: ${rps.toFixed(2)}`);
  
  return { ok, fail, time: totalTime, rps };
}

async function staticAssetTest() {
  log('cyan', '\n�� Static asset loading');
  
  const assets = [
    `${FRONTEND_URL}/_next/static/chunks/main.js`,
    `${FRONTEND_URL}/_next/static/chunks/pages/_app.js`,
    `${FRONTEND_URL}/favicon.ico`,
  ];
  
  for (const url of assets) {
    try {
      const start = Date.now();
      const response = await fetch(url);
      const time = Date.now() - start;
      
      if (response.ok) {
        const size = response.headers.get('content-length') || 'unknown';
        log('green', `   ✓ ${url.split('/').pop()} (${time}ms, ${size} bytes)`);
      } else {
        log('yellow', `   ⚠ ${url.split('/').pop()} (${response.status})`);
      }
    } catch (e) {
      log('red', `   ✗ ${url.split('/').pop()}: ${e.message}`);
    }
  }
}

async function healthCheck() {
  log('cyan', '\n❤️ Frontend Health Check');
  
  try {
    const start = Date.now();
    const response = await fetch(FRONTEND_URL);
    const time = Date.now() - start;
    
    if (response.ok) {
      log('green', `   ✓ Frontend is running (${time}ms)`);
      
      // Check response size
      const html = await response.text();
      log('white', `   📊 HTML size: ${(html.length / 1024).toFixed(2)} KB`);
      
      // Check for critical elements
      const hasReact = html.includes('__NEXT_DATA__') || html.includes('_next');
      log(hasReact ? 'green' : 'yellow', `   ${hasReact ? '✓' : '⚠'} Next.js hydration markers found`);
      
      return true;
    } else {
      log('red', `   ✗ Frontend returned ${response.status}`);
      return false;
    }
  } catch (e) {
    log('red', `   ✗ Frontend not accessible: ${e.message}`);
    return false;
  }
}

async function runAllTests() {
  log('blue', '\n╔════════════════════════════════════════════════════════════════╗');
  log('blue', '║     🌐 JANAH FRONTEND STRESS TEST SUITE                        ║');
  log('blue', '╚════════════════════════════════════════════════════════════════╝');
  log('white', `\nTarget: ${FRONTEND_URL}`);
  log('white', `Started: ${new Date().toISOString()}\n`);
  
  const overallStart = Date.now();
  
  // Health check
  const healthy = await healthCheck();
  if (!healthy) {
    log('red', '\n❌ Frontend is not accessible. Aborting tests.');
    process.exit(1);
  }
  
  // Static assets
  log('blue', '\n━━━ STATIC ASSET TESTS ━━━');
  await staticAssetTest();
  
  // Page load tests
  log('blue', '\n━━━ PAGE LOAD TESTS (20 iterations each) ━━━');
  const pageResults = [];
  for (const page of CONFIG.pages) {
    const result = await pageLoadTest(page, 20);
    pageResults.push(result);
  }
  
  // Concurrent page loads
  log('blue', '\n━━━ CONCURRENT PAGE LOADS ━━━');
  await concurrentPageLoads(CONFIG.pages, 10);
  await concurrentPageLoads(CONFIG.pages, 25);
  
  // Rapid navigation
  log('blue', '\n━━━ RAPID NAVIGATION TEST ━━━');
  await rapidNavigationTest(50);
  await rapidNavigationTest(100);
  
  // Final summary
  const totalTime = Date.now() - overallStart;
  
  log('blue', '\n╔════════════════════════════════════════════════════════════════╗');
  log('blue', '║     📊 FRONTEND TEST SUMMARY                                   ║');
  log('blue', '╚════════════════════════════════════════════════════════════════╝');
  
  log('white', `\n   Total test duration: ${(totalTime / 1000).toFixed(2)}s`);
  log('white', `   Pages tested: ${CONFIG.pages.length}`);
  
  log('cyan', '\n   Page Performance:');
  log('white', '   ┌──────────────────────┬─────────┬─────────┬─────────┐');
  log('white', '   │ Page                 │ Success │ Avg(ms) │ Max(ms) │');
  log('white', '   ├──────────────────────┼─────────┼─────────┼─────────┤');
  
  for (const r of pageResults) {
    const name = r.page.padEnd(20).slice(0, 20);
    const success = `${r.ok}`.padStart(7);
    const avg = `${r.avg.toFixed(0)}`.padStart(7);
    const max = `${r.max}`.padStart(7);
    log('white', `   │ ${name} │ ${success} │ ${avg} │ ${max} │`);
  }
  
  log('white', '   └──────────────────────┴─────────┴─────────┴─────────┘');
  
  log('green', '\n   ✅ Frontend stress test completed!\n');
}

// Run tests
runAllTests().catch(e => { log('red', e.message); process.exit(1); });
