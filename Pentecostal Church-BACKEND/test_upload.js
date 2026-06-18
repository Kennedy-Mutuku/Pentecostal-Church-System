const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function test() {
  try {
    fs.writeFileSync('dummy.jpg', 'fake image data');
    const form = new FormData();
    form.append('image', fs.createReadStream('dummy.jpg'));
    
    const res = await axios.post('http://localhost:3000/api/media-items/upload-image', form, {
      headers: form.getHeaders()
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}
test();
