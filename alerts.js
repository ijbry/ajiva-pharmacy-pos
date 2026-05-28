/* ================================================
   AJIVA Pharmacy POS - pos.js
   Author: James Brian Villar
   Description: Cashiering, cart, products, payment
================================================ */

// ===== PRODUCTS =====
function renderProducts() {
  const q = (document.getElementById('pos-search').value || '').toLowerCase();
  let f = products;
  if (selectedCat !== 'All') f = f.filter(p => (p.category||p.cat) === selectedCat);
  if (q) f = f.filter(p => p.name.toLowerCase().includes(q) || (p.generic||'').toLowerCase().includes(q));
  const grid = document.getElementById('products-grid');
  if (f.length === 0) { grid.innerHTML = '<div style="font-size:13px;color:var(--gray-400);padding:1rem">No products found.</div>'; return; }
  grid.innerHTML = f.map(p => {
    const oos = p.stock === 0;
    const low = p.stock > 0 && p.stock <= (p.low_stock_alert||10);
    return `<div class="product-card ${oos?'out-of-stock':''}" onclick="${oos?'':'addToCart('+p.id+')'}">
      <div class="product-cat">${p.category||p.cat}</div>
      <div class="product-name">${p.name}</div>
      ${p.generic?`<div style="font-size:11px;color:var(--gray-400);margin-bottom:3px">${p.generic}</div>`:''}
      <div class="product-price">${fmt(p.price)}</div>
      <div class="product-stock-label ${low?'low':''}">${oos?'Out of stock':low?'⚠ Low: '+p.stock:p.stock+' in stock'}</div>
    </div>`;
  }).join('');
}



