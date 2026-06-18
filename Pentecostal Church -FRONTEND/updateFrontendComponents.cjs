const fs = require('fs');
const path = require('path');

const srcPagesDir = path.join(__dirname, 'src', 'pages');
const srcComponentsDir = path.join(__dirname, 'src', 'components');

const files = [
    { dir: srcComponentsDir, name: 'signin.tsx' },
    { dir: srcPagesDir, name: 'admissionAdmin.tsx' },
    { dir: srcPagesDir, name: 'userManagement.tsx' },
    { dir: srcPagesDir, name: 'userProfile.tsx' },
    { dir: srcPagesDir, name: 'AssistantPatronDashboard.tsx' },
    { dir: srcPagesDir, name: 'ChairpersonDashboard.tsx' },
    { dir: srcPagesDir, name: 'landing.tsx' }
];

files.forEach(({ dir, name }) => {
    let filePath = path.join(dir, name);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Update age groups
        content = content.replace(/\{ id: 'kid', label: 'Kid' \}/gi, "{ id: 'Kid (12 and below)', label: 'Kid (12 and below)' }");
        content = content.replace(/\{ id: 'youth', label: 'Youth' \}/gi, "{ id: 'Youth (13-35)', label: 'Youth (13-35)' }");
        content = content.replace(/\{ id: 'adult', label: 'Adult' \}/gi, "{ id: 'Adult (36-59)', label: 'Adult (36-59)' }");
        content = content.replace(/\{ id: 'elderly', label: 'Elderly' \}/gi, "{ id: 'Elderly (60 and above)', label: 'Elderly (60 and above)' }");
        content = content.replace(/'Kid', 'Youth', 'Adult', 'Elderly'/g, "'Kid (12 and below)', 'Youth (13-35)', 'Adult (36-59)', 'Elderly (60 and above)'");

        // Object property and variable replacements (word boundaries to avoid replacing "let")
        content = content.replace(/\bministry\b:/g, 'yearJoined:');
        content = content.replace(/\bet\b:/g, 'residence:');
        content = content.replace(/\bministry\b,/g, 'yearJoined,');
        content = content.replace(/\bet\b,/g, 'residence,');
        content = content.replace(/formData\.ministry/g, 'formData.yearJoined');
        content = content.replace(/formData\.et/g, 'formData.residence');
        content = content.replace(/user\.ministry/g, 'user.yearJoined');
        content = content.replace(/user\.et/g, 'user.residence');
        content = content.replace(/ministries =/g, 'yearsJoined =');
        content = content.replace(/ets =/g, 'residences =');

        // Form labels and UI text
        content = content.replace(/>MINISTRY</g, '>YEAR JOINED RPC<');
        content = content.replace(/>Ministry</g, '>Year Joined RPC<');
        content = content.replace(/>ET</g, '>RESIDENCE<');
        content = content.replace(/>Evangelistic Team</g, '>Residence<');
        content = content.replace(/Select Ministry/g, 'Enter Year Joined RPC');
        content = content.replace(/Select ET/g, 'Enter Residence');
        content = content.replace(/Ministry:/g, 'Year Joined RPC:');
        content = content.replace(/ET:/g, 'Residence:');

        // If dropdowns were used, we need to change them to text inputs where applicable.
        // Wait, yearJoined and residence should be text inputs, not dropdowns!
        // We'll replace the select elements for ministry and et with input type="text"
        content = content.replace(/<select\s+name="ministry"[\s\S]*?<\/select>/g, '<input type="text" name="yearJoined" placeholder="Enter Year Joined RPC" value={formData.yearJoined} onChange={handleRegChange} style={{ flex: 1, padding: \'10px\', borderRadius: \'4px\', border: \'1px solid #ccc\', fontSize: \'14px\' }} />');
        content = content.replace(/<select\s+name="et"[\s\S]*?<\/select>/g, '<input type="text" name="residence" placeholder="Enter Residence" value={formData.residence} onChange={handleRegChange} style={{ flex: 1, padding: \'10px\', borderRadius: \'4px\', border: \'1px solid #ccc\', fontSize: \'14px\' }} />');

        // Some places might have `editData.ministry`
        content = content.replace(/editData\.ministry/g, 'editData.yearJoined');
        content = content.replace(/editData\.et/g, 'editData.residence');

        // Types
        content = content.replace(/ministry\?: string;/g, 'yearJoined?: string;');
        content = content.replace(/et\?: string;/g, 'residence?: string;');
        content = content.replace(/ministry: string;/g, 'yearJoined: string;');
        content = content.replace(/et: string;/g, 'residence: string;');

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${name}`);
    }
});
