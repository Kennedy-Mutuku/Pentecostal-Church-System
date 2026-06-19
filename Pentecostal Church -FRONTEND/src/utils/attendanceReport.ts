import { formatDateTime } from './timeUtils';

export const downloadAttendancePDF = (records: any[], leadershipRole: string, session: any) => {
    const sortedRecords = [...records].sort((a, b) => {
        const aIsVisitor = a.userType === 'visitor' || (a.regNo && a.regNo.startsWith('VISITOR-'));
        const bIsVisitor = b.userType === 'visitor' || (b.regNo && b.regNo.startsWith('VISITOR-'));
        if (aIsVisitor !== bIsVisitor) return aIsVisitor ? -1 : 1;
        return new Date(a.signedAt).getTime() - new Date(b.signedAt).getTime();
    });

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>RPC - ${session?.title || leadershipRole} - Attendance Report</title>
            <style>
                @page { size: A4; margin: 10mm; }
                body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; font-size: 12px; }
                
                /* Letterhead Styles */
                .letterhead-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 30px;
                    padding-bottom: 20px;
                    margin-bottom: 15px;
                }
                .letterhead-logo {
                    width: 120px;
                    height: 120px;
                    object-fit: contain;
                }
                .letterhead-text-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .letterhead-title {
                    color: #111827; /* Dark almost black/blue */
                    font-size: 26px;
                    font-weight: 900;
                    margin: 0 0 15px 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .letterhead-subtitle-wrapper {
                    display: flex;
                    align-items: center;
                    width: 100%;
                }
                .letterhead-line {
                    flex-grow: 1;
                    height: 2px;
                    background-color: #ef4444; /* Red line */
                }
                .letterhead-subtitle {
                    color: #ef4444; /* Red text */
                    font-size: 20px;
                    font-weight: bold;
                    margin: 0 15px;
                    text-transform: uppercase;
                }

                .header { text-align: center; margin: 20px 0 15px 0; }
                .header h2 { color: #333; font-size: 18px; margin: 5px 0; font-weight: bold; text-transform: uppercase; text-decoration: underline; }
                
                .session-info {
                    background: #f8f9fa;
                    color: #333;
                    padding: 8px 15px;
                    border: 1px solid #ddd;
                    border-left: 4px solid #111827;
                    margin: 10px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .attendance-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 10px 0;
                    font-size: 11px;
                }
                .attendance-table th {
                    background: #111827;
                    color: white;
                    padding: 8px 4px;
                    text-align: center;
                    font-weight: bold;
                    border: 1px solid #000;
                }
                .attendance-table td {
                    padding: 4px;
                    text-align: center;
                    border: 1px solid #ddd;
                    vertical-align: middle;
                }
                .signature-cell img {
                    max-width: 100%;
                    max-height: 26px;
                    object-fit: contain;
                }
                .biometric-badge {
                    background: #ecfdf5;
                    color: #059669;
                    border: 1px solid #a7f3d0;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 9px;
                    font-weight: bold;
                    display: inline-block;
                }
                .footer {
                    margin-top: 15px;
                    text-align: center;
                    font-size: 9px;
                    color: #666;
                    border-top: 2px solid #ef4444;
                    padding-top: 10px;
                }
            </style>
        </head>
        <body>
            <div class="letterhead-container">
                <img src="${window.location.origin}/images/logo.png" class="letterhead-logo" alt="RPC Logo" onerror="this.style.display='none'" />
                <div class="letterhead-text-container">
                    <h1 class="letterhead-title">RIKURUMA PENTECOSTAL CHURCH</h1>
                    <div class="letterhead-subtitle-wrapper">
                        <div class="letterhead-line"></div>
                        <h2 class="letterhead-subtitle">NYAMIRA</h2>
                        <div class="letterhead-line"></div>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 10px; color: #374151; font-weight: 700; font-size: 11px; align-items: center;">
                        <span style="display: flex; align-items: center; gap: 4px;">
                            <span style="color: #ef4444; font-size: 13px;">✉</span> communityofbelieversinjesus@gmail.com
                        </span>
                        <span style="color: #d1d5db;">|</span>
                        <span style="display: flex; align-items: center; gap: 4px;">
                            <span style="color: #ef4444; font-size: 13px;">📞</span> +254 762 053 876
                        </span>
                    </div>
                </div>
            </div>

            <div class="header"><h2>${session?.title || leadershipRole} - ATTENDANCE REPORT</h2></div>
            <div class="session-info" style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <strong>Opened:</strong> ${session?.startTime ? new Date(session.startTime).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}<br>
                    <strong style="display: inline-block; margin-top: 4px;">Closed:</strong> ${session?.endTime ? new Date(session.endTime).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : '<span style="color: #ef4444;">Ongoing</span>'}
                </div>
                <div style="text-align: right;">
                    <strong>Total Present:</strong> <span style="font-size: 14px; font-weight: 900; color: #ef4444;">${sortedRecords.length}</span><br>
                    <strong style="display: inline-block; margin-top: 4px;">Leader:</strong> ${leadershipRole}
                </div>
            </div>
            <table class="attendance-table">
                <thead>
                    <tr>
                        <th>#</th><th>NAME</th><th>TYPE</th><th>ID/REG NO.</th><th>GENDER/COURSE</th><th>PHONE</th><th>SIGN TIME</th><th>SIGNATURE</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedRecords.map((r, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td style="text-align: left; font-weight: bold;">${r.userName || 'N/A'}</td>
                            <td>${(r.userType === 'visitor' || r.idNumber?.startsWith('VISITOR-')) ? 'VISITOR' : 'MEMBER'}</td>
                            <td>${r.idNumber?.startsWith('VISITOR-') ? 'N/A' : (r.idNumber || 'N/A')}</td>
                            <td>${r.gender || r.course || 'N/A'}</td>
                            <td>${r.phoneNumber || 'N/A'}</td>
                            <td>${formatDateTime(r.signedAt, { format: 'short' })}</td>
                            <td class="signature-cell">
                                ${r.signature === 'Biometric Authenticated' ? '<span class="biometric-badge">✓ FINGERPRINT</span>' : 
                                  r.signature?.startsWith('data:image') ? `<img src="${r.signature}" alt="Sign" />` : 'N/A'}
                            </td>
                        </tr>`).join('')}
                </tbody>
            </table>
            <div class="footer"><p>RPC Nyamira | P.O BOX 408-40200, KISII, KENYA</p></div>
        </body>
        </html>
    `;

    // Use a hidden iframe so the user stays on the current page
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();

        // Wait for images (letterhead, signatures) to load, then print
        const images = iframeDoc.querySelectorAll('img');
        let loaded = 0;
        const totalImages = images.length;
        const originalTitle = document.title;
        const dateStr = session?.startTime ? new Date(session.startTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        const printTitle = `RPC Nyamira Attendance ${dateStr}`;

        const triggerPrint = () => {
            try {
                document.title = printTitle; // Force PDF save filename
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();
                document.title = originalTitle; // Restore original title
            } catch {
                document.title = originalTitle; // Restore on error
                // Fallback: if iframe print fails, open in new tab
                const fallback = window.open('', '_blank');
                if (fallback) {
                    fallback.document.open();
                    fallback.document.write(htmlContent.replace('<title>RPC', `<title>${printTitle}`));
                    fallback.document.close();
                    fallback.document.title = printTitle;
                    fallback.focus();
                    setTimeout(() => fallback.print(), 300);
                }
            }
            // Clean up iframe after a short delay
            setTimeout(() => {
                try { document.body.removeChild(iframe); } catch { /* already removed */ }
            }, 2000);
        };

        if (totalImages === 0) {
            setTimeout(triggerPrint, 100);
        } else {
            const onImageReady = () => {
                loaded++;
                if (loaded >= totalImages) triggerPrint();
            };
            images.forEach(img => {
                if (img.complete) {
                    onImageReady();
                } else {
                    img.addEventListener('load', onImageReady);
                    img.addEventListener('error', onImageReady);
                }
            });
            // Safety timeout in case images hang
            setTimeout(triggerPrint, 5000);
        }
    } else {
        document.body.removeChild(iframe);
    }
};
