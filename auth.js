/* ================================================
   AJIVA Pharmacy POS - database.js
   Author: James Brian Villar
   Description: Supabase DB operations - load/save/delete
================================================ */

// ===== DB OPERATIONS =====
async function loadBranchesFromDB() {
  const { data, error } = await sbClient.from('branches').select('*').order('created_at');
  if (!error && data) {
    if (data.length === 0) {
      await sbClient.from('branches').insert([{ name:'AJIVA Main Branch', code:'MAIN', address:'', is_active:true }]);
      await loadBranchesFromDB();
      return;
    }
    branches = data;
    populateBranchDropdown();
    renderBranches();
  }
}

function populateBranchDropdown() {
  const sel = document.getElementById('login-branch');
  const active = branches.filter(b => b.is_active !== false);
  sel.innerHTML = '<option value="">-- Select Branch --</option>' + active.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
}

function renderBranches() {
  const grid = document.getElementById('branches-grid');
  if (!grid) return;
  if (branches.length === 0) { grid.innerHTML = '<div style="font-size:13px;color:var(--gray-400)">No branches yet.</div>'; return; }
  grid.innerHTML = branches.map(b => {
    const txCount = transactions.filter(t => String(t.branch_id) === String(b.id) || t.branch_name === b.name).length;
    const revenue = transactions.filter(t => String(t.branch_id) === String(b.id) || t.branch_name === b.name).reduce((a,t)=>a+parseFloat(t.total||0),0);
    return `<div style="background:white;border-radius:var(--radius-lg);padding:1.25rem;border:1px solid var(--gray-200);position:relative">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.75rem">
        <div style="width:42px;height:42px;background:var(--green-light);border-radius:var(--radius);display:flex;align-items:center;justify-content:center;border:1.5px solid var(--green)">
          <i class="ti ti-building-store" style="font-size:20px;color:var(--green)"></i>
        </div>
        <div style="display:flex;gap:6px">
          <button class="action-btn edit-btn" onclick="openBranchModal(${b.id})"><i class="ti ti-edit" style="font-size:12px"></i></button>
          <button class="action-btn del-btn" onclick="deleteBranch(${b.id})"><i class="ti ti-trash" style="font-size:12px"></i></button>
        </div>
      </div>
      <div style="font-size:15px;font-weight:700;color:var(--gray-800);margin-bottom:2px">${b.name}</div>
      <div style="font-size:12px;color:var(--gray-400);margin-bottom:8px">${b.address||'No address set'}</div>
      <div style="display:flex;gap:8px">
        <span class="badge badge-green">${b.code}</span>
        <span class="badge ${b.is_active!==false?'badge-green':'badge-red'}">${b.is_active!==false?'Active':'Inactive'}</span>
      </div>
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--gray-100);display:flex;justify-content:space-between;font-size:12px;color:var(--gray-600)">
        <span><i class="ti ti-receipt" style="font-size:13px"></i> ${txCount} transactions</span>
        <span style="font-weight:700;color:var(--green)">${fmt(revenue)}</span>
      </div>
    </div>`;
  }).join('');
}

function updateBranchPreview(val) {
  document.getElementById('branch-preview').textContent = 'AJIVA ' + (val||'');
  document.getElementById('bm-code').value = val.toUpperCase().replace(/\s+/g,'').substring(0,6);
}

function openBranchModal(id=null) {
  editingBranchId = id;
  document.getElementById('bm-title').innerHTML = id ? '<i class="ti ti-edit" style="font-size:18px"></i> Edit Branch' : '<i class="ti ti-building-store" style="font-size:18px"></i> Add Branch';
  if (id) {
    const b = branches.find(x => x.id == id);
    const suffix = b.name.replace('AJIVA ','');
    document.getElementById('bm-suffix').value = suffix;
    document.getElementById('bm-code').value = b.code;
    document.getElementById('bm-address').value = b.address||'';
    document.getElementById('branch-preview').textContent = b.name;
  } else {
    document.getElementById('bm-suffix').value = '';
    document.getElementById('bm-code').value = '';
    document.getElementById('bm-address').value = '';
    document.getElementById('branch-preview').textContent = 'AJIVA ';
  }
  openModal('branch-modal');
}

