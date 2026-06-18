const fs = require('fs');
const path = require('path');

const files = ['ChairpersonDashboard.tsx', 'AssistantPatronDashboard.tsx'];

files.forEach(file => {
    let filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Simple replacements
        content = content.replace(/reg: string;/g, 'idNumber: string;');
        content = content.replace(/course: string;/g, 'gender: string;');
        content = content.replace(/yos: string;/g, 'ageGroup: string;');
        
        content = content.replace(/yos\?: number;/g, '');

        content = content.replace(/const \[usersByYos, setUsersByYos\] = useState<\{ \[key: string\]: number \}>\(\{\}\);/g, 'const [usersByAgeGroup, setUsersByAgeGroup] = useState<{ [key: string]: number }>({});');
        content = content.replace(/const \[selectedYos, setSelectedYos\] = useState<string>\('all'\);/g, 'const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>(\'all\');');
        
        content = content.replace(/const groupedByYos: \{ \[key: string\]: number \} = \{\};/g, 'const groupedByAgeGroup: { [key: string]: number } = {};');
        
        // Loop replacements
        content = content.replace(/if \(user\.yos\) groupedByYos\[user\.yos\] = \(groupedByYos\[user\.yos\] \|\| 0\) \+ 1;/g, 
            'if (user.ageGroup) groupedByAgeGroup[user.ageGroup] = (groupedByAgeGroup[user.ageGroup] || 0) + 1;');
        content = content.replace(/setUsersByYos\(groupedByYos\);/g, 'setUsersByAgeGroup(groupedByAgeGroup);');

        content = content.replace(/\$\{latest\.yos\}/g, '${latest.ageGroup}');
        
        content = content.replace(/const studentsByYos: \{ \[key: string\]: User\[\] \} = \{\};/g, 'const studentsByAgeGroup: { [key: string]: User[] } = {};');
        content = content.replace(/const yos = user\.yos \|\| 'Unknown';/g, 'const ageGroup = user.ageGroup || \'Unknown\';');
        content = content.replace(/if \(!studentsByYos\[yos\]\) studentsByYos\[yos\] = \[\];/g, 'if (!studentsByAgeGroup[ageGroup]) studentsByAgeGroup[ageGroup] = [];');
        content = content.replace(/studentsByYos\[yos\]\.push\(user\);/g, 'studentsByAgeGroup[ageGroup].push(user);');
        
        content = content.replace(/const sortedYosKeys = Object\.keys\(studentsByYos\)/g, 'const sortedAgeGroupKeys = Object.keys(studentsByAgeGroup)');
        content = content.replace(/sortedYosKeys\.forEach\(yos => \{/g, 'sortedAgeGroupKeys.forEach(ageGroup => {');
        content = content.replace(/const studentsInYos = studentsByYos\[yos\];/g, 'const studentsInAgeGroup = studentsByAgeGroup[ageGroup];');
        content = content.replace(/\[\.\.\.studentsInYos\]/g, '[...studentsInAgeGroup]');
        
        content = content.replace(/RPC Members List - Year \$\{yos\}/g, 'RPC Members List - ${ageGroup}');
        content = content.replace(/RPC_Members_Year_\$\{yos\}_/g, 'RPC_Members_${ageGroup}_');

        content = content.replace(/student\.reg \|\| 'N\/A'/g, 'student.idNumber || \'N/A\'');
        content = content.replace(/student\.course \|\| 'N\/A'/g, 'student.gender || \'N/A\'');
        content = content.replace(/student\.yos \|\| 'N\/A'/g, 'student.ageGroup || \'N/A\'');
        
        content = content.replace(/'Registration No\.', 'Course', 'Year of Study'/g, '\'ID No\', \'Gender\', \'Age Group\'');

        content = content.replace(/\{ title: 'By Year of Study', data: Object\.entries\(usersByYos\)\.sort\(\(\[a\], \[b\]\) => parseInt\(a\) - parseInt\(b\)\), fmt: \(k: string\) => `Year \$\{k\}` \}/g,
            '{ title: \'By Age Group\', data: Object.entries(usersByAgeGroup).sort(([, a], [, b]) => b - a), fmt: (k: string) => k || \'Unknown\' }');

        content = content.replace(/const matchesYos = selectedYos === 'all' \|\| user\.yos === selectedYos;/g,
            'const matchesAgeGroup = selectedAgeGroup === \'all\' || user.ageGroup === selectedAgeGroup;');
            
        content = content.replace(/user\.reg\?\.toLowerCase\(\)\.includes\(q\)/g, 'user.idNumber?.toLowerCase().includes(q)');
        content = content.replace(/user\.course\?\.toLowerCase\(\)\.includes\(q\)/g, 'user.gender?.toLowerCase().includes(q) || user.ageGroup?.toLowerCase().includes(q)');

        content = content.replace(/return matchesYos && matchesSearch/g, 'return matchesAgeGroup && matchesSearch');
        
        content = content.replace(/phone, reg, or course/g, 'phone, or ID No');
        
        content = content.replace(/value=\{selectedYos\}/g, 'value={selectedAgeGroup}');
        content = content.replace(/onChange=\{e => setSelectedYos\(e\.target\.value\)\}/g, 'onChange={e => setSelectedAgeGroup(e.target.value)}');
        
        content = content.replace(/Object\.keys\(usersByYos\)\.sort\(\(\(a, b\) => parseInt\(a\) - parseInt\(b\)\)\)\.map\(yos => \(/g,
            'Object.keys(usersByAgeGroup).sort().map(ageGroup => (');
        content = content.replace(/<option key=\{yos\} value=\{yos\}>Year \{yos\} \(\{usersByYos\[yos\]\}\)<\/option>/g,
            '<option key={ageGroup} value={ageGroup}>{ageGroup} ({usersByAgeGroup[ageGroup]})</option>');

        content = content.replace(/selectedYos !== 'all'/g, 'selectedAgeGroup !== \'all\'');

        content = content.replace(/user\._id \|\| user\.reg/g, 'user._id || user.idNumber');

        content = content.replace(/<strong>Course:<\/strong> \{user\.course \|\| 'N\/A'\}/g, '<strong>Age Group:</strong> {user.ageGroup || \'N/A\'}');

        content = content.replace(/<strong>REG:<\/strong> \{user\.reg \|\| 'N\/A'\}/g, '<strong>ID No:</strong> {user.idNumber || \'N/A\'}');
        content = content.replace(/<strong>Year:<\/strong> \{user\.yos \|\| 'N\/A'\}/g, '<strong>Gender:</strong> {user.gender || \'N/A\'}');
        
        // One edge case is where the object keys sort for usersByYos was written differently. Let's handle both.
        content = content.replace(/Object\.keys\(usersByYos\)\.sort\(\(a, b\) => parseInt\(a\) - parseInt\(b\)\)\.map\(yos => \(/g,
            'Object.keys(usersByAgeGroup).sort().map(ageGroup => (');
            
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
