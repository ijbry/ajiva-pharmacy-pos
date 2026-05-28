/* ================================================
   AJIVA Pharmacy POS - plu.js
   Author: James Brian Villar
   Description: Price inquiry (PLU) lookup
================================================ */

// ===== PRICE INQUIRY / PLU =====
function renderPLU() {
  const q = (document.getElementById('plu-search').value || '').toLowerCase();
  const cat = document.getElementById('plu-cat').value;
  let f = products;
  if (q) f = f.filter(p => p.name.toLowerCase().includes(q) || (p.generic||'').toLowerCase().includes(q));
  if (cat) f = f.filter(p => (p.category||p.cat) === cat);
  document.getElementById('plu-count').textContent = f.length + ' products';
  const grid = document.getElementById('plu-grid');
  if (f.length === 0) { grid.innerHTML = '<div style="font-size:13px;color:var(--gray-400);padding:1rem">No products found.</div>'; return; }
  grid.innerHTML = f.map(p => {
    const oos = p.stock === 0;
    const low = p.stock > 0 && p.stock <= (p.low_stock_alert||10);
    return `<div onclick="showPLUDetail(${p.id})" style="background:white;border-radius:var(--radius);padding:1rem;border:1.5px solid var(--gray-200);cursor:pointer;transition:all .15s" onmouseover="this.style.borderColor='var(--green)'" onmouseout="this.style.borderColor='var(--gray-200)'">
      <div style="font-size:10px;color:var(--gray-400);font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">${p.category||p.cat}</div>
      <div style="font-size:13px;font-weight:600;margin-bottom:2px;line-height:1.3">${p.name}</div>
      ${p.generic?`<div style="font-size:11px;color:var(--gray-400);margin-bottom:6px">${p.generic}</div>`:''}
      <div style="font-size:20px;font-weight:700;color:var(--green)">${fmt(p.price)}</div>
      <div style="font-size:11px;margin-top:4px;color:${oos?'var(--red)':low?'var(--amber)':'var(--gray-400)'}">
        ${oos?'❌ Out of stock':low?'⚠ Low: '+p.stock+' left':'✓ '+p.stock+' in stock'}
      </div>
    </div>`;
  }).join('');
}

function showPLUDetail(id) {
  const p = products.find(x => x.id == id);
  if (!p) return;
  const display = document.getElementById('plu-selected-display');
  display.style.display = 'block';
  document.getElementById('plu-disp-cat').textContent = p.category||p.cat;
  document.getElementById('plu-disp-name').textContent = p.name;
  document.getElementById('plu-disp-generic').textContent = p.generic || '';
  document.getElementById('plu-disp-price').textContent = fmt(p.price);
  document.getElementById('plu-disp-stock').textContent = p.stock;
  document.getElementById('plu-disp-cat2').textContent = p.category||p.cat;
  document.getElementById('plu-disp-expiry').textContent = p.expiry_date || '—';
  const oos = p.stock === 0;
  const low = p.stock > 0 && p.stock <= (p.low_stock_alert||10);
  document.getElementById('plu-disp-status').textContent = oos ? 'Out of Stock' : low ? 'Low Stock' : 'In Stock';
  display.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function populatePLUCatFilter() {
  const sel = document.getElementById('plu-cat');
  if (!sel) return;
  const cats = [...new Set(products.map(p => p.category||p.cat))];
  sel.innerHTML = '<option value="">All Categories</option>' + cats.map(c=>`<option>${c}</option>`).join('');
}