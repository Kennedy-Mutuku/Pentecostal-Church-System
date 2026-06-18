const axios = require('axios');
async function test() {
  try {
    const res = await axios.post('http://localhost:3000/messages', {
      subject: 'Test Subject',
      message: 'This is a test message',
      category: 'feedback',
      isAnonymous: true
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}
test();
