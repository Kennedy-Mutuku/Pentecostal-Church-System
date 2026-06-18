const fs = require('fs');
const path = require('path');

// 1. UPDATE signin.tsx
const signinPath = path.join(__dirname, 'src', 'components', 'signin.tsx');
if (fs.existsSync(signinPath)) {
    let content = fs.readFileSync(signinPath, 'utf8');

    // Update state
    content = content.replace(
        /fullName: '',\s*phone: '',\s*email: '',\s*course: '',\s*regNo: '',\s*yos: '',\s*yearJoined: '',\s*residence: '',/s,
        `fullName: '',
        phone: '',
        email: '',
        idNumber: '',
        gender: '',
        ageGroup: '',
        course: '',
        regNo: '',
        yos: '',
        yearJoined: '',
        residence: '',`
    );

    // Update validation
    content = content.replace(
        /if \(!regData\.fullName \|\| !regData\.phone \|\| !regData\.email \|\| !regData\.course \|\| !regData\.regNo \|\| !regData\.yos \|\| !regData\.yearJoined \|\| !regData\.residence\) \{/g,
        `if (!regData.fullName || !regData.phone || !regData.email || !regData.idNumber || !regData.gender || !regData.ageGroup || !regData.course || !regData.regNo || !regData.yos || !regData.yearJoined || !regData.residence) {`
    );

    // Update message
    content = content.replace(
        /const message = `Hello RPC Nyamira Admin,\\n\\nI would like to be registered as a new member on the RPC Nyamira Portal. Below are my details for verification:\\n\\n\*Full Name:\* \$\{regData\.fullName\}\\n\*Phone:\* \$\{regData\.phone\}\\n\*Email:\* \$\{regData\.email\}\\n\*Course:\* \$\{regData\.course\}\\n\*Reg Number:\* \$\{regData\.regNo\}\\n\*Year of Study:\* \$\{regData\.yos\}\\n\*Year Joined RPC:\* \$\{regData\.yearJoined\}\\n\*Residence:\* \$\{regData\.residence\}\\n\\nKindly verify and register me. I understand that my login credentials \(username & password\) will be sent back to me upon successful verification.\\n\\nThank you and God bless.`;/s,
        `const message = \`Hello RPC Nyamira Admin,\\n\\nI would like to be registered as a new member on the RPC Nyamira Portal. Below are my details for verification:\\n\\n*Full Name:* \${regData.fullName}\\n*Phone:* \${regData.phone}\\n*Email:* \${regData.email}\\n*ID Number:* \${regData.idNumber}\\n*Gender:* \${regData.gender}\\n*Age Group:* \${regData.ageGroup}\\n*Course:* \${regData.course}\\n*Reg Number:* \${regData.regNo}\\n*Year of Study:* \${regData.yos}\\n*Year Joined RPC:* \${regData.yearJoined}\\n*Residence:* \${regData.residence}\\n\\nKindly verify and register me. I understand that my login credentials (username & password) will be sent back to me upon successful verification.\\n\\nThank you and God bless.\`;`
    );

    // Update UI
    const uiRegex = /<input type="text" name="course" placeholder="Course \(e.g., Computer Science\) \*" value=\{regData\.course\} onChange=\{handleRegChange\} required\s*style=\{\{ padding: '8px 10px', borderRadius: '7px', border: '1\.5px solid #e0e0e0', width: '100%', fontSize: '13px', background: '#fafafa', outline: 'none' \}\} \/>/;
    const uiReplacement = `
                                {/* ID & Gender */}
                                <div className={styles['reg-row']}>
                                    <input type="text" name="idNumber" placeholder="ID Number *" value={regData.idNumber} onChange={handleRegChange} required
                                        style={{ padding: '8px 10px', borderRadius: '7px', border: '1.5px solid #e0e0e0', width: '100%', fontSize: '13px', background: '#fafafa', outline: 'none' }} />
                                    <div style={{ position: 'relative' }}>
                                        <select name="gender" value={regData.gender} onChange={handleRegChange} required
                                            style={{
                                                width: '100%', padding: '8px 10px', borderRadius: '7px', background: '#fafafa',
                                                border: regData.gender ? '1.5px solid #E53935' : '1.5px solid #e0e0e0',
                                                fontSize: '13px', color: regData.gender ? '#333' : '#aaa', outline: 'none',
                                                appearance: 'none'
                                            }}>
                                            <option value="">Gender *</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <ChevronDown size={14} color="#888" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                    </div>
                                </div>

                                {/* Age Group */}
                                <div style={{ position: 'relative', marginBottom: '6px' }}>
                                    <select name="ageGroup" value={regData.ageGroup} onChange={handleRegChange} required
                                        style={{
                                            width: '100%', padding: '8px 10px', borderRadius: '7px', background: '#fafafa',
                                            border: regData.ageGroup ? '1.5px solid #E53935' : '1.5px solid #e0e0e0',
                                            fontSize: '13px', color: regData.ageGroup ? '#333' : '#aaa', outline: 'none',
                                            appearance: 'none'
                                        }}>
                                        <option value="">Age Group *</option>
                                        <option value="Kid (12 and below)">Kid (12 and below)</option>
                                        <option value="Youth (13-35)">Youth (13-35)</option>
                                        <option value="Adult (36-59)">Adult (36-59)</option>
                                        <option value="Elderly (60 and above)">Elderly (60 and above)</option>
                                    </select>
                                    <ChevronDown size={14} color="#888" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                </div>

                                <input type="text" name="course" placeholder="Course (e.g., Computer Science) *" value={regData.course} onChange={handleRegChange} required
                                    style={{ padding: '8px 10px', borderRadius: '7px', border: '1.5px solid #e0e0e0', width: '100%', fontSize: '13px', background: '#fafafa', outline: 'none' }} />`;
    content = content.replace(uiRegex, uiReplacement);
    
    fs.writeFileSync(signinPath, content, 'utf8');
    console.log('Updated signin.tsx');
}

// 2. UPDATE admissionAdmin.tsx
const adminPath = path.join(__dirname, 'src', 'pages', 'admissionAdmin.tsx');
if (fs.existsSync(adminPath)) {
    let content = fs.readFileSync(adminPath, 'utf8');

    // Update FormData type
    content = content.replace(
        /type FormData = \{\s*username: string;\s*phone: string;\s*email: string;\s*course: string;\s*reg: string;\s*yos: string;\s*yearJoined: string;\s*residence: string;\s*\};/s,
        `type FormData = {
  username: string;
  phone: string;
  email: string;
  idNumber: string;
  gender: string;
  ageGroup: string;
  course: string;
  reg: string;
  yos: string;
  yearJoined: string;
  residence: string;
};`
    );

    // Update state initialization
    content = content.replace(
        /const \[formData, setFormData\] = useState<FormData>\(\{\s*username: '',\s*phone: '',\s*email: '',\s*course: '',\s*reg: '',\s*yos: '',\s*yearJoined: '',\s*residence: ''\s*\}\);/s,
        `const [formData, setFormData] = useState<FormData>({
    username: '',
    phone: '',
    email: '',
    idNumber: '',
    gender: '',
    ageGroup: '',
    course: '',
    reg: '',
    yos: '',
    yearJoined: '',
    residence: ''
  });`
    );

    // Update clearForm
    content = content.replace(
        /setFormData\(\{\s*username: '',\s*phone: '',\s*email: '',\s*course: '',\s*reg: '',\s*yos: '',\s*yearJoined: '',\s*residence: ''\s*\}\);/s,
        `setFormData({
      username: '',
      phone: '',
      email: '',
      idNumber: '',
      gender: '',
      ageGroup: '',
      course: '',
      reg: '',
      yos: '',
      yearJoined: '',
      residence: ''
    });`
    );

    // Update UI
    const adminUIRegex = /<div className=\{styles\['form-div'\]\}>\s*<label htmlFor="course">COURSE<\/label>\s*<input type="text" id="course" className=\{styles\['input'\]\} value=\{formData\.course\} onChange=\{handleChange\} \/>\s*<\/div>/;
    const adminUIReplacement = `<div className={styles['form-div']}>
            <label htmlFor="idNumber">ID NUMBER</label>
            <input type="text" id="idNumber" className={styles['input']} value={formData.idNumber} onChange={handleChange} />
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="gender">GENDER</label>
            <select id="gender" className={styles['select']} value={formData.gender} onChange={handleChange}>
              <option value="">choose...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="ageGroup">AGE GROUP</label>
            <select id="ageGroup" className={styles['select']} value={formData.ageGroup} onChange={handleChange}>
              <option value="">choose...</option>
              <option value="Kid (12 and below)">Kid (12 and below)</option>
              <option value="Youth (13-35)">Youth (13-35)</option>
              <option value="Adult (36-59)">Adult (36-59)</option>
              <option value="Elderly (60 and above)">Elderly (60 and above)</option>
            </select>
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="course">COURSE</label>
            <input type="text" id="course" className={styles['input']} value={formData.course} onChange={handleChange} />
          </div>`;
    content = content.replace(adminUIRegex, adminUIReplacement);

    fs.writeFileSync(adminPath, content, 'utf8');
    console.log('Updated admissionAdmin.tsx');
}
