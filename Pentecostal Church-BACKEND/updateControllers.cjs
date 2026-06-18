const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'controllers');
const files = ['userController.js', 'admissionAdminController.js', 'attendanceController.js'];

files.forEach(file => {
    let filePath = path.join(controllersDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Update age groups
        content = content.replace(/\['Kid', 'Youth', 'Adult', 'Elderly'\]/g, "['Kid (12 and below)', 'Youth (13-35)', 'Adult (36-59)', 'Elderly (60 and above)']");
        content = content.replace(/!\["Kid", "Youth", "Adult", "Elderly"\]/g, '!["Kid (12 and below)", "Youth (13-35)", "Adult (36-59)", "Elderly (60 and above)"]');
        content = content.replace(/'Kid', 'Youth', 'Adult', 'Elderly'/g, "'Kid (12 and below)', 'Youth (13-35)', 'Adult (36-59)', 'Elderly (60 and above)'");

        // General replacements for ministry and et
        content = content.replace(/ministry, et/g, 'yearJoined, residence');
        content = content.replace(/ministry: user\.ministry,/g, 'yearJoined: user.yearJoined,');
        content = content.replace(/et: user\.et,/g, 'residence: user.residence,');
        content = content.replace(/ministry,/g, 'yearJoined,');
        content = content.replace(/et,/g, 'residence,');

        // Update specific validations if any
        content = content.replace(/!ministry \|\| !et/g, '!yearJoined || !residence');
        content = content.replace(/Ministry and ET are required/i, 'Year Joined and Residence are required');
        
        content = content.replace(/ministry: ministry/g, 'yearJoined: yearJoined');
        content = content.replace(/et: et/g, 'residence: residence');
        
        content = content.replace(/user\.ministry = ministry/g, 'user.yearJoined = yearJoined');
        content = content.replace(/user\.et = et/g, 'user.residence = residence');

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
