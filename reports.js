/* ================================================
   AJIVA Pharmacy POS - refund.js
   Author: James Brian Villar
   Description: Refund entry processing
================================================ */

// ===== REFUND ENTRY =====
let refunds = [];
let currentRefundTx = null;
let refundSelectedItems = [];

async function searchRefundTx() {
  const q = document.getElementById('refund-search').value.trim().toUpperCase();
  if (!q) { showToast('Enter an OR number', 'error'); return; }
  const resultEl = document.getElementById('refund-tx-result');
  resultEl.innerHTML = '<div style="font-size:13px;color:var(--gray-400);padding:8px">Searching...</div>';

  // Search in local transactions first
  let tx = transactions.find(t => (t.or_number||'').toUpperCase() === q || ('OR-'+String(t.id).padStart(6,'0')) === q);

  // If not found locally and using Supabase, fetch from DB
  if (!tx && dbMode === 'supabase') {
    const { data } = await sbClient.from('transactions').select('*').eq('or_number', q).single();
    if (data) {
      tx = data;
      // Also fetch items for this transaction
      const { data: itemData } = await sbClient.from('transaction_items').select('*').eq('transaction_id', data.id);
      if (itemData) tx.items = itemData;
      // Add to local cache
      transactions.push(tx);
    }
  }

  if (!tx) {
    resultEl.innerHTML = `<div style="background:#fee2e2;border-radius:var(--radius);padding:10px 14px;font-size:13px;color:#991b1b"><i class="ti ti-alert-circle"></i> Transaction not found. Check the OR number and make sure it belongs to this branch.</div>`;
    document.getElementById('refund-items-list').innerHTML = '<div style="font-size:13px;color:var(--gray-400);text-align:center;padding:2rem">No transaction found</div>';
    currentRefundTx = null;
    return;
  }
  if (tx.voided) {
    resultEl.innerHTML = `<div style="background:#fee2e2;border-radius:var(--radius);padding:10px 14px;font-size:13px;color:#991b1b"><i class="ti ti-ban"></i> This transaction has been voided.</div>`;
    return;
  }
  if (tx.fully_refunded) {
    resultEl.innerHTML = `<div style="background:#fef3c7;border-radius:var(--radius);padding:10px 14px;font-size:13px;color:#92400e"><i class="ti ti-alert-triangle"></i> This transaction has already been fully refunded.</div>`;
    return;
  }
  currentRefundTx = tx;
  refundSelectedItems = [];
  const orNum = tx.or_number || ('OR-'+String(tx.id).padStart(6,'0'));
  const dt = new Date(tx.created_at||tx.date);
  resultEl.innerHTML = `
    <div style="background:var(--green-light);border-radius:var(--radius);padding:10px 14px;font-size:13px;color:#155e3a;display:flex;justify-content:space-between;align-items:center">
      <div><strong>${orNum}</strong> — ${dt.toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'})} ${dt.toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'})}</div>
      <div style="font-weight:700">${fmt(parseFloat(tx.total))}</div>
    </div>`;
  // Show items
  const its = tx.items || txItems.filter(i => i.transaction_id === tx.id);
  document.getElementById('refund-items-list').innerHTML = its.map((item, idx) => {
    const name = item.product_name || item.name;
    const qty = item.quantity || item.qty || 0;
    const price = parseFloat(item.price || 0);
    const alreadyRefunded = (tx.refunded_items || {})[name] || 0;
    const availableQty = qty - alreadyRefunded;
    if (availableQty <= 0) return `<div style="padding:10px;border-radius:var(--radius);background:var(--gray-50);border:1px solid var(--gray-200);margin-bottom:6px;opacity:.5;display:flex;justify-content:space-between;align-items:center"><div><div style="font-size:13px;font-weight:500">${name}</div><div style="font-size:11px;color:var(--gray-400)">Already refunded</div></div><span class="badge badge-red">Refunded</span></div>`;
    return `<div style="padding:10px;border-radius:var(--radius);background:var(--gray-50);border:1.5px solid var(--gray-200);margin-bottom:6px;display:flex;align-items:center;gap:10px" id="refund-row-${idx}">
      <input type="checkbox" id="refund-chk-${idx}" onchange="toggleRefundItem(${idx})" style="width:16px;height:16px;cursor:pointer;accent-color:var(--green)">
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600">${name}</div>
        <div style="font-size:12px;color:var(--gray-600)">${fmt(price)} × ${availableQty} available</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        <label style="font-size:12px;color:var(--gray-600)">Qty:</label>
        <input type="number" id="refund-qty-${idx}" value="${availableQty}" min="1" max="${availableQty}" style="width:55px;padding:4px 6px;border:1.5px solid var(--gray-200);border-radius:var(--radius);font-size:13px;text-align:center;outline:none" oninput="updateRefundItem(${idx})">
      </div>
      <div style="font-weight:700;color:var(--red);min-width:60px;text-align:right" id="refund-row-total-${idx}">${fmt(price*availableQty)}</div>
    </div>`;
  }).join('');
  // Store items data globally for reference
  window._refundTxItems = its;
}

