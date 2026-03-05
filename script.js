// CONFIGURATION
const ADMIN_PASSWORD = "admin1234"; // เปลี่ยนรหัสผ่านตรงนี้ได้เลย

// 1. ระบบบันทึกข้อความ (Index Page)
function sendFeedback() {
    const input = document.getElementById('feedbackInput');
    const message = input.value.trim();

    if (!message) {
        alert("กรุณาพิมพ์ข้อความก่อนส่งนะคะ");
        return;
    }

    let feedbacks = JSON.parse(localStorage.getItem('anon_data')) || [];
    feedbacks.push({
        id: Date.now(),
        content: message,
        time: new Date().toLocaleString('th-TH')
    });

    localStorage.setItem('anon_data', JSON.stringify(feedbacks));
    alert("ส่งความเห็นเรียบร้อยแล้ว! ขอบคุณนะคะ");
    input.value = "";
}

// 2. ระบบ Login (Login Page)
function checkLogin() {
    const pass = document.getElementById('passwordInput').value;
    const error = document.getElementById('errorMsg');

    if (pass === ADMIN_PASSWORD) {
        sessionStorage.setItem('isAdmin', 'true');
        window.location.href = 'admin.html';
    } else {
        error.innerText = "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่";
    }
}

// 3. ระบบความปลอดภัย (Admin Page Protection)
function protectPage() {
    if (sessionStorage.getItem('isAdmin') !== 'true') {
        window.location.href = 'login.html';
    }
}

function logout() {
    sessionStorage.removeItem('isAdmin');
    window.location.href = 'login.html';
}

// 4. ระบบจัดการข้อมูล (Admin Page)
function renderAdminTable() {
    const tableBody = document.getElementById('adminList');
    if (!tableBody) return;

    const feedbacks = JSON.parse(localStorage.getItem('anon_data')) || [];
    tableBody.innerHTML = feedbacks.length ? "" : '<tr><td colspan="3" style="text-align:center">ยังไม่มีข้อความส่งเข้ามา</td></tr>';

    feedbacks.forEach((item, index) => {
        tableBody.innerHTML += `
            <tr>
                <td style="font-size:0.8rem; color:#888; white-space:nowrap;">${item.time}</td>
                <td style="color:#333;">${item.content}</td>
                <td><button class="btn-del" onclick="deleteFeedback(${index})">ลบ</button></td>
            </tr>
        `;
    });
}

function deleteFeedback(index) {
    if (confirm("คุณแน่ใจนะว่าจะลบข้อความนี้?")) {
        let feedbacks = JSON.parse(localStorage.getItem('anon_data'));
        feedbacks.splice(index, 1);
        localStorage.setItem('anon_data', JSON.stringify(feedbacks));
        renderAdminTable();
    }
}