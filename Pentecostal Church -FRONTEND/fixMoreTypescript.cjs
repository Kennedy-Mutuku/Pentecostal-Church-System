const fs = require('fs');
const path = require('path');

// 1. Fix signin.tsx
const signinPath = path.join(__dirname, 'src', 'components', 'signin.tsx');
if (fs.existsSync(signinPath)) {
    let content = fs.readFileSync(signinPath, 'utf8');
    content = content.replace(/const toggleMinistry =.*?};\n/s, '');
    content = content.replace(/const ministriesList =.*?];\n/s, '');
    content = content.replace(/const etGroups =.*?];\n/s, '');
    content = content.replace(/const \[showMinistryDropdown, setShowMinistryDropdown\] = useState\(false\);\n/g, '');
    content = content.replace(/const \[showETDropdown, setShowETDropdown\] = useState\(false\);\n/g, '');
    fs.writeFileSync(signinPath, content, 'utf8');
}

// 2. Fix admissionAdmin.tsx
const adminPath = path.join(__dirname, 'src', 'pages', 'admissionAdmin.tsx');
if (fs.existsSync(adminPath)) {
    let content = fs.readFileSync(adminPath, 'utf8');
    content = content.replace(/import \{ ChevronDown \} from 'lucide-react';\n/, '');
    content = content.replace(/const ministriesList =.*?];\n/s, '');
    content = content.replace(/const \[showDropdown, setShowDropdown\] = useState\(false\);\n/g, '');
    content = content.replace(/const toggleMinistrySelection =.*?};\n/s, '');
    content = content.replace(/const handleBlur =.*?};\n/s, '');
    fs.writeFileSync(adminPath, content, 'utf8');
}

// 3. Fix ChairpersonDashboard.tsx
const dashPath = path.join(__dirname, 'src', 'pages', 'ChairpersonDashboard.tsx');
if (fs.existsSync(dashPath)) {
    let content = fs.readFileSync(dashPath, 'utf8');
    
    // Completely replace fetchUsers block
    const fetchRegex = /const groupedByAgeGroup: \{ \[key: string\]: number \} = \{\};\n.*?setStudentsInEts\(inEt\);/s;
    const fetchReplace = `const groupedByAgeGroup: { [key: string]: number } = {};

        userData.forEach((user: User) => {
            if (user.ageGroup) groupedByAgeGroup[user.ageGroup] = (groupedByAgeGroup[user.ageGroup] || 0) + 1;
        });

        setUsersByAgeGroup(groupedByAgeGroup);`;
    content = content.replace(fetchRegex, fetchReplace);
    
    // Remove unused states
    content = content.replace(/const \[usersByMinistry, setUsersByMinistry\] = useState<\{ \[key: string\]: number \}>\(\{\}\);\n/g, '');
    content = content.replace(/const \[usersByEt, setUsersByEt\] = useState<\{ \[key: string\]: number \}>\(\{\}\);\n/g, '');
    content = content.replace(/const \[studentsInMinistries, setStudentsInMinistries\] = useState<number>\(0\);\n/g, '');
    content = content.replace(/const \[studentsInEts, setStudentsInEts\] = useState<number>\(0\);\n/g, '');
    
    // Fix parseEts and parseMinistries in the filter logic (lines ~778)
    content = content.replace(/const userMinistries = parseMinistries\(user\.ministry\);\n/g, '');
    content = content.replace(/const userEts = parseEts\(user\.et\);\n/g, '');
    content = content.replace(/const matchesMinistry = isMinView \? userMinistries\.includes\(activeFilterText\) : true;\n/g, '');
    content = content.replace(/const matchesEt = isEtView \? userEts\.includes\(activeFilterText\) : true;\n/g, '');
    content = content.replace(/return matchesSearch && matchesAgeGroup && matchesMinistry && matchesEt;/g, 'return matchesSearch && matchesAgeGroup;');

    fs.writeFileSync(dashPath, content, 'utf8');
}

console.log('Fixed additional typescript errors.');
