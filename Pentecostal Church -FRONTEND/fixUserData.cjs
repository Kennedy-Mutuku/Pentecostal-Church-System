const fs = require('fs');
const path = require('path');

const srcFiles = [
    'src/components/userProfile.tsx',
    'src/components/MinistryHeader.tsx',
    'src/components/landing/Header.tsx',
    'src/pages/ContactUs.tsx',
    'src/pages/MessagesAdmin.tsx',
    'src/pages/userManagement.tsx',
    'src/pages/userProfile.tsx'
];

srcFiles.forEach(file => {
    let filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/et\??: string;/g, 'residence?: string;');
        content = content.replace(/ministry\??: string;/g, 'yearJoined?: string;');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
