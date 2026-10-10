/* =========================================================
   🔗 DÁN LINK ẢNH LOGO TRỰC TIẾP VÀO ĐÂY
   ========================================================= */
const LOGO_URL = "https://via.placeholder.com/300x300/1a1a2e/ffd700?text=LOGO";
document.getElementById('logoImg').src = LOGO_URL;

/* ==================== HẠT SÁNG ==================== */
(function createParticles() {
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    const size = 2 + Math.random() * 3;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    if (Math.random() > 0.6) {
      p.style.background = '#00d4ff';
      p.style.boxShadow = '0 0 10px #00d4ff, 0 0 20px rgba(0,212,255,0.6)';
    }
    document.body.appendChild(p);
  }
})();

/* ==================== KIỂM TRA KEY ==================== */
/*
   Key hợp lệ có 1 trong 2 dạng:
   1) Chu-XXXX-XXXX              (không có hạn)
   2) Chu-XXXX-XXXX-ND-DDMMYYYY  (N = 3 / 7 / 30, DDMMYYYY là ngày hết hạn)
*/
function parseKey(keyRaw) {
  const key = keyRaw.trim();
  // Dạng có hạn: Chu-XXXX-XXXX-ND-DDMMYYYY
  const withExp = key.match(/^Chu-([A-Z0-9]{4})-([A-Z0-9]{4})-(\d{1,3})D-(\d{8})$/i);
  if (withExp) {
    const day = withExp[3];
    const ddmmyyyy = withExp[4];
    const d = parseInt(ddmmyyyy.substring(0,2), 10);
    const m = parseInt(ddmmyyyy.substring(2,4), 10);
    const y = parseInt(ddmmyyyy.substring(4,8), 10);
    const exp = new Date(y, m - 1, d, 23, 59, 59);
    if (isNaN(exp.getTime())) return null;
    return { valid: true, hasExpiry: true, day: parseInt(day,10), expiry: exp };
  }
  // Dạng không hạn
  const noExp = key.match(/^Chu-([A-Z0-9]{4})-([A-Z0-9]{4})$/i);
  if (noExp) {
    return { valid: true, hasExpiry: false };
  }
  return null;
}

