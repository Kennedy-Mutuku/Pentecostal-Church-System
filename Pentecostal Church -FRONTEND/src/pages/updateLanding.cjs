const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'landing.tsx');

if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/registrationNumber/g, 'idNumber');
    content = content.replace(/course/g, 'gender');
    content = content.replace(/yearOfStudy/g, 'ageGroup');

    // Revert Kairos Course
    content = content.replace(/Kairos gender/g, 'Kairos Course');
    content = content.replace(/setOpenCairosgender/g, 'setOpenCairosCourse');
    content = content.replace(/openKairosgender/g, 'openKairosCourse');
    
    // RegNo leftovers
    content = content.replace(/processedRegNo/g, 'processedIdNo');
    content = content.replace(/regNo: attendanceData_backend\.idNumber/g, 'idNumber: attendanceData_backend.idNumber');

    // UI
    content = content.replace(/>Course</g, '>Gender<');
    content = content.replace(/>Year of Study</g, '>Age Group<');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated landing.tsx again');
}
