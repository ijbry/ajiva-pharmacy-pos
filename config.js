/* ================================================
   AJIVA Pharmacy POS - inventory.js
   Author: James Brian Villar
   Description: Inventory management - add/edit/delete products
================================================ */

// ===== INVENTORY =====
function populateCatFilter() {
  const cats = [...new Set(products.map(p => p.category||p.cat))];
  const sel = document.getElementById('inv-cat-filter');
  sel.innerHTML = '<option value="">All Categories</option>' + cats.map(c=>`<option>${c}</option>`).join('');
}
function renderInventory(q='') {
  const cat = document.getElementById('inv-cat-filter')?.value||'';
  let f = products;
  if (q) f = f.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || (p.generic||'').toLowerCase().includes(q.toLowerCase()));
  if (cat) f = f.filter(p => (p.category||p.cat) === cat);
  const tbody = document.getElementById('inv-tbody');
  tbody.innerHTML = f.map((p, i) => {
    let st = '<span class="badge badge-green">In Stock</span>';
    if (p.stock === 0) st = '<span class="badge badge-red">Out of Stock</span>';
    else if (p.stock <= (p.low_stock_alert||10)) st = '<span class="badge badge-amber">Low Stock</span>';
    return `<tr>
      <td style="color:var(--gray-400)">${i+1}</td>
      <td><div style="font-weight:500">${p.name}</div>${p.generic?`<div style="font-size:11px;color:var(--gray-400)">${p.generic}</div>`:''}</td>
      <td>${p.category||p.cat}</td>
      <td style="font-weight:600;color:var(--green)">${fmt(p.price)}</td>
      <td style="font-weight:600;${p.stock===0?'color:var(--red)':p.stock<=(p.low_stock_alert||10)?'color:var(--amber)':''}">${p.stock}</td>
      <td>${p.low_stock_alert||10}</td>
      <td style="${p.expiry_date && new Date(p.expiry_date) < new Date() ? 'color:var(--red);font-weight:600' : ''}">${p.expiry_date||'—'}</td>
      <td>${st}</td>
      <td style="white-space:nowrap">
        <button class="action-btn edit-btn" onclick="openProductModal(${p.id})"><i class="ti ti-edit" style="font-size:12px"></i> Edit</button>
        <button class="action-btn del-btn" onclick="deleteProduct(${p.id})" style="margin-left:4px"><i class="ti ti-trash" style="font-size:12px"></i></button>
      </td>
    </tr>`;
  }).join('');
}

function openProductModal(id=null) {
  editingProdId = id;
  document.getElementById('pm-title').innerHTML = id ? '<i class="ti ti-edit" style="font-size:18px"></i> Edit Product' : '<i class="ti ti-package" style="font-size:18px"></i> Add Product';
  if (id) {
    const p = products.find(x => x.id == id);
    document.getElementById('pm-name').value = p.name;
    document.getElementById('pm-cat').value = p.category||p.cat;
    document.getElementById('pm-price').value = p.price;
    document.getElementById('pm-stock').value = p.stock;
    document.getElementById('pm-lowstock').value = p.low_stock_alert||10;
    document.getElementById('pm-expiry').value = p.expiry_date||'';
    
    document.getElementById('pm-generic').value = p.generic||'';
  } else {
    ['pm-name','pm-price','pm-stock','pm-expiry','pm-generic'].forEach(f => document.getElementById(f).value='');
    document.getElementById('pm-lowstock').value = 10;
    document.getElementById('pm-cat').value = 'Analgesics';
  }
  openModal('product-modal');
}

async function saveProduct() {
  const name = document.getElementById('pm-name').value.trim();
  const cat = document.getElementById('pm-cat').value;
  const price = parseFloat(document.getElementById('pm-price').value);
  const stock = parseInt(document.getElementById('pm-stock').value);
  const low = parseInt(document.getElementById('pm-lowstock').value)||10;
  const expiry = document.getElementById('pm-expiry').value||null;
  const generic = document.getElementById('pm-generic').value.trim();
  if (!name||isNaN(price)||isNaN(stock)) { showToast('Fill in required fields','error'); return; }
  const prod = { name, generic, category: cat, price, stock, low_stock_alert: low, expiry_date: expiry, branch_id: currentBranch?.id||null, branch_name: currentBranch?.name||null };
  if (dbMode === 'supabase') {
    const ok = await saveProductToDB(prod);
    if (!ok) { showToast('Error saving product','error'); return; }
    await loadProductsFromDB();
  } else {
    if (editingProdId) {
      const p = products.find(x => x.id == editingProdId);
      Object.assign(p, { name, generic, category: cat, price, stock, low_stock_alert: low, expiry_date: expiry });
    } else {
      products.push({ id: nextLocalId++, name, generic, category: cat, price, stock, low_stock_alert: low, expiry_date: expiry, branch_id: currentBranch?.id||null, branch_name: currentBranch?.name||null });
    }
  }
  closeModal('product-modal');
  renderInventory(); initCatTabs(); renderProducts(); renderDashboard(); populateCatFilter();
  showToast(editingProdId ? 'Product updated!' : 'Product added!', 'success');
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  if (dbMode === 'supabase') {
    const ok = await deleteProductFromDB(id);
    if (!ok) { showToast('Error deleting product','error'); return; }
    await loadProductsFromDB();
  } else {
    products = products.filter(x => x.id != id);
  }
  renderInventory(); initCatTabs(); renderProducts(); renderDashboard(); populateCatFilter();
  showToast('Product deleted','success');
}