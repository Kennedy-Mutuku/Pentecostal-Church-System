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

        // Remove states
        content = content.replace(/const \[usersByMinistry, setUsersByMinistry\] = useState<\{ \[key: string\]: number \}>\(\{\}\);\n/g, '');
        content = content.replace(/const \[usersByEt, setUsersByEt\] = useState<\{ \[key: string\]: number \}>\(\{\}\);\n/g, '');
        content = content.replace(/const \[studentsInMinistries, setStudentsInMinistries\] = useState<number>\(0\);\n/g, '');
        content = content.replace(/const \[studentsInEts, setStudentsInEts\] = useState<number>\(0\);\n/g, '');

        // Remove variable processing
        content = content.replace(/const groupedByMinistry: \{ \[key: string\]: number \} = \{\};\n/g, '');
        content = content.replace(/const groupedByEt: \{ \[key: string\]: number \} = \{\};\n/g, '');
        content = content.replace(/let minCount = 0, etCount = 0;\n/g, '');

        content = content.replace(/if \(user\.yearJoined\) \{[\s\S]*?\}\n/g, '');
        content = content.replace(/if \(user\.residence\) \{[\s\S]*?\}\n/g, '');

        content = content.replace(/setUsersByMinistry\(groupedByMinistry\);\n/g, '');
        content = content.replace(/setUsersByEt\(groupedByEt\);\n/g, '');
        content = content.replace(/setStudentsInMinistries\(minCount\);\n/g, '');
        content = content.replace(/setStudentsInEts\(etCount\);\n/g, '');

        // Remove cards
        content = content.replace(/\{ val: studentsInMinistries, label: 'In Ministries'[\s\S]*?\},/g, '');
        content = content.replace(/\{ val: studentsInEts, label: 'In ET Groups'[\s\S]*?\},/g, '');

        // Remove specific displays (e.g. usersByMinistry tables)
        // I will just change "By Ministry" and "By Evangelistic Team" to return empty arrays if they still exist.
        content = content.replace(/data: Object\.entries\(usersByMinistry\)/g, 'data: []');
        content = content.replace(/data: Object\.entries\(usersByEt\)/g, 'data: []');
        
        // Let's remove the whole blocks using regex to match By Ministry and By Evangelistic Team
        content = content.replace(/\{ title: 'By Ministry'[\s\S]*?\},/g, '');
        content = content.replace(/\{ title: 'By Evangelistic Team'[\s\S]*?\},/g, '');
        
        // Chairperson specific logic might have parseEts and parseMinistries
        content = content.replace(/import \{ parseEts, parseMinistries \} from '\.\.\/utils\/constants';/g, '');

        // Filter logic in members list
        content = content.replace(/const matchMin = isMinView \? parseMinistries\(user\.yearJoined\)\.includes\(activeFilterText\) : true;/g, 'const matchMin = true;');
        content = content.replace(/const matchEt = isEtView \? parseEts\(user\.residence\)\.includes\(activeFilterText\) : true;/g, 'const matchEt = true;');
        
        // Remove Sidebar exports if any
        content = content.replace(/byMinistry=\{usersByMinistry\}/g, '');
        content = content.replace(/byEt=\{usersByEt\}/g, '');

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${name}`);
    }
});
