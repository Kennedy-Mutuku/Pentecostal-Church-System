const fs = require('fs');
const path = require('path');

// Fix signin.tsx
const signinPath = path.join(__dirname, 'src', 'components', 'signin.tsx');
let signinContent = fs.readFileSync(signinPath, 'utf8');
signinContent = signinContent.replace(/ministry/g, 'yearJoined');
signinContent = signinContent.replace(/yearJoined: string\[\]/g, 'yearJoined: string');
signinContent = signinContent.replace(/\bet\b/g, 'residence');
fs.writeFileSync(signinPath, signinContent, 'utf8');
console.log('Fixed signin.tsx');

// Fix userManagement.tsx
const umPath = path.join(__dirname, 'src', 'pages', 'userManagement.tsx');
let umContent = fs.readFileSync(umPath, 'utf8');
umContent = umContent.replace(/ministry/g, 'yearJoined');
umContent = umContent.replace(/\bet\b/g, 'residence');
fs.writeFileSync(umPath, umContent, 'utf8');
console.log('Fixed userManagement.tsx');

// Fix AnalyticsChartsProps
const analyticsPath = path.join(__dirname, 'src', 'components', 'patron', 'AnalyticsCharts.tsx');
if (fs.existsSync(analyticsPath)) {
    let analyticsContent = fs.readFileSync(analyticsPath, 'utf8');
    analyticsContent = analyticsContent.replace(/byMinistry: \{ \[key: string\]: number \};/g, 'byMinistry?: { [key: string]: number };');
    analyticsContent = analyticsContent.replace(/byEt: \{ \[key: string\]: number \};/g, 'byEt?: { [key: string]: number };');
    
    // Also change analyticsContent so it doesn't crash if byMinistry or byEt are undefined
    analyticsContent = analyticsContent.replace(/byMinistry\)/g, '(byMinistry || {}))');
    analyticsContent = analyticsContent.replace(/byEt\)/g, '(byEt || {}))');
    
    fs.writeFileSync(analyticsPath, analyticsContent, 'utf8');
    console.log('Fixed AnalyticsCharts.tsx');
}

// Fix Dashboards assresidences
const dashFiles = ['AssistantPatronDashboard.tsx', 'ChairpersonDashboard.tsx'];
dashFiles.forEach(file => {
    let filePath = path.join(__dirname, 'src', 'pages', file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/assresidences/g, 'assets');
        
        // Remove the unused vars from the dashboards to clear TS6133
        content = content.replace(/isEtView, /g, '');
        content = content.replace(/const isEtView = activeSection\.startsWith\('et-'\);/g, '');
        content = content.replace(/const isMinView = activeSection\.startsWith\('min-'\);/g, '');
        content = content.replace(/const activeFilterText = activeSection\.slice\(activeSection\.indexOf\('-'\) \+ 1\);/g, '');
        content = content.replace(/ShieldCheck, Layers, /g, '');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed ${file}`);
    }
});