// ===== CART =====
function addToCart(id) {
  const p = products.find(x => x.id == id);
  if (!p || p.stock === 0) return;
  const ex = cart.find(x => x.id == id);
  if (ex) {
    if (ex.qty >= p.stock) { showToast('Not enough stock!', 'error'); return; }
    ex.qty++;
  } else { cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 }); }
  renderCart();
}
function changeQty(id, delta) {
  const idx = cart.findIndex(x => x.id == id);
  if (idx < 0) return;
  const p = products.find(x => x.id == id);
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  else if (delta > 0 && p && cart[idx].qty > p.stock) { cart[idx].qty = p.stock; showToast('Max stock reached','error'); }
  renderCart();
}
function clearCart() { cart = []; discountAmt = 0; document.getElementById('discount-input').value = ''; renderCart(); }
function removeFromCart(id) { cart = cart.filter(x => x.id != id); renderCart(); }
function applyDiscount() { discountAmt = parseFloat(document.getElementById('discount-input').value) || 0; calcTotal(); }
function calcTotal() {
  const sub = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const dis = Math.min(discountAmt, sub);
  document.getElementById('cart-subtotal').textContent = fmt(sub);
  document.getElementById('cart-disc-show').textContent = '-' + fmt(dis);
  document.getElementById('cart-total').textContent = fmt(sub - dis);
  document.getElementById('checkout-btn').disabled = cart.length === 0;
}
function renderCart() {
  const el = document.getElementById('cart-items');
  if (cart.length === 0) {
    el.innerHTML = '<div class="cart-empty"><i class="ti ti-shopping-cart-off"></i><span>Cart is empty</span></div>';
  } else {
    el.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info"><div class="cart-item-name">${item.name}</div><div class="cart-item-price">${fmt(item.price)} each</div></div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        </div>
        <div class="cart-item-total">${fmt(item.price*item.qty)}</div>
        <button class="cart-remove" onclick="removeFromCart(${item.id})"><i class="ti ti-x"></i></button>
      </div>`).join('');
  }
  const count = cart.reduce((a, i) => a + i.qty, 0);
  document.getElementById('cart-count').textContent = count > 0 ? `(${count})` : '';
  calcTotal();
}



// ===== CASH MODAL =====
function openCashModal() {
  const sub = cart.reduce((a,i) => a + i.price*i.qty, 0);
  const total = sub - Math.min(discountAmt, sub);
  document.getElementById('cash-due').textContent = fmt(total);
  document.getElementById('cash-tendered').value = '';
  document.getElementById('cash-change').textContent = '₱0.00';
  document.getElementById('cash-change').style.color = 'var(--green)';
  document.getElementById('confirm-btn').disabled = true;
  openModal('cash-modal');
}
function numpadTap(v) {
  const cur = parseFloat(document.getElementById('cash-tendered').value) || 0;
  document.getElementById('cash-tendered').value = (cur + v).toFixed(2);
  calcChange();
}
function numpadExact() {
  const due = parseFloat(document.getElementById('cash-due').textContent.replace('₱','').replace(/,/g,'')) || 0;
  document.getElementById('cash-tendered').value = due.toFixed(2);
  calcChange();
}
function calcChange() {
  const due = parseFloat(document.getElementById('cash-due').textContent.replace('₱','').replace(/,/g,'')) || 0;
  const ten = parseFloat(document.getElementById('cash-tendered').value) || 0;
  const ch = ten - due;
  document.getElementById('cash-change').textContent = ch >= 0 ? fmt(ch) : '₱0.00';
  document.getElementById('cash-change').style.color = ch >= 0 ? 'var(--green)' : 'var(--red)';
  document.getElementById('confirm-btn').disabled = ten < due;
}

async function confirmPayment() {
  const sub = cart.reduce((a, i) => a + i.price*i.qty, 0);
  const dis = Math.min(discountAmt, sub);
  const total = sub - dis;
  const tendered = parseFloat(document.getElementById('cash-tendered').value) || 0;
  const change = tendered - total;
  document.getElementById('confirm-btn').disabled = true;
  document.getElementById('confirm-btn').innerHTML = '<div class="spinner" style="width:18px;height:18px;border-width:2px"></div>';

  if (dbMode === 'supabase') {
    const result = await saveTxToDB({ cashier: currentUser.name, subtotal: sub, discount: dis, total, tendered, change }, cart);
    if (result) {
      cart.forEach(item => { const p = products.find(x => x.id == item.id); if (p) p.stock -= item.qty; });
      transactions.unshift(result);
      currentTx = result;
      closeModal('cash-modal');
      showReceiptModal(result, cart.map(i=>({...i})));
      cart = []; discountAmt = 0;
      await loadProductsFromDB();
    } else {
      showToast('Error saving transaction', 'error');
    }
  } else {
    const orNum = 'OR-' + String(nextLocalId++).padStart(6,'0');
    const tx = { id: nextLocalId, or_number: orNum, cashier: currentUser.name, subtotal: sub, discount: dis, total, tendered, change_amount: change, branch_id: currentBranch?.id||null, branch_name: currentBranch?.name||'', date: new Date().toISOString(), created_at: new Date().toISOString(), items: cart.map(i=>({...i})) };
    cart.forEach(item => { const p = products.find(x => x.id == item.id); if (p) p.stock -= item.qty; });
    transactions.unshift(tx);
    closeModal('cash-modal');
    showReceiptModal(tx, tx.items);
    cart = []; discountAmt = 0;
  }
  document.getElementById('confirm-btn').disabled = false;
  document.getElementById('confirm-btn').innerHTML = '<i class="ti ti-check"></i> Confirm Payment';
  renderDashboard();
  renderProducts();
}



// ===== RECEIPT =====
function showReceiptModal(tx, items) {
  const dt = new Date(tx.created_at || tx.date);
  const orNum = tx.or_number || ('OR-' + String(tx.id).padStart(6,'0'));
  const dateStr = dt.toLocaleDateString('en-PH', {year:'numeric',month:'short',day:'numeric'});
  const timeStr = dt.toLocaleTimeString('en-PH', {hour:'2-digit',minute:'2-digit'});
  const itemLines = items.map(i => {
    const nm = i.name.length > 20 ? i.name.slice(0,20)+'…' : i.name;
    return `<div class="receipt-row"><span>${nm} x${i.qty}</span><span>${fmt(i.price*i.qty)}</span></div>`;
  }).join('');
  document.getElementById('receipt-body').innerHTML = `
    <div class="receipt-header"><div style="font-size:16px;font-weight:700;letter-spacing:.5px">AJIVA PHARMACY</div><div style="font-size:10.5px;margin-top:1px">Official Receipt</div></div>
    <div class="receipt-divider"></div>
    <div class="receipt-row"><span>OR #:</span><span>${orNum}</span></div>
    <div class="receipt-row"><span>Date:</span><span>${dateStr}</span></div>
    <div class="receipt-row"><span>Time:</span><span>${timeStr}</span></div>
    <div class="receipt-row"><span>Cashier:</span><span>${tx.cashier}</span></div>
    <div class="receipt-divider"></div>
    ${itemLines}
    <div class="receipt-divider"></div>
    <div class="receipt-row"><span>Subtotal:</span><span>${fmt(parseFloat(tx.subtotal))}</span></div>
    ${parseFloat(tx.discount)>0?`<div class="receipt-row"><span>Discount:</span><span>-${fmt(parseFloat(tx.discount))}</span></div>`:''}
    <div class="receipt-total-row"><span>TOTAL:</span><span>${fmt(parseFloat(tx.total))}</span></div>
    <div class="receipt-divider"></div>
    <div class="receipt-row"><span>Cash:</span><span>${fmt(parseFloat(tx.tendered||tx.tendered))}</span></div>
    <div class="receipt-row"><span>Change:</span><span>${fmt(parseFloat(tx.change_amount||tx.change||0))}</span></div>
    <div class="receipt-divider"></div>
    <div style="text-align:center;font-size:11px;margin-top:6px">Thank you for your purchase!<br>Get well soon! 💊<br><br>VAT Reg TIN: 000-000-000-000</div>`;
  openModal('receipt-modal');
  showToast('Payment successful! ' + fmt(parseFloat(tx.total)), 'success');
  currentTx = { tx, items };
}

function printReceipt() {
  const content = document.getElementById('receipt-body').innerHTML;
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (!printWindow) { showToast('Allow popups to print receipt', 'error'); return; }
  printWindow.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Receipt</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Courier New',monospace; font-size:12px; padding:12px; width:80mm; margin:0 auto; line-height:1.6; }
  .receipt-header { text-align:center; margin-bottom:8px; }
  .receipt-divider { border-bottom:1px dashed #999; margin:5px 0; }
  .receipt-row { display:flex; justify-content:space-between; }
  .receipt-total-row { display:flex; justify-content:space-between; font-weight:700; font-size:13px; }
  @media print { body { padding:0; } }
</style></head>
<body>${content}</body></html>`);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    setTimeout(() => printWindow.close(), 1000);
  }, 400);
}

function resetPOS() {
  cart = []; discountAmt = 0;
  document.getElementById('discount-input').value = '';
  renderCart(); renderProducts(); renderDashboard();
}