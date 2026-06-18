const fs = require('fs');
const path = require('path');

const signinPath = path.join(__dirname, 'src', 'components', 'signin.tsx');
if (fs.existsSync(signinPath)) {
    let content = fs.readFileSync(signinPath, 'utf8');

    // Update state initialization
    content = content.replace(/yearJoined: \[\] as string\[\],/g, "yearJoined: '',");
    
    // Update validation
    content = content.replace(/regData\.yearJoined\.length === 0/g, "!regData.yearJoined");

    // Update message formatting
    content = content.replace(/const yearJoinedNames = regData\.yearJoined\.map\(id => ministriesList\.find\(m => m\.id === id\)\?\.label \|\| id\)\.join\(\', \'\);/g, "const yearJoinedNames = regData.yearJoined;");
    content = content.replace(/const etName = etGroups\.find\(g => g\.id === regData\.residence\)\?\.label \|\| regData\.residence;/g, "const etName = regData.residence;");
    
    // Remove the toggle function
    content = content.replace(/const toggleMinistry = \(id: string\) => \{[\s\S]*?\}\);\n    \};\n/g, "");

    // Replace the Ministry Dropdown block
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

                                    {/* Residence Input */}`;
    content = content.replace(dropdownRegex, newDropdown);

    // Replace the ET Group Dropdown block
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

    // Remove showMinistryDropdown and showETDropdown state variables
    content = content.replace(/const \[showMinistryDropdown, setShowMinistryDropdown\] = useState\(false\);\n/g, "");
    content = content.replace(/const \[showETDropdown, setShowETDropdown\] = useState\(false\);\n/g, "");

    fs.writeFileSync(signinPath, content, 'utf8');
    console.log('Updated signin.tsx');
}