function toggleRefundItem(idx) {
  updateRefundItem(idx);
}

function updateRefundItem(idx) {
  const chk = document.getElementById(`refund-chk-${idx}`);
  const qtyEl = document.getElementById(`refund-qty-${idx}`);
  const totalEl = document.getElementById(`refund-row-total-${idx}`);
  if (!chk || !qtyEl) return;
  const item = window._refundTxItems[idx];
  const name = item.product_name || item.name;
  const price = parseFloat(item.price || 0);
  const qty = parseInt(qtyEl.value) || 1;
  const rowTotal = price * qty;
  if (totalEl) totalEl.textContent = fmt(rowTotal);
  // Update selected items
  refundSelectedItems = refundSelectedItems.filter(x => x.idx !== idx);
  if (chk.checked) refundSelectedItems.push({ idx, name, price, qty, product_id: item.product_id || item.id });
  renderRefundSummary();
}

function renderRefundSummary() {
  const summaryEl = document.getElementById('refund-summary-items');
  const totalEl = document.getElementById('refund-total');
  const countEl = document.getElementById('refund-item-count');
  const btn = document.getElementById('process-refund-btn');
  if (refundSelectedItems.length === 0) {
    summaryEl.innerHTML = '<div style="font-size:13px;color:var(--gray-400);text-align:center;padding:2rem">Select items to refund</div>';
    totalEl.textContent = '₱0.00';
    countEl.textContent = '0 items';
    btn.disabled = true;
    return;
  }
  const total = refundSelectedItems.reduce((a,i) => a + i.price*i.qty, 0);
  summaryEl.innerHTML = refundSelectedItems.map(i => `
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--gray-100);font-size:13px">
      <div><div style="font-weight:500">${i.name}</div><div style="font-size:12px;color:var(--gray-600)">${fmt(i.price)} × ${i.qty}</div></div>
      <div style="font-weight:700;color:var(--red)">${fmt(i.price*i.qty)}</div>
    </div>`).join('');
  totalEl.textContent = fmt(total);
  countEl.textContent = refundSelectedItems.length + ' item(s)';
  btn.disabled = false;
}

