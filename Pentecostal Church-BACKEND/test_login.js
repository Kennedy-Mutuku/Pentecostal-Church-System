const axios = require('axios');
async function test() {
  try {
    const res = await axios.post('http://localhost:3000/patron/login', {
      email: 'patron@rpc-nyamira.co.ke',
      password: 'Patron@Patron'
    });
    console.log('Login Success:', res.data);
  } catch (err) {
    console.error('Login Error:', err.response ? err.response.data : err.message);
  }
}
test();
