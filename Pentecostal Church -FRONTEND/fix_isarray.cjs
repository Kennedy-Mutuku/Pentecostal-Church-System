const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'PatronDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. fetchFamilies
content = content.replace(
    /setFamilies\(response\.data \|\| \[\]\);/g,
    'setFamilies(Array.isArray(response.data) ? response.data : []);'
);

// 2. fetchUsers
content = content.replace(
    /const userData = response\.data;\n\n        setUsers\(userData\);\n        setUserCount\(userData\.length\);\n\n        const groupedByAgeGroup: \{ \[key: string\]: number \} = \{\};\n\n        userData\.forEach\(\(user: User\) => \{/g,
    `const userData = Array.isArray(response.data) ? response.data : [];

        setUsers(userData);
        setUserCount(userData.length);

        const groupedByAgeGroup: { [key: string]: number } = {};

        userData.forEach((user: User) => {`
);

// 3. fetchMessages
content = content.replace(
    /const msgs = response\.data;\n        \n        \/\/ Track new feedback/g,
    `const msgs = Array.isArray(response.data) ? response.data : [];
        
        // Track new feedback`
);

// 4. fetchFinanceData
const oldFinanceData = `            setFinanceTransactions(txs || []);
            setAssets(assets || []);
            
            // Calculate Balance
            const income = (txs || []).filter((t: any) => t.type === 'cash_in').reduce((acc: number, t: any) => acc + t.amount, 0);
            const expense = (txs || []).filter((t: any) => t.type === 'cash_out').reduce((acc: number, t: any) => acc + t.amount, 0);
            setAccountBalance(income - expense);

            // Calculate Asset Total
            const assetTotal = (assets || []).reduce((acc: number, a: any) => acc + (a.valuation || 0), 0);
            setTotalAssetValue(assetTotal);

            // Track new assets
            if (lastCounts.current.assets > 0 && (assets || []).length > lastCounts.current.assets) {
                const newCount = (assets || []).length - lastCounts.current.assets;
                const latest = [...(assets || [])].sort((a, b) => 
                    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                )[0];
                addNotification(
                    'New Asset Recorded',
                    \`\${newCount} new asset(s) added. Latest: \${latest.name} (\${formatCurrencyShort(latest.valuation || 0)})\`,
                    'asset',
                    'assets'
                );
            }
            lastCounts.current.assets = (assets || []).length;

            // Track new transactions
            if (lastCounts.current.transactions > 0 && (txs || []).length > lastCounts.current.transactions) {
                const newCount = (txs || []).length - lastCounts.current.transactions;
                const latest = [...(txs || [])].sort((a, b) => 
                    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                )[0];
                addNotification(
                    'New Financial Entry',
                    \`\${newCount} new transaction(s) recorded. Latest: \${latest.type.replace('_', ' ')} of \${formatCurrencyShort(latest.amount)}\`,
                    'finance',
                    'finance-transactions'
                );
            }
            lastCounts.current.transactions = (txs || []).length;`;

const newFinanceData = `            const txArray = Array.isArray(txs) ? txs : [];
            const assetsArray = Array.isArray(assets) ? assets : [];
            setFinanceTransactions(txArray);
            setAssets(assetsArray);
            
            // Calculate Balance
            const income = txArray.filter((t: any) => t.type === 'cash_in').reduce((acc: number, t: any) => acc + t.amount, 0);
            const expense = txArray.filter((t: any) => t.type === 'cash_out').reduce((acc: number, t: any) => acc + t.amount, 0);
            setAccountBalance(income - expense);

            // Calculate Asset Total
            const assetTotal = assetsArray.reduce((acc: number, a: any) => acc + (a.valuation || 0), 0);
            setTotalAssetValue(assetTotal);

            // Track new assets
            if (lastCounts.current.assets > 0 && assetsArray.length > lastCounts.current.assets) {
                const newCount = assetsArray.length - lastCounts.current.assets;
                const latest = [...assetsArray].sort((a, b) => 
                    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                )[0];
                addNotification(
                    'New Asset Recorded',
                    \`\${newCount} new asset(s) added. Latest: \${latest.name} (\${formatCurrencyShort(latest.valuation || 0)})\`,
                    'asset',
                    'assets'
                );
            }
            lastCounts.current.assets = assetsArray.length;

            // Track new transactions
            if (lastCounts.current.transactions > 0 && txArray.length > lastCounts.current.transactions) {
                const newCount = txArray.length - lastCounts.current.transactions;
                const latest = [...txArray].sort((a, b) => 
                    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                )[0];
                addNotification(
                    'New Financial Entry',
                    \`\${newCount} new transaction(s) recorded. Latest: \${latest.type.replace('_', ' ')} of \${formatCurrencyShort(latest.amount)}\`,
                    'finance',
                    'finance-transactions'
                );
            }
            lastCounts.current.transactions = txArray.length;`;

content = content.replace(oldFinanceData, newFinanceData);

// 5. fetchMedia
content = content.replace(
    /const apiItems = response\.data \|\| \[\];/g,
    'const apiItems = Array.isArray(response.data) ? response.data : [];'
);

// 6. fix filter fallbacks
content = content.replace(/const displayUsers = \(users \|\| \[\]\)\.filter\(/g, 'const displayUsers = (Array.isArray(users) ? users : []).filter(');
content = content.replace(/const filteredGallery = \(mediaItems \|\| \[\]\)\.filter\(/g, 'const filteredGallery = (Array.isArray(mediaItems) ? mediaItems : []).filter(');
content = content.replace(/const filteredFamilies = \(families \|\| \[\]\)\.filter\(/g, 'const filteredFamilies = (Array.isArray(families) ? families : []).filter(');

// Also fix in ChairpersonDashboard if needed
const chairPath = path.join(__dirname, 'src', 'pages', 'ChairpersonDashboard.tsx');
if (fs.existsSync(chairPath)) {
    let chair = fs.readFileSync(chairPath, 'utf8');
    chair = chair.replace(/const displayUsers = \(users \|\| \[\]\)\.filter\(/g, 'const displayUsers = (Array.isArray(users) ? users : []).filter(');
    chair = chair.replace(/const filteredGallery = \(mediaItems \|\| \[\]\)\.filter\(/g, 'const filteredGallery = (Array.isArray(mediaItems) ? mediaItems : []).filter(');
    chair = chair.replace(/const userData = response\.data;\n\n        setUsers\(userData\);/g, 'const userData = Array.isArray(response.data) ? response.data : [];\n\n        setUsers(userData);');
    chair = chair.replace(/const apiItems = response\.data \|\| \[\];/g, 'const apiItems = Array.isArray(response.data) ? response.data : [];');
    chair = chair.replace(/const msgs = response\.data;\n        setMessages\(msgs\);/g, 'const msgs = Array.isArray(response.data) ? response.data : [];\n        setMessages(msgs);');
    fs.writeFileSync(chairPath, chair, 'utf8');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed Array checks in PatronDashboard and ChairpersonDashboard');