async function saveBranch() {
  const suffix = document.getElementById('bm-suffix').value.trim();
  const code = document.getElementById('bm-code').value.trim().toUpperCase();
  const address = document.getElementById('bm-address').value.trim();
  if (!suffix || !code) { showToast('Branch name and code are required','error'); return; }
  const fullName = 'AJIVA ' + suffix;
  const branchData = { name: fullName, code, address, is_active: true };
  if (dbMode === 'supabase') {
    if (editingBranchId) {
      await sbClient.from('branches').update(branchData).eq('id', editingBranchId);
    } else {
      await sbClient.from('branches').insert([branchData]);
    }
    await loadBranchesFromDB();
  } else {
    if (editingBranchId) {
      const b = branches.find(x => x.id == editingBranchId);
      Object.assign(b, branchData);
    } else {
      branches.push({ id: String(nextLocalId++), ...branchData });
    }
    localStorage.setItem('ajiva_branches', JSON.stringify(branches));
    populateBranchDropdown();
    renderBranches();
  }
  closeModal('branch-modal');
  showToast(editingBranchId ? 'Branch updated!' : 'Branch added!', 'success');
}

async function deleteBranch(id) {
  if (!confirm('Delete this branch?')) return;
  if (dbMode === 'supabase') {
    await sbClient.from('branches').delete().eq('id', id);
    await loadBranchesFromDB();
  } else {
    branches = branches.filter(x => x.id != id);
    localStorage.setItem('ajiva_branches', JSON.stringify(branches));
    populateBranchDropdown();
    renderBranches();
  }
  showToast('Branch deleted','success');
}

async function loadProductsFromDB() {
  // Always clear products first — each branch is independent
  products = [];
  const { data, error } = await sbClient
    .from('products')
    .select('*')
    .eq('branch_id', currentBranch.id)
    .order('name');
  if (!error && data) {
    products = data;
  }
  // If this is a brand new branch with no products yet, stay empty — 
  // admin will add products manually for this branch
}

async function seedSampleData() {
  const clean = SAMPLE_PRODUCTS.map(p => ({ name:p.name, generic:p.generic, category:p.category, price:p.price, stock:p.stock, low_stock_alert:p.low_stock_alert, expiry_date:p.expiry_date||null, branch_id: currentBranch?.id||null, branch_name: currentBranch?.name||null }));
  const { data } = await sbClient.from('products').insert(clean).select();
  if (data) products = data;
}

async function loadTransactionsFromDB() {
  // Load only transactions for current branch
  let txQuery = sbClient.from('transactions').select('*').order('created_at', { ascending:false }).limit(500);
  if (currentBranch?.id) {
    txQuery = txQuery.eq('branch_id', currentBranch.id);
  }
  const { data: txData } = await txQuery;
  if (txData) transactions = txData;

  // Load transaction items only for these transactions
  if (txData && txData.length > 0) {
    const txIds = txData.map(t => t.id);
    const { data: itemData } = await sbClient.from('transaction_items').select('*').in('transaction_id', txIds);
    if (itemData) txItems = itemData;
  } else {
    txItems = [];
  }
}

async function saveProductToDB(prod) {
  if (editingProdId) {
    const { error } = await sbClient.from('products').update(prod).eq('id', editingProdId);
    return !error;
  } else {
    const { error } = await sbClient.from('products').insert([prod]);
    return !error;
  }
}

async function deleteProductFromDB(id) {
  const { error } = await sbClient.from('products').delete().eq('id', id);
  return !error;
}

async function saveTxToDB(tx, items) {
  const orNum = 'OR-' + String(Date.now()).slice(-6).padStart(6, '0');
  const txRow = { 
    or_number: orNum, 
    cashier: tx.cashier, 
    subtotal: parseFloat(tx.subtotal.toFixed(2)), 
    discount: parseFloat(tx.discount.toFixed(2)), 
    total: parseFloat(tx.total.toFixed(2)), 
    tendered: parseFloat(tx.tendered.toFixed(2)), 
    change_amount: parseFloat(tx.change.toFixed(2)), 
    branch_id: currentBranch?.id ? parseInt(currentBranch.id) : null, 
    branch_name: currentBranch?.name||''
  };
  const { data: txResult, error } = await sbClient.from('transactions').insert([txRow]).select().single();
  if (error) { 
    console.error('TX Save Error:', error); 
    showToast('DB Error: ' + (error.message||error.code||'Unknown'), 'error'); 
    return null; 
  }
  if (!txResult) return null;
  const itemRows = items.map(i => ({ transaction_id: txResult.id, product_id: i.id, product_name: i.name, price: i.price, quantity: i.qty, subtotal: i.price * i.qty }));
  await sbClient.from('transaction_items').insert(itemRows);
  for (const i of items) {
    const p = products.find(x => x.id === i.id);
    if (p) await sbClient.from('products').update({ stock: p.stock - i.qty }).eq('id', p.id);
  }
  return { ...txResult, items: itemRows };
}