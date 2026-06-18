import sys

path = 'd:\\CODE CENTRE\\Pentecostal  Church\\Pentecostal Church\\Pentecostal Church -FRONTEND\\src\\pages\\ChairpersonDashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import
content = content.replace(
    "import ChairpersonAssets from '../components/patron/PatronAssets';\\n\\nimport cuLogo",
    "import ChairpersonAssets from '../components/patron/PatronAssets';\\nimport { AGE_GROUPS } from '../utils/constants';\\n\\nimport cuLogo"
)

# 2. Update Member Distribution Breakdown array
old_stats = """                    {[
                        { title: 'By Year of Study', data: Object.entries(usersByYos).sort(([a], [b]) => parseInt(a) - parseInt(b)), fmt: (k: string) => `Year ${k}` },
                        
                        
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
old_filter = """            const matchEt = isEtView ? (() => [])(user.et).includes(activeFilterText) : true;
            const matchMin = isMinView ? (() => [])(user.ministry).includes(activeFilterText) : true;

            return matchesYos && matchesSearch && matchEt && matchMin;
        });

        const sectionHeading = activeSection.startsWith('et-') ? `${activeSection.replace('et-', '')} Team Members` : 
                             activeSection.startsWith('min-') ? `${activeSection.replace('min-', '')} Ministry Members` : 'All Members';"""

new_filter = """            const matchAge = isEtView ? user.ageGroup === activeFilterText : true;
            const matchGender = isMinView
                ? (activeFilterText === 'Gents' ? user.gender === 'Male' : user.gender === 'Female')
                : true;

            return matchesYos && matchesSearch && matchAge && matchGender;
        });

        const sectionHeading = activeSection.startsWith('age-') ? `${activeSection.replace('age-', '')} Members`
                             : activeSection.startsWith('gender-') ? `${activeSection.replace('gender-', '')} Members`
                             : 'All Members';"""

# replace 'et-' and 'min-' variables inside renderMembers
content = content.replace("const isEtView = activeSection.startsWith('et-');", "const isEtView = activeSection.startsWith('age-');")
content = content.replace("const isMinView = activeSection.startsWith('min-');", "const isMinView = activeSection.startsWith('gender-');")

content = content.replace(old_filter, new_filter)

# 4. Search text & dropdown
old_search = """                            <input
                                type="text"
                                placeholder="Search by name, email, phone, reg, or course..."
                                value={searchQuery}"""

new_search = """                            <input
                                type="text"
                                placeholder="Search by name, email, phone, ID number or residence..."
                                value={searchQuery}"""
content = content.replace(old_search, new_search)

old_dropdown = """                        <select
                            value={selectedYos}
                            onChange={e => setSelectedYos(e.target.value)}
                            style={{ ...inputStyle, minWidth: '130px', cursor: 'pointer' }}
                        >
                            <option value="all">All Years</option>
                            {Object.keys(usersByYos).sort((a, b) => parseInt(a) - parseInt(b)).map(yos => (
                                <option key={yos} value={yos}>Year {yos} ({usersByYos[yos]})</option>
                            ))}
                        </select>"""

new_dropdown = """                        <select
                            value={selectedYos}
                            onChange={e => setSelectedYos(e.target.value)}
                            style={{ ...inputStyle, minWidth: '170px', cursor: 'pointer' }}
                        >
                            <option value="all">All Age Groups</option>
                            {AGE_GROUPS.map(ag => (
                                <option key={ag} value={ag}>{ag} ({usersByAgeGroup[ag] || 0})</option>
                            ))}
                        </select>"""
# Wait, Chairperson has 'usersByAgeGroup' state initialized? Let's assume it doesn't have it initialized yet.
# To be safe, I'll update selectedYos to selectedAgeGroup and usersByYos to usersByAgeGroup in the component.
content = content.replace("const [selectedYos, setSelectedYos] = useState<string>('all');", "const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');")
content = content.replace("const [usersByYos, setUsersByYos] = useState<{ [key: string]: number }>({});", "const [usersByAgeGroup, setUsersByAgeGroup] = useState<{ [key: string]: number }>({});")
content = content.replace("groupedByYos[user.yos] = (groupedByYos[user.yos] || 0) + 1;", "groupedByYos[user.ageGroup] = (groupedByYos[user.ageGroup] || 0) + 1;")
content = content.replace("setUsersByYos(groupedByYos);", "setUsersByAgeGroup(groupedByYos);")

new_dropdown_corrected = """                        <select
                            value={selectedAgeGroup}
                            onChange={e => setSelectedAgeGroup(e.target.value)}
                            style={{ ...inputStyle, minWidth: '170px', cursor: 'pointer' }}
                        >
                            <option value="all">All Age Groups</option>
                            {AGE_GROUPS.map(ag => (
                                <option key={ag} value={ag}>{ag} ({usersByAgeGroup[ag] || 0})</option>
                            ))}
                        </select>"""
content = content.replace(old_dropdown, new_dropdown_corrected)

# Update count badge selectedYos
content = content.replace("searchQuery || selectedYos !== 'all'", "searchQuery || selectedAgeGroup !== 'all'")
content = content.replace("const matchesYos = selectedYos === 'all' || user.yos === selectedYos;", "const matchesYos = selectedAgeGroup === 'all' || user.ageGroup === selectedAgeGroup;")

# 5. Card detail sections
old_card_1 = """                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <BookOpen size={15} color={P} />
                                                <span><strong>Course:</strong> {user.course || 'N/A'}</span>
                                            </div>"""

new_card_1 = """                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <BookOpen size={15} color={P} />
                                                <span><strong>ID No:</strong> {user.idNumber || 'N/A'}</span>
                                            </div>"""
content = content.replace(old_card_1, new_card_1)

old_card_2 = """                                    {/* Bottom row: REG / Year / ET / Ministry */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                        gap: '8px', fontSize: '13px', color: '#555',
                                        paddingTop: '12px', borderTop: '1px solid #dee2e6',
                                    }}>
                                        <div><strong>REG:</strong> {user.reg || 'N/A'}</div>
                                        <div><strong>Year:</strong> {user.yos || 'N/A'}</div>
                                        <div><strong>ET:</strong> {user.et || 'N/A'}</div>
                                        <div><strong>Ministry:</strong> {user.ministry || 'N/A'}</div>
                                    </div>"""

new_card_2 = """                                    {/* Bottom row: Gender / AgeGroup / YearJoined / Residence */}
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
content = content.replace(old_card_2, new_card_2)

# 6. Active section routing
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
