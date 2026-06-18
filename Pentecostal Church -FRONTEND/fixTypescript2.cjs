const fs = require('fs');
const path = require('path');

// 1. Fix UserData interface in userProfile.tsx
const userProfilePath = path.join(__dirname, 'src', 'pages', 'userProfile.tsx');
let upContent = fs.readFileSync(userProfilePath, 'utf8');
upContent = upContent.replace(/et\?: string;/g, '');
upContent = upContent.replace(/ministry\?: string;/g, '');
upContent = upContent.replace(/et: string;/g, '');
upContent = upContent.replace(/ministry: string;/g, '');
fs.writeFileSync(userProfilePath, upContent, 'utf8');

// 2. Fix AssistantPatronDashboard.tsx and ChairpersonDashboard.tsx sub rendering
const dashFiles = ['AssistantPatronDashboard.tsx', 'ChairpersonDashboard.tsx'];
dashFiles.forEach(file => {
    let filePath = path.join(__dirname, 'src', 'pages', file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/\{\('sub' in s\) && <p style=\{\{ fontSize: '8px', margin: '1px 0 0', opacity: 0\.7 \}\}>\{s\.sub\}<\/p>\}/g, '');
        fs.writeFileSync(filePath, content, 'utf8');
    }
});

// 3. Fix unused imports in App.tsx
const appPath = path.join(__dirname, 'src', 'App.tsx');
if (fs.existsSync(appPath)) {
    let appContent = fs.readFileSync(appPath, 'utf8');
    appContent = appContent.replace(/import CommunityChat from '\.\/components\/CommunityChat';/g, '');
    appContent = appContent.replace(/import NotificationBubble from '\.\/components\/NotificationBubble';/g, '');
    fs.writeFileSync(appPath, appContent, 'utf8');
}

// 4. Fix unused imports in Header.tsx
const headerPath = path.join(__dirname, 'src', 'components', 'landing', 'Header.tsx');
if (fs.existsSync(headerPath)) {
    let headerContent = fs.readFileSync(headerPath, 'utf8');
    headerContent = headerContent.replace(/AlertCircle, /g, '');
    // remove renderCascadePanel and renderMediaDeskPanel functions. Actually just comment them out or they might be exported
    headerContent = headerContent.replace(/const renderCascadePanel = \(\) => \([\s\S]*?\n    \);/g, '');
    headerContent = headerContent.replace(/const renderMediaDeskPanel = \(\) => \([\s\S]*?\n    \);/g, '');
    fs.writeFileSync(headerPath, headerContent, 'utf8');
}

console.log('Fixed additional typescript errors.');
