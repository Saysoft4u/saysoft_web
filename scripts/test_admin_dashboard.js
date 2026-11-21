const http = require('http');

async function testDashboard() {
  // Step 1: Login
  const loginData = 'username=admin&password=Admin%40Saysoft2026%21';
  
  const loginReq = http.request({
    hostname: 'localhost',
    port: 49141,
    path: '/admin/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(loginData)
    }
  }, (res) => {
    const cookies = res.headers['set-cookie'];
    console.log('Login Status:', res.statusCode);
    console.log('Cookies received:', !!cookies);

    if (!cookies) {
      console.error('No session cookies returned');
      process.exit(1);
    }

    const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

    // Step 2: Request /admin
    const dashReq = http.request({
      hostname: 'localhost',
      port: 49141,
      path: '/admin',
      method: 'GET',
      headers: {
        'Cookie': cookieHeader
      }
    }, (dashRes) => {
      let body = '';
      dashRes.on('data', chunk => { body += chunk; });
      dashRes.on('end', () => {
        console.log('Admin Dashboard Status:', dashRes.statusCode);
        console.log('Dashboard Size:', body.length, 'bytes');
        console.log('Has systemsViewsChart:', body.includes('systemsViewsChart'));
        console.log('Has appTypesChart:', body.includes('appTypesChart'));
        console.log('Has monthlyTrendsChart:', body.includes('monthlyTrendsChart'));
        console.log('Has orderStatusChart:', body.includes('orderStatusChart'));
        console.log('Has Chart.js script:', body.includes('chart.umd.min.js'));
        process.exit(dashRes.statusCode === 200 ? 0 : 1);
      });
    });

    dashReq.on('error', err => {
      console.error('Error fetching dashboard:', err);
      process.exit(1);
    });
    dashReq.end();
  });

  loginReq.on('error', err => {
    console.error('Error logging in:', err);
    process.exit(1);
  });
  loginReq.write(loginData);
  loginReq.end();
}

testDashboard();
