const fs = require('fs');
const path = require('path');

const srcPagesDir = path.join(__dirname, 'src', 'pages');

const files = [
    { dir: srcPagesDir, name: 'AssistantPatronDashboard.tsx' },
    { dir: srcPagesDir, name: 'ChairpersonDashboard.tsx' }
];

files.forEach(({ dir, name }) => {
    let filePath = path.join(dir, name);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Replace the whole broken block in fetchUsers
        // We will look for:
        // const groupedByAgeGroup: { [key: string]: number } = {};
        // const groupedByYear Joined RPC: { [key: string]: number } = {};
        // ... up to ...
        // const inEt = userData.filter((u: User) => parseEts(u.et).length > 0).length;
        
        const startMarker = 'const groupedByAgeGroup: { [key: string]: number } = {};';
        const endMarker = 'lastCounts.current.users = userData.length;';
        
        const startIndex = content.indexOf(startMarker);
        const endIndex = content.indexOf(endMarker);
        
        if (startIndex !== -1 && endIndex !== -1) {
            const replacement = `const groupedByAgeGroup: { [key: string]: number } = {};

        userData.forEach((user: User) => {
            if (user.ageGroup) groupedByAgeGroup[user.ageGroup] = (groupedByAgeGroup[user.ageGroup] || 0) + 1;
        });

        setUsersByAgeGroup(groupedByAgeGroup);

        // Track new students
        if (lastCounts.current.users > 0 && userData.length > lastCounts.current.users) {
            const newCount = userData.length - lastCounts.current.users;
            const latest = [...userData].sort((a, b) => 
                new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            )[0];
            addNotification(
                'New Student Registration',
                \`\${newCount} new Member(s) joined. Latest: \${latest.username} (\${latest.ageGroup})\`,
                'user',
                'members'
            );
        }
        `;
            content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
        }

        // Clean up any remaining references
        content = content.replace(/import \{ parseEts, parseMinistries \} from '\.\.\/utils\/constants';/g, '');
        content = content.replace(/parseEts\(u\.et\)/g, '[]');
        content = content.replace(/parseMinistries\(u\.ministry\)/g, '[]');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${name}`);
    }
});
