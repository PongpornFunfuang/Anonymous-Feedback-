// ==========================
// CONFIG
// ==========================
const ADMIN_PASSWORD = "admin1234";

// ==========================
// 1. ส่ง Feedback
// ==========================
function sendFeedback() {
    const input = document.getElementById('feedbackInput');
    const message = input.value.trim();

    if (!message) {
        alert("กรุณาพิมพ์ข้อความก่อนส่ง");
        return;
    }

    let feedbacks = JSON.parse(localStorage.getItem('anon_data')) || [];

    feedbacks.push({
        id: Date.now(),
        content: message,
        time: new Date().toLocaleString('th-TH'),
        status: "active"
    });

    localStorage.setItem('anon_data', JSON.stringify(feedbacks));

    alert("ส่งเรียบร้อยแล้ว!");
    input.value = "";
}

// ==========================
// 2. Login
// ==========================
function checkLogin() {
    const pass = document.getElementById('passwordInput').value;
    const error = document.getElementById('errorMsg');

    if (pass === ADMIN_PASSWORD) {
        sessionStorage.setItem('isAdmin', 'true');
        sessionStorage.setItem('adminName', 'admin');
        window.location.href = 'admin.html';
    } else {
        error.innerText = "รหัสผ่านไม่ถูกต้อง";
    }
}

// ==========================
// 3. Protect Page
// ==========================
function protectPage() {
    if (sessionStorage.getItem('isAdmin') !== 'true') {
        window.location.href = 'login.html';
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// ==========================
// 4. แสดงข้อมูล Admin
// ==========================
function renderAdminTable() {
    const tableBody = document.getElementById('adminList');
    if (!tableBody) return;

    const feedbacks = JSON.parse(localStorage.getItem('anon_data')) || [];

    if (feedbacks.length === 0) {
        tableBody.innerHTML = `
        <tr>
            <td colspan="4" style="text-align:center">ยังไม่มีข้อมูล</td>
        </tr>`;
        return;
    }

    tableBody.innerHTML = "";

    feedbacks.forEach((item, index) => {
        tableBody.innerHTML += `
        <tr style="${item.status === 'deleted' ? 'opacity:0.5;' : ''}">
            <td style="white-space:nowrap;">${item.time}</td>

            <td>
                ${item.content}
                <br>
                <small style="color:${item.status === 'active' ? 'green' : 'red'}">
                    ${item.status}
                </small>
            </td>

            <td>
                ${item.status === 'active'
                    ? `<button class="btn-del" onclick="deleteFeedback(${index})">ลบ</button>`
                    : `<button onclick="restoreFeedback(${index})">กู้คืน</button>`
                }
            </td>
        </tr>
        `;
    });
}

// ==========================
// 5. ลบ (Soft Delete)
// ==========================
function deleteFeedback(index) {
    if (!confirm("ต้องการลบใช่ไหม?")) return;

    let feedbacks = JSON.parse(localStorage.getItem('anon_data'));
    let logs = JSON.parse(localStorage.getItem('audit_log')) || [];

    feedbacks[index].status = "deleted";

    logs.push({
        action: "delete",
        feedbackId: feedbacks[index].id,
        admin: sessionStorage.getItem('adminName'),
        time: new Date().toLocaleString('th-TH')
    });

    localStorage.setItem('anon_data', JSON.stringify(feedbacks));
    localStorage.setItem('audit_log', JSON.stringify(logs));

    renderAdminTable();
    renderLogs();
}

// ==========================
// 6. กู้คืน
// ==========================
function restoreFeedback(index) {
    let feedbacks = JSON.parse(localStorage.getItem('anon_data'));
    let logs = JSON.parse(localStorage.getItem('audit_log')) || [];

    feedbacks[index].status = "active";

    logs.push({
        action: "restore",
        feedbackId: feedbacks[index].id,
        admin: sessionStorage.getItem('adminName'),
        time: new Date().toLocaleString('th-TH')
    });

    localStorage.setItem('anon_data', JSON.stringify(feedbacks));
    localStorage.setItem('audit_log', JSON.stringify(logs));

    renderAdminTable();
    renderLogs();
}

// ==========================
// 7. Audit Log
// ==========================
function renderLogs() {
    const logList = document.getElementById('logList');
    if (!logList) return;

    const logs = JSON.parse(localStorage.getItem('audit_log')) || [];

    if (logs.length === 0) {
        logList.innerHTML = "<li>ยังไม่มีประวัติ</li>";
        return;
    }

    logList.innerHTML = logs.map(log => `
        <li>
            [${log.time}] ${log.admin} → ${log.action} (ID: ${log.feedbackId})
        </li>
    `).join('');
}
