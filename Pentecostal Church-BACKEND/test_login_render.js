const axios = require('axios');

async function test(url) {
  try {
    const res = await axios.post(url, {
      email: 'admin@rpcmcadmissionadmin.co.ke',
      password: 'Password@2026'
    });
    console.log(url, '-> Status:', res.status);
    console.log(res.data);
  } catch (err) {
    console.log(url, '-> Error status:', err.response ? err.response.status : err.message);
    if (err.response && err.response.data) {
        console.log('Error data:', err.response.data);
    }
  }
}

test('https://pentecostal-church-system.onrender.com/admissionadmin/login');
