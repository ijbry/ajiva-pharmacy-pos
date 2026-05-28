/* ================================================
   AJIVA Pharmacy POS - ui.js
   Author: James Brian Villar
   Description: UI helpers, screen navigation, mobile sidebar
================================================ */

// ===== SCREEN NAV =====
function showScreen(name, el) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('screen-'+name).classList.add('active');
  if (el) el.classList.add('active');
  if (isMobile()) closeSidebar();
  updateMobileBottomNav(name);
  if (name==='dashboard') renderDashboard();
  if (name==='inventory') { renderInventory(); populateCatFilter(); }
  if (name==='reports') { populateReportBranchFilter(); renderReports(); }
  if (name==='branches') renderBranches();
  if (name==='users') renderUsers();
  if (name==='shift') { updateShiftUI(); renderShiftHistory(); }
  if (name==='refund') { document.getElementById('refund-search').focus(); }
  if (name==='plu') { populatePLUCatFilter(); renderPLU(); setTimeout(()=>document.getElementById('plu-search').focus(),100); }
  if (name==='incoming') renderIncoming();
  if (name==='alerts') renderAlerts();
}
function closeModal(id) { 
  const el = document.getElementById(id); 
  if(el) { el.classList.remove('open'); el.style.display=''; }
}
function openModal(id) {
  const el = document.getElementById(id);
  if(el) { el.classList.add('open'); el.style.display='flex'; }
}



// ===== UTILS =====
function fmt(n) { return '₱' + parseFloat(n||0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,','); }
function showToast(msg, type='') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'toast ' + type;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2800);
}






// ===== MOBILE SIDEBAR =====
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
}
function closeSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
}
function isMobile() { return window.innerWidth <= 768; }

function initMobileNav() {
  const mbn = document.getElementById('mobile-bottom-nav');
  if (!mbn) return;
  if (isMobile()) {
    mbn.style.display = 'flex';
    // Show inventory/reports only for admin
    if (currentUser?.role === 'admin') {
      document.getElementById('mbn-inventory').style.display = 'flex';
      document.getElementById('mbn-reports').style.display = 'flex';
    }
  } else {
    mbn.style.display = 'none';
  }
}

function updateMobileBottomNav(screenName) {
  document.querySelectorAll('.mobile-bottom-nav button').forEach(b => b.classList.remove('active'));
  const map = { dashboard:'mbn-dashboard', pos:'mbn-pos', inventory:'mbn-inventory', reports:'mbn-reports' };
  if (map[screenName]) {
    const btn = document.getElementById(map[screenName]);
    if (btn) btn.classList.add('active');
  }
}

// Close sidebar when nav item clicked on mobile
window.addEventListener('resize', () => {
  const mbn = document.getElementById('mobile-bottom-nav');
  if (!mbn) return;
  if (isMobile()) {
    mbn.style.display = 'flex';
  } else {
    mbn.style.display = 'none';
    closeSidebar();
  }
});