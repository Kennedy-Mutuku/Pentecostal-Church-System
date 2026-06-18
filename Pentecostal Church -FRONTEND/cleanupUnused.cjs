const fs = require('fs');
const path = require('path');

function replaceExact(file, search, replace) {
    const filePath = path.join(__dirname, 'src', file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(search, replace);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
}

// 1. App.tsx
replaceExact('App.tsx', /import CommunityChat from '.\/components\/CommunityChat';\n/, '');
replaceExact('App.tsx', /import NotificationBubble from '.\/components\/NotificationBubble';\n/, '');

// 2. Header.tsx
replaceExact('components/landing/Header.tsx', /AlertCircle, /, '');
replaceExact('components/landing/Header.tsx', /const renderCascadePanel = \(\) => \([\s\S]*?\n    \);\n/g, '');
replaceExact('components/landing/Header.tsx', /const renderMediaDeskPanel = \(\) => \([\s\S]*?\n    \);\n/g, '');

// 3. ChairpersonDashboard & AssistantPatronDashboard
const dashes = ['pages/ChairpersonDashboard.tsx', 'pages/AssistantPatronDashboard.tsx'];
dashes.forEach(d => {
    replaceExact(d, /const \[usersByMinistry, setUsersByMinistry\] = useState<\{ \[key: string\]: number \}>\(\{\}\);\n/g, '');
    replaceExact(d, /const \[usersByEt, setUsersByEt\] = useState<\{ \[key: string\]: number \}>\(\{\}\);\n/g, '');
    replaceExact(d, /const \[studentsInMinistries, setStudentsInMinistries\] = useState<number>\(0\);\n/g, '');
    replaceExact(d, /const \[studentsInEts, setStudentsInEts\] = useState<number>\(0\);\n/g, '');
});

console.log('Cleaned up unused variables.');
