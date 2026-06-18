import sys
import os

path = 'd:\\CODE CENTRE\\Pentecostal  Church\\Pentecostal Church\\Pentecostal Church -FRONTEND\\src\\pages\\AssistantPatronDashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import
content = content.replace(
    "import PatronAssets from '../components/patron/PatronAssets';\\n\\nimport cuLogo",
    "import PatronAssets from '../components/patron/PatronAssets';\\nimport { AGE_GROUPS } from '../utils/constants';\\n\\nimport cuLogo"
)

# 2. Update Member Distribution Breakdown array
old_stats = """                    {[
                        { title: 'By Age Group', data: Object.entries(usersByAgeGroup).sort(([, a], [, b]) => b - a), fmt: (k: string) => k || 'Unknown' },
                        
                        
                    ].map((cat, i) => ("""

new_stats = """                    {(() => {
                        // Year Joined
                        const byYearJoined: { [k: string]: number } = {};
                        users.forEach(u => {
                            const yr = u.yearJoined ? String(u.yearJoined).trim() : '';
                            if (yr && !isNaN(Number(yr))) byYearJoined[yr] = (byYearJoined[yr] || 0) + 1;
                        });

                        // Gender
                        const byGender: { [k: string]: number } = { Male: 0, Female: 0, Other: 0 };
                        users.forEach(u => {
                            const g = u.gender ? String(u.gender).trim() : '';
                            if (g in byGender) byGender[g]++;
                        });

                        // Residence
                        const byResidence: { [k: string]: number } = {};
                        users.forEach(u => {
                            const r = u.residence ? String(u.residence).trim() : 'Unknown';
                            if (r) byResidence[r] = (byResidence[r] || 0) + 1;
                        });

                        const total = users.length || 1;

                        const AGE_ORDER = ['Kid (12 and below)', 'Youth (13-35)', 'Adult (36-59)', 'Elderly (60 and above)'];
                        const byAgeGroupLocal: { [k: string]: number } = {};
                        AGE_ORDER.forEach(ag => { byAgeGroupLocal[ag] = 0; });
                        users.forEach(u => {
                            const ag = u.ageGroup ? String(u.ageGroup).trim() : '';
                            if (ag in byAgeGroupLocal) byAgeGroupLocal[ag]++;
                        });

                        const cats = [
                            {
                                title: 'By Year Joined',
                                color: '#730051',
                                data: Object.entries(byYearJoined)
                                    .sort(([a], [b]) => Number(a) - Number(b))
                                    .map(([k, v]) => ({ label: k, count: v, sub: null })),
                            },
                            {
                                title: 'By Gender (Gents & Females)',
                                color: '#1d4ed8',
                                data: [
                                    { label: 'Gents (Male)',   count: byGender.Male,   sub: `${((byGender.Male   / total) * 100).toFixed(1)}%` },
                                    { label: 'Females',        count: byGender.Female, sub: `${((byGender.Female / total) * 100).toFixed(1)}%` },
                                    { label: 'Other',          count: byGender.Other,  sub: `${((byGender.Other  / total) * 100).toFixed(1)}%` },
                                ],
                            },
                            {
                                title: 'By Age Group',
                                color: '#d97706',
                                data: AGE_ORDER.map(ag => ({
                                    label: ag,
                                    count: byAgeGroupLocal[ag],
                                    sub: `${((byAgeGroupLocal[ag] / total) * 100).toFixed(1)}%`
                                })),
                            },
                            {
                                title: 'By Residence',
                                color: '#059669',
                                data: Object.entries(byResidence)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([k, v]) => ({ label: k, count: v, sub: null })),
                            },
                        ];

                        return cats.map((cat, i) => ("""
content = content.replace(old_stats, new_stats)

# 2.1 Update Member Distribution Breakdown Rendering map function body
old_render = """                        <div key={i} className={styles.categoryCard} style={{ padding: '16px', background: '#fff', border: '1px solid #eee', borderRadius: '12px' }}>
                            <h4 style={{ fontSize: '11px', fontWeight: '800', marginBottom: '12px', color: P, textTransform: 'uppercase' }}>{cat.title}</h4>
                            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                                {cat.data.map(([k, count]) => (
                                    <li key={k} style={{ fontSize: '13px', color: '#444', display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f9f9f9' }}>
                                        <span>{cat.fmt(k)}</span>
                                        <strong style={{ color: P }}>{count}</strong>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}"""

new_render = """                            <div key={i} className={styles.categoryCard} style={{ padding: '16px', background: '#fff', border: '1px solid #eee', borderRadius: '12px' }}>
                                <h4 style={{ fontSize: '11px', fontWeight: '800', marginBottom: '12px', color: cat.color, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{cat.title}</h4>
                                {cat.data.length === 0 ? (
                                    <p style={{ fontSize: '12px', color: '#aaa', fontStyle: 'italic' }}>No data yet</p>
                                ) : (
                                    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                                        {cat.data.map(({ label, count, sub }: any) => (
                                            <li key={label} style={{ fontSize: '13px', color: '#444', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f5f5f5' }}>
                                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span>{label}</span>
                                                    {sub && <span style={{ fontSize: '10px', color: '#999' }}>{sub}</span>}
                                                </span>
                                                <strong style={{ color: cat.color, fontSize: '14px' }}>{count}</strong>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ));
                    })()}"""
