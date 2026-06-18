const fs = require('fs');
const path = require('path');

const signinPath = path.join(__dirname, 'src', 'components', 'signin.tsx');
if (fs.existsSync(signinPath)) {
    let content = fs.readFileSync(signinPath, 'utf8');

    // Rename ministry to yearJoined and et to residence in state
    content = content.replace(/ministry: \[\] as string\[\],/g, "yearJoined: '',");
    content = content.replace(/et: '',/g, "residence: '',");
    
    // Rename in the UserData interface if it's there
    content = content.replace(/ministry: string;/g, "yearJoined: string;");
    content = content.replace(/et: string;/g, "residence: string;");

    // Remove old unused state variables and lists
    content = content.replace(/const \[showMinistryDropdown, setShowMinistryDropdown\] = useState\(false\);\n/g, "");
    content = content.replace(/const \[showETDropdown, setShowETDropdown\] = useState\(false\);\n/g, "");
    content = content.replace(/const ministriesList = \[.*?\];\n/s, "");
    content = content.replace(/const etGroups = \[.*?\];\n/s, "");
    content = content.replace(/const toggleMinistry =.*?};\n/s, "");

    // Update form validation and message string
    content = content.replace(/regData\.ministry\.length === 0 \|\| !regData\.et/g, "!regData.yearJoined || !regData.residence");
    
    content = content.replace(/const ministryNames = regData\.ministry\.map\(id => ministriesList\.find\(m => m\.id === id\)\?\.label \|\| id\)\.join\(\', \'\);\n/g, "");
    content = content.replace(/const etName = etGroups\.find\(g => g\.id === regData\.et\)\?\.label \|\| regData\.et;\n/g, "");

    // The message format
    content = content.replace(/\*Ministry:\* \$\{ministryNames\}\\n\*ET Group:\* \$\{etName\}/g, "*Year Joined RPC:* ${regData.yearJoined}\\n*Residence:* ${regData.residence}");

    // Replace the Ministry Dropdown block completely
    const dropdownRegex = /\{\/\* Ministry Dropdown \*\/\}.*?\{\/\* ET Group Dropdown \*\/\}/s;
    const newDropdown = `{/* Year Joined Dropdown */}
                                    <div style={{ position: 'relative' }}>
                                        <select
                                            value={regData.yearJoined}
                                            onChange={(e) => setRegData(prev => ({ ...prev, yearJoined: e.target.value }))}
                                            style={{
                                                width: '100%', padding: '8px 10px', borderRadius: '7px', background: '#fafafa',
                                                border: regData.yearJoined ? '1.5px solid #E53935' : '1.5px solid #e0e0e0',
                                                fontSize: '13px', color: regData.yearJoined ? '#333' : '#aaa', outline: 'none',
                                                appearance: 'none'
                                            }}
                                        >
                                            <option value="">Year Joined RPC *</option>
                                            {Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                                <option key={year} value={year.toString()}>{year}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} color="#888" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                    </div>

                                    {/* ET Group Dropdown */}`; // keeping this comment to match the next block replacement
    content = content.replace(dropdownRegex, newDropdown);

    // Replace the ET Group Dropdown block completely
    const etRegex = /\{\/\* ET Group Dropdown \*\/\}.*?\{\/\* Accept Terms Checkbox \*\/\}/s;
    const newEt = `{/* Residence Input */}
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            placeholder="Residence *"
                                            value={regData.residence}
                                            onChange={(e) => setRegData(prev => ({ ...prev, residence: e.target.value }))}
                                            style={{
                                                width: '100%', padding: '8px 10px', borderRadius: '7px', background: '#fafafa',
                                                border: regData.residence ? '1.5px solid #E53935' : '1.5px solid #e0e0e0',
                                                fontSize: '13px', color: '#333', outline: 'none'
                                            }}
                                        />
                                    </div>

                                    {/* Accept Terms Checkbox */}`;
    content = content.replace(etRegex, newEt);

    fs.writeFileSync(signinPath, content, 'utf8');
    console.log('Updated signin.tsx completely');
}