async function processRefund() {
  const reason = document.getElementById('refund-reason').value;
  const notes = document.getElementById('refund-notes').value;
  if (!reason) { showToast('Please select a refund reason', 'error'); return; }
  if (refundSelectedItems.length === 0) { showToast('No items selected for refund', 'error'); return; }

  const total = refundSelectedItems.reduce((a,i) => a + i.price*i.qty, 0);
  const orNum = currentRefundTx.or_number || ('OR-'+String(currentRefundTx.id).padStart(6,'0'));
  const refundOrNum = 'RF-' + String(refunds.length + 1).padStart(6,'0');

  // Mark items as refunded on original tx
  if (!currentRefundTx.refunded_items) currentRefundTx.refunded_items = {};
  refundSelectedItems.forEach(item => {
    currentRefundTx.refunded_items[item.name] = (currentRefundTx.refunded_items[item.name] || 0) + item.qty;
  });

  // Restore stock
  for (const item of refundSelectedItems) {
    const p = products.find(x => x.id == item.product_id);
    if (p) {
      p.stock += item.qty;
      if (dbMode === 'supabase') await sbClient.from('products').update({ stock: p.stock }).eq('id', p.id);
    }
  }

  // Save refund record
  const refundRecord = {
    id: nextLocalId++, or_number: refundOrNum, original_or: orNum,
    items: [...refundSelectedItems], total, reason, notes,
    cashier: currentUser?.name, branch: currentBranch?.name,
    created_at: new Date().toISOString()
  };
  refunds.unshift(refundRecord);

  // Show refund receipt
  showRefundReceipt(refundRecord);
  renderInventory(); renderDashboard();
  showToast('Refund processed! Stock restored.', 'success');

  // Reset
  refundSelectedItems = [];
  currentRefundTx = null;
  document.getElementById('refund-search').value = '';
  document.getElementById('refund-tx-result').innerHTML = '';
  document.getElementById('refund-items-list').innerHTML = '<div style="font-size:13px;color:var(--gray-400);text-align:center;padding:2rem">Search for a transaction to start a refund</div>';
  renderRefundSummary();
  document.getElementById('refund-reason').value = '';
  document.getElementById('refund-notes').value = '';
}

function showRefundReceipt(ref) {
  const dt = new Date(ref.created_at);
  const itemLines = ref.items.map(i => `<div class="receipt-row"><span>${(i.name.length>18?i.name.slice(0,18)+'…':i.name)} x${i.qty}</span><span>${fmt(i.price*i.qty)}</span></div>`).join('');
  document.getElementById('refund-receipt-body').innerHTML = `
    <div class="receipt-header">
      <div style="font-size:16px;font-weight:700">${currentBranch?.name||'AJIVA PHARMACY'}</div>
      <div style="font-size:10.5px;margin-top:1px;color:var(--red);font-weight:700">REFUND RECEIPT</div>
    </div>
    <div class="receipt-divider"></div>
    <div class="receipt-row"><span>Refund #:</span><span style="font-weight:700">${ref.or_number}</span></div>
    <div class="receipt-row"><span>Original OR:</span><span>${ref.original_or}</span></div>
    <div class="receipt-row"><span>Date:</span><span>${dt.toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'})}</span></div>
    <div class="receipt-row"><span>Time:</span><span>${dt.toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'})}</span></div>
    <div class="receipt-row"><span>Cashier:</span><span>${ref.cashier}</span></div>
    <div class="receipt-row"><span>Reason:</span><span style="font-size:11px">${ref.reason}</span></div>
    <div class="receipt-divider"></div>
    ${itemLines}
    <div class="receipt-divider"></div>
    <div class="receipt-total-row" style="color:var(--red)"><span>REFUND TOTAL:</span><span>${fmt(ref.total)}</span></div>
    <div class="receipt-divider"></div>
    <div style="text-align:center;font-size:11px;margin-top:6px">Return cash to customer: <strong>${fmt(ref.total)}</strong><br>Thank you!</div>`;
  openModal('refund-receipt-modal');
}

function printRefundReceipt() {
  const content = document.getElementById('refund-receipt-body').innerHTML;
  const pw = window.open('','_blank','width:400,height:600');
  if (!pw) { showToast('Allow popups to print','error'); return; }
  pw.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Refund Receipt</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Courier New',monospace;font-size:12px;padding:12px;width:80mm;margin:0 auto;line-height:1.6}.receipt-header{text-align:center;margin-bottom:8px}.receipt-divider{border-bottom:1px dashed #999;margin:5px 0}.receipt-row{display:flex;justify-content:space-between}.receipt-total-row{display:flex;justify-content:space-between;font-weight:700;font-size:13px;color:red}</style>
  </head><body>${content}</body></html>`);
  pw.document.close(); pw.focus();
  setTimeout(() => { pw.print(); setTimeout(() => pw.close(), 1000); }, 400);
}