function formatDate(d) {
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

function formatRemain(ms) {
  if (ms <= 0) return 'ĐÃ HẾT HẠN';
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const parts = [];
  if (d > 0) parts.push(d + ' ngày');
  if (h > 0 || d > 0) parts.push(h + ' giờ');
  if (m > 0 || h > 0 || d > 0) parts.push(m + ' phút');
  parts.push(s + ' giây');
  return parts.join(' ');
}

/* ==================== STEP NAV ==================== */
function goStep2() {
  const keyRaw = document.getElementById('anKey').value.trim();
  const info = document.getElementById('keyInfo');

  if (!keyRaw) {
    alert('Vui lòng nhập Key trước!');
    info.classList.remove('show');
    return;
  }

  const parsed = parseKey(keyRaw);
  if (!parsed) {
    info.classList.remove('show');
    alert('Key không đúng định dạng!\nDạng hợp lệ: Chu-XXXX-XXXX hoặc Chu-XXXX-XXXX-3D-DDMMYYYY');
    return;
  }

  // Nếu có hạn → kiểm tra
  if (parsed.hasExpiry) {
    const now = new Date();
    const exp = parsed.expiry;
    const remainMs = exp - now;

    if (remainMs <= 0) {
      info.classList.remove('show');
      alert('Key đã HẾT HẠN vào ngày ' + formatDate(exp) + '\nVui lòng liên hệ Admin để gia hạn.');
      return;
    }

    // Hiển thị thông tin hạn
    const soon = remainMs < 24 * 3600 * 1000; // còn dưới 1 ngày
    info.innerHTML = `
      <div>Loại key: <strong>${parsed.day} Day</strong></div>
      <div>Ngày hết hạn: <strong>${formatDate(exp)}</strong></div>
      <div>Thời gian còn lại: <span class="${soon ? 'exp-soon' : 'exp-ok'}">${formatRemain(remainMs)}</span></div>
    `;
    info.classList.add('show');
  } else {
    info.innerHTML = `<div>Loại key: <strong>Không giới hạn</strong></div>`;
    info.classList.add('show');
  }

  // Chuyển bước
  document.getElementById('keyShow').textContent = keyRaw;
  document.getElementById('step1').classList.remove('active');
  document.getElementById('step2').classList.add('active');

  const d1 = document.getElementById('dot1');
  d1.classList.remove('active');
  d1.classList.add('done');
  d1.textContent = '✓';

  document.getElementById('line1').classList.add('done');
  document.getElementById('dot2').classList.add('active');

  setTimeout(() => document.getElementById('anHash').focus(), 350);
}

function backStep1() {
  document.getElementById('step2').classList.remove('active');
  document.getElementById('step1').classList.add('active');

  const d1 = document.getElementById('dot1');
  d1.classList.remove('done');
  d1.classList.add('active');
  d1.textContent = '1';

  document.getElementById('line1').classList.remove('done');
  document.getElementById('dot2').classList.remove('active');
  document.getElementById('anResult').classList.remove('show');
}

/* ==================== CHECK CẦU ==================== */
function analyze() {
  const raw = document.getElementById('anPattern').value.trim().toUpperCase();
  const hash = document.getElementById('anHash').value.trim();

  if (!hash) { alert('Vui lòng nhập mã #!'); return; }
  if (!raw) { alert('Vui lòng nhập chuỗi cầu T/X!'); return; }

  const seq = raw.replace(/[^TX]/g, '');
  if (seq.length < 3) {
    alert('Chuỗi cầu quá ngắn (cần ít nhất 3 ký tự T/X)!'); return;
  }

  const totalT = (seq.match(/T/g) || []).length;
  const totalX = (seq.match(/X/g) || []).length;
  const total = seq.length;

  const last = seq[seq.length - 1];
  const last3 = seq.slice(-3);
  const last4 = seq.slice(-4);

  let streak = 1;
  for (let i = seq.length - 2; i >= 0; i--) {
    if (seq[i] === last) streak++;
    else break;
  }

  let maxStreak = 1, curStreak = 1;
  for (let i = 1; i < seq.length; i++) {
    if (seq[i] === seq[i - 1]) { curStreak++; maxStreak = Math.max(maxStreak, curStreak); }
    else curStreak = 1;
  }

  let scoreTai = 0, scoreXiu = 0;
  const reasons = [];

  if (totalT > totalX) { scoreTai += 20; reasons.push(`Tổng T (${totalT}) > X (${totalX}) → nghiêng TÀI`); }
  else if (totalX > totalT) { scoreXiu += 20; reasons.push(`Tổng X (${totalX}) > T (${totalT}) → nghiêng XỈU`); }
  else reasons.push(`Tổng T = X (${totalT}) → cân bằng`);

  if (streak >= 4) {
    if (last === 'T') { scoreXiu += 25; reasons.push(`Bệt T ${streak} phiên → dễ bẻ sang XỈU`); }
    else { scoreTai += 25; reasons.push(`Bệt X ${streak} phiên → dễ bẻ sang TÀI`); }
  } else if (streak >= 2) {
    if (last === 'T') { scoreTai += 10; reasons.push(`Bệt T ${streak} phiên → còn theo TÀI`); }
    else { scoreXiu += 10; reasons.push(`Bệt X ${streak} phiên → còn theo XỈU`); }
  }

  if (last4 === 'TTXX') { scoreTai += 20; reasons.push('Cầu đôi TTXX → khả năng về TÀI'); }
  if (last4 === 'XXTT') { scoreXiu += 20; reasons.push('Cầu đôi XXTT → khả năng về XỈU'); }
  if (last4 === 'TXTX') { scoreXiu += 20; reasons.push('Cầu 1-1 TXTX → khả năng về XỈU'); }
  if (last4 === 'XTXT') { scoreTai += 20; reasons.push('Cầu 1-1 XTXT → khả năng về TÀI'); }

  if (last3 === 'TXT') { scoreXiu += 10; reasons.push('3 phiên TXT → nghiêng XỈU'); }
  if (last3 === 'XTX') { scoreTai += 10; reasons.push('3 phiên XTX → nghiêng TÀI'); }

  const diff = Math.abs(scoreTai - scoreXiu);
  const totalScore = scoreTai + scoreXiu || 1;
  const confTai = Math.round(scoreTai / totalScore * 100);
  const confXiu = Math.round(scoreXiu / totalScore * 100);

  let verdictClass, verdictText, confidence;
  if (diff < 15) {
    verdictClass = 'uncertain';
    verdictText = 'CHƯA CHẮC';
    confidence = 'Thấp (~50%)';
  } else if (scoreTai > scoreXiu) {
    verdictClass = 'tai';
    verdictText = 'TÀI';
    confidence = `Cao (${confTai}%)`;
  } else {
    verdictClass = 'xiu';
    verdictText = 'XỈU';
    confidence = `Cao (${confXiu}%)`;
  }

  document.getElementById('anVerdict').className = 'verdict ' + verdictClass;
  document.getElementById('anVerdict').textContent = verdictText;

  document.getElementById('anStats').innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><span class="stat-label">Tổng phiên</span><span class="stat-value">${total}</span></div>
      <div class="stat-card"><span class="stat-label">Số Tài</span><span class="stat-value">${totalT}</span></div>
      <div class="stat-card"><span class="stat-label">Số Xỉu</span><span class="stat-value">${totalX}</span></div>
      <div class="stat-card"><span class="stat-label">Bệt hiện tại</span><span class="stat-value">${last} × ${streak}</span></div>
      <div class="stat-card"><span class="stat-label">Bệt max</span><span class="stat-value">× ${maxStreak}</span></div>
      <div class="stat-card"><span class="stat-label">Điểm Tài</span><span class="stat-value">${scoreTai}</span></div>
      <div class="stat-card"><span class="stat-label">Điểm Xỉu</span><span class="stat-value">${scoreXiu}</span></div>
      <div class="stat-card full"><span class="stat-label">Độ tin cậy</span><span class="stat-value">${confidence}</span></div>
    </div>
    <div class="reason-title">LÝ DO CHECK CẦU</div>
    ${reasons.map(r => `<div class="reason-item">${r}</div>`).join('')}
  `;

  document.getElementById('anResult').classList.add('show');

  setTimeout(() => {
    document.getElementById('anResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 200);
}

/* ==================== ENTER ==================== */
document.getElementById('anKey').addEventListener('keypress', e => {
  if (e.key === 'Enter') goStep2();
});
document.getElementById('anHash').addEventListener('keypress', e => {
  if (e.key === 'Enter') analyze();
});
document.getElementById('anPattern').addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.ctrlKey) analyze();
});