/* ================================================
   AJIVA Pharmacy POS - init.js
   Author: James Brian Villar
   Description: App initialization
================================================ */

// ===== INIT =====
async function initApp() {
  const d = new Date();
  document.getElementById('dash-date').textContent = d.toLocaleDateString('en-PH', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const branchBadge = document.getElementById('dash-branch-badge');
  if (branchBadge && currentBranch) branchBadge.textContent = '📍 ' + currentBranch.name;
  const today = d.toISOString().split('T')[0];
  document.getElementById('daily-date').value = today;
  document.getElementById('hist-to').value = today;
  const w = new Date(d); w.setDate(w.getDate()-7);
  document.getElementById('hist-from').value = w.toISOString().split('T')[0];
  if (dbMode === 'supabase') {
    await loadBranchesFromDB();
    await loadProductsFromDB();
    await loadTransactionsFromDB();
    await loadUsersFromDB();
  } else {
    branches = JSON.parse(localStorage.getItem('ajiva_branches') || '[{"id":"1","name":"AJIVA Main Branch","code":"MAIN","address":"","is_active":true}]');
    populateBranchDropdown();
    await loadUsersFromDB();
  }
  // Filter local products by branch
  if (dbMode !== 'supabase' && currentBranch?.id) {
    products = products.filter(p => !p.branch_id || String(p.branch_id) === String(currentBranch.id));
  }
  initCatTabs();
  renderProducts();
  renderInventory();
  populateCatFilter();
  const invLabel = document.getElementById('inv-branch-label');
  if (invLabel && currentBranch) invLabel.textContent = 'Branch: ' + currentBranch.name;
  // Filter local transactions by branch
  if (dbMode !== 'supabase' && currentBranch?.id) {
    transactions = transactions.filter(t => !t.branch_id || String(t.branch_id) === String(currentBranch.id));
  }
  renderDashboard();
  renderReports();
  renderAlerts();
}