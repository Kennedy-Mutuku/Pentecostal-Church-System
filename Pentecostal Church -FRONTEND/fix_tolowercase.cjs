const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let count = 0;
walkDir(path.join(__dirname, 'src'), function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // Fix: user.username?.toLowerCase().includes(q) -> (user.username || '').toLowerCase().includes(q)
        // Match: something?.toLowerCase().includes(something)
        content = content.replace(/([a-zA-Z0-9_]+(?:\??\.[a-zA-Z0-9_]+)*)\?\([^)]*\)\?\.toLowerCase\(\)/g, "($1 || '').toLowerCase()"); // For method calls
        content = content.replace(/([a-zA-Z0-9_]+(?:\??\.[a-zA-Z0-9_]+)+)\?\.toLowerCase\(\)/g, "($1 || '').toLowerCase()");

        // Fix: searchQuery.toLowerCase() -> (searchQuery || '').toLowerCase()
        content = content.replace(/searchQuery\.toLowerCase\(\)/g, "(searchQuery || '').toLowerCase()");
        content = content.replace(/searchTerm\.toLowerCase\(\)/g, "(searchTerm || '').toLowerCase()");
        content = content.replace(/search\.toLowerCase\(\)/g, "(search || '').toLowerCase()");
        
        // Fix Chairperson user props
        content = content.replace(/user\.username\?\.toLowerCase\(\)\.includes/g, "(user.username || '').toLowerCase().includes");
        content = content.replace(/user\.email\?\.toLowerCase\(\)\.includes/g, "(user.email || '').toLowerCase().includes");
        content = content.replace(/user\.reg\?\.toLowerCase\(\)\.includes/g, "(user.reg || '').toLowerCase().includes");
        content = content.replace(/user\.course\?\.toLowerCase\(\)\.includes/g, "(user.course || '').toLowerCase().includes");
        content = content.replace(/user\.residence\?\.toLowerCase\(\)\.includes/g, "(user.residence || '').toLowerCase().includes");

        // RequisitionsAdmin
        content = content.replace(/req\.recipientName\.toLowerCase\(\)/g, "(req.recipientName || '').toLowerCase()");
        content = content.replace(/req\.purpose\.toLowerCase\(\)/g, "(req.purpose || '').toLowerCase()");
        content = content.replace(/item\.itemName\.toLowerCase\(\)/g, "(item.itemName || '').toLowerCase()");

        // MessagesAdmin
        content = content.replace(/message\.subject\.toLowerCase\(\)/g, "(message.subject || '').toLowerCase()");
        content = content.replace(/message\.message\.toLowerCase\(\)/g, "(message.message || '').toLowerCase()");
        content = content.replace(/message\.senderInfo\?\.username\.toLowerCase\(\)/g, "(message.senderInfo?.username || '').toLowerCase()");

        // Media
        content = content.replace(/item\.event\.toLowerCase\(\)/g, "(item.event || '').toLowerCase()");
        content = content.replace(/item\.date\.toLowerCase\(\)/g, "(item.date || '').toLowerCase()");

        // Library
        content = content.replace(/book\.title\.toLowerCase\(\)/g, "(book.title || '').toLowerCase()");

        // Compassion
        content = content.replace(/request\.name\.toLowerCase\(\)/g, "(request.name || '').toLowerCase()");
        content = content.replace(/request\.description\.toLowerCase\(\)/g, "(request.description || '').toLowerCase()");
        content = content.replace(/donation\.donorName\.toLowerCase\(\)/g, "(donation.donorName || '').toLowerCase()");
        content = content.replace(/donation\.email\.toLowerCase\(\)/g, "(donation.email || '').toLowerCase()");

        // Board Applications
        content = content.replace(/a\.applicantName\.toLowerCase\(\)/g, "(a.applicantName || '').toLowerCase()");
        content = content.replace(/a\.boardId\.toLowerCase\(\)/g, "(a.boardId || '').toLowerCase()");

        // Attendance
        content = content.replace(/message\.toLowerCase\(\)/g, "(message || '').toLowerCase()");

        // AdminManager
        content = content.replace(/currentTab\.label\.toLowerCase\(\)/g, "(currentTab.label || '').toLowerCase()");
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            count++;
            console.log('Fixed:', filePath);
        }
    }
});
console.log('Total files fixed:', count);
