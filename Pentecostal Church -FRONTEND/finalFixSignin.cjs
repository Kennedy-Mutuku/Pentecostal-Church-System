const fs = require('fs');
const path = require('path');

const signinPath = path.join(__dirname, 'src', 'components', 'signin.tsx');
if (fs.existsSync(signinPath)) {
    let content = fs.readFileSync(signinPath, 'utf8');

    // 1. Initial State Updates
    content = content.replace(
        /ministry: \[\] as string\[\],\n\s*et: '',/g,
        "yearJoined: '',\n        residence: '',"
    );

    // 2. Remove unused lists and state
    content = content.replace(/const \[showMinistryDropdown, setShowMinistryDropdown\] = useState\(false\);\n/g, "");
    content = content.replace(/const \[showETDropdown, setShowETDropdown\] = useState\(false\);\n/g, "");
    content = content.replace(/const ministriesList = \[\s*\{.*?\}\s*\];/s, "");
    content = content.replace(/const etGroups = \[\s*\{.*?\}\s*\];/s, "");

    // 3. Remove toggle function
    content = content.replace(/const toggleMinistry = \(id: string\) => \{\s*setRegData\(prev => \(\{\s*\.\.\.prev,\s*ministry: prev\.ministry\.includes\(id\)\s*\? prev\.ministry\.filter\(m => m !== id\)\s*: \[\.\.\.prev\.ministry, id\],\s*\}\)\);\s*\};\s*/s, "");

    // 4. Update form submit validation
    content = content.replace(
        /regData\.ministry\.length === 0 \|\| !regData\.et/g,
        "!regData.yearJoined || !regData.residence"
    );

    // 5. Update message variables
    content = content.replace(
        /const ministryNames = regData\.ministry\.map\(id => ministriesList\.find\(m => m\.id === id\)\?\.label \|\| id\)\.join\(\', \'\);\s*const etName = etGroups\.find\(g => g\.id === regData\.et\)\?\.label \|\| regData\.et;/s,
        ""
    );
    content = content.replace(
        /\*Ministry:\* \$\{ministryNames\}\\n\*ET Group:\* \$\{etName\}/g,
        "*Year Joined RPC:* ${regData.yearJoined}\\n*Residence:* ${regData.residence}"
    );

    // 6. Replace the entire dropdown block
    const oldDropdowns = `{/* Ministry Dropdown */}
                                    <div style={{ position: 'relative' }}>
                                        <div onClick={() => { setShowMinistryDropdown(!showMinistryDropdown); setShowETDropdown(false); }}
                                            style={{
                                                padding: '8px 10px', borderRadius: '7px', background: '#fafafa', cursor: 'pointer',
                                                border: regData.ministry.length > 0 ? '1.5px solid #E53935' : '1.5px solid #e0e0e0',
                                                fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                color: regData.ministry.length > 0 ? '#333' : '#aaa',
                                            }}>
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px' }}>
                                                {regData.ministry.length > 0
                                                    ? regData.ministry.map(id => ministriesList.find(m => m.id === id)?.label).join(', ')
                                                    : 'Ministry *'}
                                            </span>
                                            <ChevronDown size={14} color="#888" style={{ flexShrink: 0 }} />
                                        </div>
                                        {showMinistryDropdown && (
                                            <div style={{
                                                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                                                width: 'max(100%, 220px)', background: '#fff',
                                                border: '1.5px solid #e0e0e0', borderRadius: '8px', marginTop: '4px', zIndex: 30,
                                                maxHeight: '220px', overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                            }}>
                                                <div style={{ padding: '8px 12px', borderBottom: '1px solid #eee', background: '#f8f4f7' }}>
                                                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#E53935' }}>Select Ministries</span>
                                                </div>
                                                {ministriesList.map(ministry => (
                                                    <label key={ministry.id} style={{
                                                        display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
                                                        cursor: 'pointer', fontSize: '13px', borderBottom: '1px solid #f5f5f5',
                                                        background: regData.ministry.includes(ministry.id) ? '#f3e8f0' : 'transparent',
                                                        transition: 'background 0.15s',
                                                    }}>
                                                        <input type="checkbox" checked={regData.ministry.includes(ministry.id)}
                                                            onChange={() => toggleMinistry(ministry.id)}
                                                            style={{ accentColor: '#E53935', width: '16px', height: '16px', flexShrink: 0 }} />
                                                        <span>{ministry.label}</span>
                                                    </label>
                                                ))}
                                                <div style={{ padding: '8px 12px', textAlign: 'center', borderTop: '1px solid #eee' }}>
                                                    <button type="button" onClick={() => setShowMinistryDropdown(false)}
                                                        style={{ background: '#E53935', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 24px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
                                                        Done
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* ET Group Dropdown */}
                                    <div style={{ position: 'relative' }}>
                                        <div onClick={() => { setShowETDropdown(!showETDropdown); setShowMinistryDropdown(false); }}
                                            style={{
                                                padding: '8px 10px', borderRadius: '7px', background: '#fafafa', cursor: 'pointer',
                                                border: regData.et ? '1.5px solid #E53935' : '1.5px solid #e0e0e0',
                                                fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                color: regData.et ? '#333' : '#aaa',
                                            }}>
                                            <span style={{ fontSize: '12px' }}>{regData.et ? etGroups.find(g => g.id === regData.et)?.label : 'ET Group *'}</span>
                                            <ChevronDown size={14} color="#888" style={{ flexShrink: 0 }} />
                                        </div>
                                        {showETDropdown && (
                                            <div style={{
                                                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                                                width: 'max(100%, 200px)', background: '#fff',
                                                border: '1.5px solid #e0e0e0', borderRadius: '8px', marginTop: '4px', zIndex: 30,
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                            }}>
                                                <div style={{ padding: '8px 12px', borderBottom: '1px solid #eee', background: '#f8f4f7' }}>
                                                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#E53935' }}>Select ET Group</span>
                                                </div>
                                                {etGroups.map(group => (
                                                    <label key={group.id}
                                                        onClick={() => { setRegData(prev => ({ ...prev, et: group.id })); setShowETDropdown(false); }}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
                                                            cursor: 'pointer', fontSize: '13px', borderBottom: '1px solid #f5f5f5',
                                                            background: regData.et === group.id ? '#f3e8f0' : 'transparent',
                                                            transition: 'background 0.15s',
                                                        }}>
                                                        <input type="radio" name="et-reg" checked={regData.et === group.id} readOnly
                                                            style={{ accentColor: '#E53935', width: '16px', height: '16px', flexShrink: 0 }} />
                                                        <span>{group.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>`;

    const newDropdowns = `{/* Year Joined Dropdown */}
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

                                    {/* Residence Input */}
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
                                    </div>`;
    
    // Fallback if the exact string replace fails, we do a regex replace
    if (content.includes(oldDropdowns)) {
        content = content.replace(oldDropdowns, newDropdowns);
    } else {
        const fallbackRegex = /\{\/\* Ministry Dropdown \*\/\}.*?\{\/\* ET Group Dropdown \*\/\}.*?<\/div>\s*<\/div>/s;
        content = content.replace(fallbackRegex, newDropdowns);
    }

    // 7. Update UserData interface
    content = content.replace(/ministry: string;/g, "yearJoined: string;");
    content = content.replace(/et: string;/g, "residence: string;");

    fs.writeFileSync(signinPath, content, 'utf8');
    console.log('Successfully updated signin.tsx');
}
