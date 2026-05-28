/* ================================================
   AJIVA Pharmacy POS - shifts.js
   Author: James Brian Villar
   Description: Shift open/close, EOD reading
================================================ */

// ===== SHIFT STATE =====
let currentShift = null;
let shiftHistory = [];
let incomingStock = [];
let voidingTxId = null;



// ===== SHIFT FUNCTIONS =====
function openShiftModal(type) {
  const title = document.getElementById('shift-modal-title');
  const confirmBtn = document.getElementById('shift-confirm-btn');
  const closingField = document.getElementById('closing-cash-field');
  const varianceDiv = document.getElementById('variance-display');
  document.getElementById('shift-cashier').value = currentUser?.name || '';
  document.getElementById('shift-notes').value = '';
  if (type === 'open') {
    title.innerHTML = '<i class="ti ti-clock-play" style="font-size:18px"></i> Open Shift';
    confirmBtn.innerHTML = '<i class="ti ti-check"></i> Open Shift';
    confirmBtn.onclick = confirmShift;
    document.getElementById('shift-opening').value = '';
    closingField.style.display = 'none';
    varianceDiv.style.display = 'none';
  } else {
    title.innerHTML = '<i class="ti ti-clock-stop" style="font-size:18px"></i> Close Shift & EOD';
    confirmBtn.innerHTML = '<i class="ti ti-check"></i> Close Shift';
    confirmBtn.style.background = 'var(--red)';
    closingField.style.display = 'block';
    varianceDiv.style.display = 'block';
    document.getElementById('shift-closing').value = '';
    // calc expected
    const shiftSales = getShiftSales();
    const expected = (currentShift?.opening_cash || 0) + shiftSales;
    document.getElementById('variance-expected').textContent = fmt(expected);
    document.getElementById('variance-actual').textContent = fmt(0);
    document.getElementById('variance-diff').textContent = fmt(-expected);
    document.getElementById('variance-diff').style.color = 'var(--red)';
  }
  openModal('shift-modal');
}

function calcVariance() {
  const closing = parseFloat(document.getElementById('shift-closing').value) || 0;
  const shiftSales = getShiftSales();
  const expected = (currentShift?.opening_cash || 0) + shiftSales;
  const diff = closing - expected;
  document.getElementById('variance-actual').textContent = fmt(closing);
  document.getElementById('variance-diff').textContent = (diff >= 0 ? '+' : '') + fmt(diff);
  document.getElementById('variance-diff').style.color = diff >= 0 ? 'var(--green)' : 'var(--red)';
}

function getShiftSales() {
  if (!currentShift) return 0;
  return transactions
    .filter(t => t.shift_id === currentShift.id || (currentShift.start_time && new Date(t.created_at||t.date) >= new Date(currentShift.start_time)))
    .reduce((a, t) => a + parseFloat(t.total || 0), 0);
}

function getShiftTx() {
  if (!currentShift) return [];
  return transactions.filter(t => t.shift_id === currentShift.id || (currentShift.start_time && new Date(t.created_at||t.date) >= new Date(currentShift.start_time)));
}

function confirmShift() {
  const isOpening = !currentShift;
  if (isOpening) {
    const opening = parseFloat(document.getElementById('shift-opening').value) || 0;
    const notes = document.getElementById('shift-notes').value;
    currentShift = {
      id: 'shift_' + Date.now(),
      cashier: currentUser?.name,
      branch: currentBranch?.name,
      opening_cash: opening,
      start_time: new Date().toISOString(),
      notes,
      status: 'open'
    };
    shiftHistory.unshift(currentShift);
    closeModal('shift-modal');
    updateShiftUI();
    showToast('Shift opened successfully!', 'success');
  } else {
    const closing = parseFloat(document.getElementById('shift-closing').value) || 0;
    const notes = document.getElementById('shift-notes').value;
    const shiftSales = getShiftSales();
    const expected = (currentShift.opening_cash || 0) + shiftSales;
    const variance = closing - expected;
    currentShift.closing_cash = closing;
    currentShift.expected_cash = expected;
    currentShift.variance = variance;
    currentShift.end_time = new Date().toISOString();
    currentShift.sales = shiftSales;
    currentShift.tx_count = getShiftTx().length;
    currentShift.status = 'closed';
    currentShift.close_notes = notes;
    closeModal('shift-modal');
    renderEODSummary();
    updateShiftUI();
    showToast('Shift closed! EOD report ready.', 'success');
    currentShift = null;
  }
  renderShiftHistory();
}

