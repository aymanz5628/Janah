/**
 * Janah Backend Stress Test Suite
 * Tests working API endpoints only
 */
const BACKEND_URL = 'http://localhost:1337';
const API_BASE = `${BACKEND_URL}/api`;

const CONFIG = {
  endpoints: [
    { method: 'GET', path: '/articles', name: 'List Articles' },
    { method: 'GET', path: '/articles?locale=ar', name: 'Arabic Articles' },
    { method: 'GET', path: '/articles?locale=en', name: 'English Articles' },
    { method: 'GET', path: '/articles?populate=*', name: 'Articles+Relations' },
    { method: 'GET', path: '/categories', name: 'Categories' },
    { method: 'GET', path: '/categories?populate=articles', name: 'Categories+Articles' },
  ]
};

const results = { tests: [] };

function log(color, msg) {
  const c = { reset: '\x1b[0m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[34m', cyan: '\x1b[36m', white: '\x1b[37m' };
  console.log(`${c[color] || ''}${msg}${c.reset}`);
}

async function stressTestEndpoint(endpoint, n = 50) {
  log('cyan', `\n📊 Testing: ${endpoint.name}`);
  const start = Date.now();
  const times = [];
  let ok = 0, fail = 0;
  
  await Promise.all(Array(n).fill().map(async () => {
    const t = Date.now();
    try {
      const r = await fetch(`${API_BASE}${endpoint.path}`);
      times.push(Date.now() - t);
      r.ok ? ok++ : fail++;
    } catch (e) { fail++; }
  }));
  
  const avg = times.reduce((a, b) => a + b, 0) / times.length || 0;
  const rps = n / ((Date.now() - start) / 1000);
  log(ok === n ? 'green' : 'yellow', `   ✓ ${ok}/${n} | Avg: ${avg.toFixed(0)}ms | RPS: ${rps.toFixed(1)}`);
  results.tests.push({ endpoint: endpoint.name, success: ok, avg, rps });
}

async function burstTest(size) {
  log('cyan', `\n💥 Burst: ${size} requests`);
  const start = Date.now();
  const r = await Promise.all(Array(size).fill().map((_, i) => 
    fetch(`${API_BASE}${CONFIG.endpoints[i % CONFIG.endpoints.length].path}`).then(r => r.ok).catch(() => false)
  ));
  const success = r.filter(Boolean).length;
  const rate = ((success/size)*100).toFixed(1);
  log(success === size ? 'green' : 'yellow', `   ${success}/${size} (${rate}%) in ${Date.now() - start}ms`);
}

async function sustainedLoad(duration = 15000, rps = 20) {
  log('cyan', `\n🏋️ Sustained: ${rps} RPS for ${duration/1000}s`);
  const start = Date.now();
  let count = 0, ok = 0;
  while (Date.now() - start < duration) {
    fetch(`${API_BASE}${CONFIG.endpoints[count % CONFIG.endpoints.length].path}`).then(r => r.ok && ok++).catch(() => {});
    count++;
    await new Promise(r => setTimeout(r, 1000/rps));
  }
  await new Promise(r => setTimeout(r, 2000));
  const rate = ((ok/count)*100).toFixed(1);
  log(ok === count ? 'green' : 'yellow', `   ${count} sent, ${ok} OK (${rate}%)`);
}

async function healthCheck() {
  log('cyan', '\n❤️ Health Check');
  for (const url of [BACKEND_URL, `${API_BASE}/articles`, `${API_BASE}/categories`]) {
    try {
      const t = Date.now();
      const r = await fetch(url);
      log(r.ok ? 'green' : 'yellow', `   ${r.ok ? '✓' : '⚠'} ${url} (${Date.now()-t}ms)`);
    } catch (e) { log('red', `   ✗ ${url}`); }
  }
}

async function main() {
  log('blue', '\n╔════════════════════════════════════════════════════════════════╗');
  log('blue', '║     🚀 JANAH BACKEND STRESS TESTS                              ║');
  log('blue', '╚════════════════════════════════════════════════════════════════╝\n');
  
  await healthCheck();
  
  log('blue', '\n━━━ ENDPOINT STRESS TESTS (50 concurrent each) ━━━');
  for (const e of CONFIG.endpoints) await stressTestEndpoint(e, 50);
  
  log('blue', '\n━━━ BURST TESTS ━━━');
  await burstTest(100);
  await burstTest(200);
  
  log('blue', '\n━━━ SUSTAINED LOAD ━━━');
  await sustainedLoad(15000, 20);
  
  log('green', '\n✅ Backend tests done!\n');
  
  // Summary
  log('cyan', '\n📊 SUMMARY:');
  log('white', '┌───────────────────────┬─────────┬─────────┬─────────┐');
  log('white', '│ Endpoint              │ Success │ Avg(ms) │ RPS     │');
  log('white', '├───────────────────────┼─────────┼─────────┼─────────┤');
  for (const t of results.tests) {
    const n = t.endpoint.padEnd(21).slice(0,21);
    log('white', `│ ${n} │ ${String(t.success).padStart(7)} │ ${String(Math.round(t.avg)).padStart(7)} │ ${String(Math.round(t.rps)).padStart(7)} │`);
  }
  log('white', '└───────────────────────┴─────────┴─────────┴─────────┘');
}

main().catch(e => { log('red', e.message); process.exit(1); });
