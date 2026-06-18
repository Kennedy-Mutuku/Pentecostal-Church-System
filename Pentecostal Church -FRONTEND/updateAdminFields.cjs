const fs = require('fs');
const path = require('path');

// 1. Update admissionAdmin.tsx
const adminPath = path.join(__dirname, 'src', 'pages', 'admissionAdmin.tsx');
if (fs.existsSync(adminPath)) {
    let content = fs.readFileSync(adminPath, 'utf8');

    // Update Year Joined RPC form block
    const yearRegex = /<div className=\{styles\['form-div'\]\}>\s*<label htmlFor="ministry">YEAR JOINED RPC<\/label>.*?<\/div>\s*<\/div>/s;
    const yearReplacement = `<div className={styles['form-div']}>
            <label htmlFor="yearJoined">YEAR JOINED RPC</label>
            <select id="yearJoined" className={styles['select']} value={formData.yearJoined} onChange={handleChange}>
              <option value="">choose...</option>
              {Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
          </div>`;
    content = content.replace(yearRegex, yearReplacement);

    // Update Residence form block
    const resRegex = /<div className=\{styles\['form-div'\]\}>\s*<label htmlFor="et">RESIDENCE<\/label>.*?<\/div>/s;
    const resReplacement = `<div className={styles['form-div']}>
              <label htmlFor="residence">RESIDENCE</label>
              <input type="text" id="residence" className={styles['input']} value={formData.residence} onChange={handleChange} placeholder="Enter residence..." />
            </div>`;
    content = content.replace(resRegex, resReplacement);

    // Remove old logic if still there
    content = content.replace(/const \[selectedMinistries, setSelectedMinistries\] = useState<string\[\]>\(\[\]\);\n/g, '');
    content = content.replace(/const \[showDropdown, setShowDropdown\] = useState\(false\);\n/g, '');
    content = content.replace(/const toggleMinistrySelection =.*?};\n/s, '');
    content = content.replace(/const handleBlur =.*?};\n/s, '');
    content = content.replace(/const ministriesString = selectedMinistries.length > 0 \? selectedMinistries.join\(', '\) : '';\n/g, '');
    content = content.replace(/const dataToSend = \{ \.\.\.formData, yearJoined: ministriesString \};\n/g, 'const dataToSend = { ...formData };\n');
    content = content.replace(/setSelectedMinistries\(\[\]\);\n/g, '');
    
    // Check if handleChange needs fixing for yearJoined and residence IDs
    // Since IDs in my replacement are 'yearJoined' and 'residence', we need to make sure handleChange works with them.
    // Usually handleChange uses e.target.id
    
    fs.writeFileSync(adminPath, content, 'utf8');
    console.log('Updated admissionAdmin.tsx');
}

// 2. Update userManagement.tsx
const userMgmtPath = path.join(__dirname, 'src', 'pages', 'userManagement.tsx');
if (fs.existsSync(userMgmtPath)) {
    let content = fs.readFileSync(userMgmtPath, 'utf8');
    
    const yearRegex = /<input type="text" name="yearJoined" value=\{editFormData\.yearJoined\} onChange=\{handleEditChange\} style=\{\{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' \}\} \/>/;
    const yearReplacement = `<select name="yearJoined" value={editFormData.yearJoined} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                    <option value="">Select Year</option>
                                    {Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                        <option key={year} value={year.toString()}>{year}</option>
                                    ))}
                                </select>`;
    content = content.replace(yearRegex, yearReplacement);

    fs.writeFileSync(userMgmtPath, content, 'utf8');
    console.log('Updated userManagement.tsx');
}