function updateShiftUI() {
  const hasShift = !!currentShift;
  document.getElementById('btn-open-shift').style.display = hasShift ? 'none' : 'flex';
  document.getElementById('btn-close-shift').style.display = hasShift ? 'flex' : 'none';
  document.getElementById('btn-print-eod').style.display = hasShift ? 'none' : 'flex';
  const banner = document.getElementById('active-shift-banner');
  if (hasShift) {
    banner.style.display = 'block';
    const started = new Date(currentShift.start_time);
    document.getElementById('shift-started-at').textContent = 'Started: ' + started.toLocaleString('en-PH', {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
    document.getElementById('shift-opening-cash').textContent = fmt(currentShift.opening_cash);
    const sales = getShiftSales();
    document.getElementById('shift-sales-so-far').textContent = fmt(sales);
    document.getElementById('shift-expected').textContent = fmt(currentShift.opening_cash + sales);
    document.getElementById('eod-summary').style.display = 'none';
  } else {
    banner.style.display = 'none';
  }
}

function renderEODSummary() {
  const last = shiftHistory.find(s => s.status === 'closed');
  if (!last) return;
  document.getElementById('eod-summary').style.display = 'block';
  document.getElementById('eod-sales').textContent = fmt(last.sales || 0);
  document.getElementById('eod-txcount').textContent = last.tx_count || 0;
  document.getElementById('eod-opening').textContent = fmt(last.opening_cash || 0);
  const vari = last.variance || 0;
  const variEl = document.getElementById('eod-variance');
  variEl.textContent = (vari >= 0 ? '+' : '') + fmt(vari);
  variEl.style.color = vari >= 0 ? 'var(--green)' : 'var(--red)';
  const shiftTx = transactions.filter(t => new Date(t.created_at||t.date) >= new Date(last.start_time) && new Date(t.created_at||t.date) <= new Date(last.end_time));
  const tbody = document.getElementById('eod-tx-tbody');
  tbody.innerHTML = shiftTx.map(t => {
    const its = t.items || txItems.filter(i => i.transaction_id === t.id);
    const count = its.reduce((a,i) => a+(i.quantity||i.qty||0), 0);
    const dt = new Date(t.created_at||t.date);
    return `<tr><td style="font-weight:600;color:var(--green)">${t.or_number||'OR-'+t.id}</td><td>${dt.toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'})}</td><td>${count} items</td><td>${t.cashier}</td><td style="font-weight:700">${fmt(parseFloat(t.total))}</td></tr>`;
  }).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--gray-400);padding:1rem">No transactions this shift</td></tr>';
}

function renderShiftHistory() {
  const tbody = document.getElementById('shift-history-tbody');
  if (shiftHistory.length === 0) { tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--gray-400);padding:1rem">No shift records yet</td></tr>'; return; }
  tbody.innerHTML = shiftHistory.map(s => {
    const dt = new Date(s.start_time);
    const vari = s.variance || 0;
    return `<tr>
      <td>${dt.toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'})}</td>
      <td>${s.cashier}</td>
      <td>${s.branch||''}</td>
      <td>${fmt(s.opening_cash||0)}</td>
      <td>${s.closing_cash !== undefined ? fmt(s.closing_cash) : '—'}</td>
      <td style="font-weight:600;color:var(--green)">${fmt(s.sales||0)}</td>
      <td style="font-weight:600;color:${vari>=0?'var(--green)':'var(--red)'}">${s.variance !== undefined ? (vari>=0?'+':'')+fmt(vari) : '—'}</td>
      <td><span class="badge ${s.status==='open'?'badge-green':'badge-blue'}">${s.status==='open'?'Open':'Closed'}</span></td>
    </tr>`;
  }).join('');
}

function printEOD() {
  const last = shiftHistory.find(s => s.status === 'closed');
  if (!last) { showToast('No closed shift to print','error'); return; }
  const shiftTx = transactions.filter(t => new Date(t.created_at||t.date) >= new Date(last.start_time) && new Date(t.created_at||t.date) <= new Date(last.end_time));
  const rows = shiftTx.map(t => {
    const its = t.items || txItems.filter(i => i.transaction_id === t.id);
    const count = its.reduce((a,i) => a+(i.quantity||i.qty||0), 0);
    const dt = new Date(t.created_at||t.date);
    return `<tr><td>${t.or_number||'OR-'+t.id}</td><td>${dt.toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'})}</td><td>${count} items</td><td>${t.cashier}</td><td>₱${parseFloat(t.total).toFixed(2)}</td></tr>`;
  }).join('');
  const vari = last.variance || 0;
  const startDt = new Date(last.start_time);
  const endDt = new Date(last.end_time);
  doPrint(`
    <div class="print-header"><h1>AJIVA PHARMACY</h1><p>${last.branch || 'Main Branch'}</p><p>End of Day / Z-Reading Report</p><p>${startDt.toLocaleDateString('en-PH',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p></div>
    <div class="print-summary">
      <p><strong>Cashier:</strong> ${last.cashier}</p>
      <p><strong>Shift Start:</strong> ${startDt.toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'})}</p>
      <p><strong>Shift End:</strong> ${endDt.toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'})}</p>
      <p><strong>Opening Cash:</strong> ₱${(last.opening_cash||0).toFixed(2)}</p>
      <p><strong>Total Sales:</strong> ₱${(last.sales||0).toFixed(2)}</p>
      <p><strong>No. of Transactions:</strong> ${last.tx_count||0}</p>
      <p><strong>Expected in Drawer:</strong> ₱${(last.expected_cash||0).toFixed(2)}</p>
      <p><strong>Actual Cash Counted:</strong> ₱${(last.closing_cash||0).toFixed(2)}</p>
      <p><strong>Cash Over/Short:</strong> ${vari>=0?'+':''}₱${Math.abs(vari).toFixed(2)} ${vari>=0?'(OVER)':'(SHORT)'}</p>
    </div>
    <br><table class="print-table"><thead><tr><th>OR #</th><th>Time</th><th>Items</th><th>Cashier</th><th>Total</th></tr></thead><tbody>${rows||'<tr><td colspan="5" style="text-align:center">No transactions</td></tr>'}</tbody></table>
    <div class="print-footer">AJIVA PHARMACY — EOD Report — Printed: ${new Date().toLocaleString('en-PH')}</div>`);
}




// ===== SHIFT NUMPAD HELPERS =====
function shiftNumpad(val) {
  const isClosing = document.getElementById('closing-cash-field').style.display !== 'none';
  const inputId = isClosing ? 'shift-closing' : 'shift-opening';
  const cur = parseFloat(document.getElementById(inputId).value) || 0;
  document.getElementById(inputId).value = (cur + val).toFixed(2);
  if (isClosing) calcVariance();
}
function shiftNumpadExact() {
  const isClosing = document.getElementById('closing-cash-field').style.display !== 'none';
  if (isClosing) {
    const expected = parseFloat(document.getElementById('variance-expected').textContent.replace('₱','').replace(/,/g,'')) || 0;
    document.getElementById('shift-closing').value = expected.toFixed(2);
    calcVariance();
  } else {
    document.getElementById('shift-opening').value = '0.00';
  }
}
function shiftNumpadClear() {
  const isClosing = document.getElementById('closing-cash-field').style.display !== 'none';
  const inputId = isClosing ? 'shift-closing' : 'shift-opening';
  document.getElementById(inputId).value = '';
  if (isClosing) calcVariance();
}