content = content.replace(old_render, new_render)

# 3. renderMembers filter logic
old_filter = """            const matchEt = true;
            const matchMin = true;

            return matchesAgeGroup && matchesSearch && matchEt && matchMin;
        });

        const sectionHeading = activeSection.startsWith('et-') ? `${activeSection.replace('et-', '')} Team Members` : 
                             activeSection.startsWith('min-') ? `${activeSection.replace('min-', '')} Ministry Members` : 'All Members';"""

new_filter = """            const isAgeView = activeSection.startsWith('age-');
            const isGenderView = activeSection.startsWith('gender-');
            
            const activeFilterText = activeSection.slice(activeSection.indexOf('-') + 1);

            const matchAge = isAgeView ? user.ageGroup === activeFilterText : true;
            const matchGender = isGenderView
                ? (activeFilterText === 'Gents' ? user.gender === 'Male' : user.gender === 'Female')
                : true;

            return matchesAgeGroup && matchesSearch && matchAge && matchGender;
        });

        const sectionHeading = activeSection.startsWith('age-') ? `${activeSection.replace('age-', '')} Members`
                             : activeSection.startsWith('gender-') ? `${activeSection.replace('gender-', '')} Members`
                             : 'All Members';"""
content = content.replace(old_filter, new_filter)

# 4. Search text & dropdown
old_search = """                            <input
                                type="text"
                                placeholder="Search by name, email, phone, or ID No..."
                                value={searchQuery}"""

new_search = """                            <input
                                type="text"
                                placeholder="Search by name, email, phone, ID number or residence..."
                                value={searchQuery}"""
content = content.replace(old_search, new_search)

old_dropdown = """                        <select
                            value={selectedAgeGroup}
                            onChange={e => setSelectedAgeGroup(e.target.value)}
                            style={{ ...inputStyle, minWidth: '130px', cursor: 'pointer' }}
                        >
                            <option value="all">All Years</option>
                            {Object.keys(usersByAgeGroup).sort().map(ageGroup => (
                                <option key={ageGroup} value={ageGroup}>{ageGroup} ({usersByAgeGroup[ageGroup]})</option>
                            ))}
                        </select>"""

new_dropdown = """                        <select
                            value={selectedAgeGroup}
                            onChange={e => setSelectedAgeGroup(e.target.value)}
                            style={{ ...inputStyle, minWidth: '170px', cursor: 'pointer' }}
                        >
                            <option value="all">All Age Groups</option>
                            {AGE_GROUPS.map(ag => (
                                <option key={ag} value={ag}>{ag} ({usersByAgeGroup[ag] || 0})</option>
                            ))}
                        </select>"""
content = content.replace(old_dropdown, new_dropdown)

# 5. Bottom card rows
old_card = """                                    {/* Bottom row: REG / Year / ET / Ministry */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                        gap: '8px', fontSize: '13px', color: '#555',
                                        paddingTop: '12px', borderTop: '1px solid #dee2e6',
                                    }}>
                                        <div><strong>ID No:</strong> {user.idNumber || 'N/A'}</div>
                                        <div><strong>Gender:</strong> {user.gender || 'N/A'}</div>
                                        <div><strong>Residence:</strong> {user.residence || 'N/A'}</div>
                                        <div><strong>Year Joined RPC:</strong> {user.yearJoined || 'N/A'}</div>
                                    </div>"""

new_card = """                                    {/* Bottom row: Gender / AgeGroup / YearJoined / Residence */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                        gap: '8px', fontSize: '13px', color: '#555',
                                        paddingTop: '12px', borderTop: '1px solid #dee2e6',
                                    }}>
                                        <div><strong>Gender:</strong> {user.gender === 'Male' ? '👨 Gent' : user.gender === 'Female' ? '👩 Female' : user.gender || 'N/A'}</div>
                                        <div><strong>Age Group:</strong> {user.ageGroup || 'N/A'}</div>
                                        <div><strong>Year Joined:</strong> {user.yearJoined || 'N/A'}</div>
                                        <div><strong>Residence:</strong> {user.residence || 'N/A'}</div>
                                    </div>"""
content = content.replace(old_card, new_card)

# 6. Active section rendering
old_active = """        if (activeSection.startsWith('et-') || activeSection.startsWith('min-') || activeSection === 'members') {
            return renderMembers();
        }"""

new_active = """        if (activeSection.startsWith('age-') || activeSection.startsWith('gender-') || activeSection === 'members') {
            return renderMembers();
        }"""
content = content.replace(old_active, new_active)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('SUCCESS')
