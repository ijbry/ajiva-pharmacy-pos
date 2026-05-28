/* ================================================
   AJIVA Pharmacy POS - dashboard.js
   Author: James Brian Villar
   Description: Dashboard rendering and stats
================================================ */

// ===== DASHBOARD =====
function renderDashboard() {
  const today = new Date().toDateString();
  let todayTx, todaySales;
  if (dbMode === 'supabase') {
    todayTx = transactions.filter(t => new Date(t.created_at).toDateString() === today);
    todaySales = todayTx.reduce((a, t) => a + parseFloat(t.total), 0);
  } else {
    todayTx = transactions.filter(t => new Date(t.date).toDateString() === today);
    todaySales = todayTx.reduce((a, t) => a + t.total, 0);
  }
  const low = products.filter(p => p.stock <= p.low_stock_alert && p.stock > 0);
  const out = products.filter(p => p.stock === 0);
  document.getElementById('s-sales').textContent = fmt(todaySales);
  document.getElementById('s-txcount').textContent = todayTx.length + ' transactions';
  document.getElementById('s-tx').textContent = todayTx.length;
  document.getElementById('s-low').textContent = low.length + out.length;
  document.getElementById('s-items').textContent = products.length;
  const recentEl = document.getElementById('dash-recent');
  if (transactions.length === 0) {
    recentEl.innerHTML = '<div style="font-size:13px;color:var(--gray-400);text-align:center;padding:1rem">No transactions yet</div>';
  } else {
    recentEl.innerHTML = [...transactions].slice(0, 6).map(t => {
      const orNum = t.or_number || ('OR-' + String(t.id).padStart(4,'0'));
      const dt = new Date(t.created_at || t.date);
      const timeStr = dt.toLocaleTimeString('en-PH', {hour:'2-digit', minute:'2-digit'});
      return `<div class="transaction-row"><div><div style="font-weight:500">${orNum}</div><div style="font-size:12px;color:var(--gray-400)">${timeStr}</div></div><div class="tx-amount">${fmt(parseFloat(t.total))}</div></div>`;
    }).join('');
  }
  const lsEl = document.getElementById('dash-lowstock');
  const alerts = [...out, ...low].slice(0, 6);
  if (alerts.length === 0) {
    lsEl.innerHTML = '<div style="font-size:13px;color:#166534;text-align:center;padding:1rem">✓ All stocks are sufficient</div>';
  } else {
    lsEl.innerHTML = alerts.map(p => `<div class="low-stock-row"><div style="font-size:13px;font-weight:500">${p.name}</div><span class="badge ${p.stock === 0 ? 'badge-red' : 'badge-amber'}">${p.stock === 0 ? 'Out of Stock' : 'Low: ' + p.stock}</span></div>`).join('');
  }
}



// ===== CATEGORY TABS =====
function initCatTabs() {
  const cats = ['All', ...new Set(products.map(p => p.category || p.cat))];
  document.getElementById('cat-tabs').innerHTML = cats.map(c => `<button class="cat-tab ${c===selectedCat?'active':''}" onclick="selectCat('${c}',this)">${c}</button>`).join('');
}
function selectCat(c, el) {
  selectedCat = c;
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  renderProducts();
}