const fs = require('fs');
const path = require('path');

// Fix Header.tsx (Session ministry)
const headerPath = path.join(__dirname, 'src', 'components', 'landing', 'Header.tsx');
if (fs.existsSync(headerPath)) {
    let content = fs.readFileSync(headerPath, 'utf8');
    content = content.replace(/ministry: string;/g, '');
    content = content.replace(/ministry: sessionType,/g, '');
    content = content.replace(/ministry\?: string;/g, '');
    fs.writeFileSync(headerPath, content, 'utf8');
    console.log('Fixed Header.tsx Session ministry');
}

// Fix ContactUs.tsx
const contactPath = path.join(__dirname, 'src', 'pages', 'ContactUs.tsx');
if (fs.existsSync(contactPath)) {
    let content = fs.readFileSync(contactPath, 'utf8');
    content = content.replace(/ministry:/g, 'yearJoined:');
    content = content.replace(/et:/g, 'residence:');
    content = content.replace(/user\.ministry/g, 'user.yearJoined');
    content = content.replace(/user\.et/g, 'user.residence');
    fs.writeFileSync(contactPath, content, 'utf8');
    console.log('Fixed ContactUs.tsx');
}

// Fix MessagesAdmin.tsx
const messagesAdminPath = path.join(__dirname, 'src', 'pages', 'MessagesAdmin.tsx');
if (fs.existsSync(messagesAdminPath)) {
    let content = fs.readFileSync(messagesAdminPath, 'utf8');
    content = content.replace(/ministry: /g, 'yearJoined: ');
    content = content.replace(/msg\.senderInfo\?.ministry/g, 'msg.senderInfo?.yearJoined');
    content = content.replace(/msg\.senderInfo\.ministry/g, 'msg.senderInfo.yearJoined');
    fs.writeFileSync(messagesAdminPath, content, 'utf8');
    console.log('Fixed MessagesAdmin.tsx');
}

console.log('Done fixing TS errors.');
