const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, search, replacement) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.split(search).join(replacement);
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

// 1. Fix ContactUs.tsx
const contactPath = path.join(__dirname, 'src', 'pages', 'ContactUs.tsx');
if (fs.existsSync(contactPath)) {
    let content = fs.readFileSync(contactPath, 'utf8');
    content = content.replace(/user\.ministry/g, 'user.yearJoined');
    content = content.replace(/user\?\.ministry/g, 'user?.yearJoined');
    content = content.replace(/user\.et/g, 'user.residence');
    content = content.replace(/user\?\.et/g, 'user?.residence');
    fs.writeFileSync(contactPath, content, 'utf8');
}

// 2. Fix MessagesAdmin.tsx
replaceInFile(path.join(__dirname, 'src', 'pages', 'MessagesAdmin.tsx'), 'msg.senderInfo?.ministry', 'msg.senderInfo?.yearJoined');
replaceInFile(path.join(__dirname, 'src', 'pages', 'MessagesAdmin.tsx'), 'msg.senderInfo.ministry', 'msg.senderInfo.yearJoined');

// 3. Fix Header.tsx (line 974 Session object)
const headerPath = path.join(__dirname, 'src', 'components', 'landing', 'Header.tsx');
if (fs.existsSync(headerPath)) {
    let content = fs.readFileSync(headerPath, 'utf8');
    content = content.replace(/ministry: ['"]Praise and Worship['"],/g, '');
    content = content.replace(/ministry: sessionType,/g, '');
    // Also fixing unused variables
    content = content.replace(/AlertCircle, /g, '');
    content = content.replace(/const renderCascadePanel = \(\) => \([\s\S]*?\n    \);/g, '');
    content = content.replace(/const renderMediaDeskPanel = \(\) => \([\s\S]*?\n    \);/g, '');
    fs.writeFileSync(headerPath, content, 'utf8');
}

// 4. Fix App.tsx unused variables
const appPath = path.join(__dirname, 'src', 'App.tsx');
if (fs.existsSync(appPath)) {
    let content = fs.readFileSync(appPath, 'utf8');
    content = content.replace(/import CommunityChat from '\.\/components\/CommunityChat';/g, '');
    content = content.replace(/import NotificationBubble from '\.\/components\/NotificationBubble';/g, '');
    fs.writeFileSync(appPath, content, 'utf8');
}

// 5. Fix Dashboards unused state variables
const dashFiles = ['AssistantPatronDashboard.tsx', 'ChairpersonDashboard.tsx'];
dashFiles.forEach(file => {
    const dashPath = path.join(__dirname, 'src', 'pages', file);
    if (fs.existsSync(dashPath)) {
        let content = fs.readFileSync(dashPath, 'utf8');
        content = content.replace(/const \[usersByMinistry, setUsersByMinistry\] = useState<\{ \[key: string\]: number \}>\(\{\}\);\n/g, '');
        content = content.replace(/const \[usersByEt, setUsersByEt\] = useState<\{ \[key: string\]: number \}>\(\{\}\);\n/g, '');
        content = content.replace(/const \[studentsInMinistries, setStudentsInMinistries\] = useState<number>\(0\);\n/g, '');
        content = content.replace(/const \[studentsInEts, setStudentsInEts\] = useState<number>\(0\);\n/g, '');
        fs.writeFileSync(dashPath, content, 'utf8');
    }
});

console.log('Fixed final TS errors.');
