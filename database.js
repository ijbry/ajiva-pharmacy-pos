/* ================================================
   AJIVA Pharmacy POS - users.js
   Author: James Brian Villar
   Description: User management - cashier accounts
================================================ */

// ===== USER MANAGEMENT =====
let posUsers = [];
let editingUserId = null;
let changingPassUserId = null;

// Default built-in users (fallback if no DB)
const DEFAULT_USERS = [
  { id:'builtin-admin', name:'Admin', username:'admin', password:'admin123', role:'admin', branch_id:'', branch_name:'All Branches', is_active:true, is_default:true },
];

async function loadUsersFromDB() {
  if (dbMode !== 'supabase') {
    posUsers = JSON.parse(localStorage.getItem('ajiva_users') || '[]');
    return;
  }
  const { data, error } = await sbClient.from('pos_users').select('*').order('created_at');
  if (!error && data) posUsers = data;
}

function saveUsersLocal() {
  localStorage.setItem('ajiva_users', JSON.stringify(posUsers));
}

function renderUsers() {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;
  const allUsers = [...DEFAULT_USERS, ...posUsers];
  const active = posUsers.filter(u => u.is_active !== false).length;
  const inactive = posUsers.filter(u => u.is_active === false).length;
  if (document.getElementById('usr-total')) document.getElementById('usr-total').textContent = allUsers.length;
  if (document.getElementById('usr-active')) document.getElementById('usr-active').textContent = active + DEFAULT_USERS.length;
  if (document.getElementById('usr-inactive')) document.getElementById('usr-inactive').textContent = inactive;

  tbody.innerHTML = allUsers.map((u, i) => {
    const isDefault = u.is_default;
    return `<tr>
      <td style="color:var(--gray-400)">${i+1}</td>
      <td>
        <div style="font-weight:600">${u.name}</div>
        ${isDefault ? '<div style="font-size:11px;color:var(--blue)">Built-in account</div>' : ''}
      </td>
      <td><code style="background:var(--gray-100);padding:2px 8px;border-radius:4px;font-size:12px">${u.username}</code></td>
      <td><span class="badge ${u.role==='admin'?'badge-blue':'badge-green'}">${u.role==='admin'?'Admin':'Cashier'}</span></td>
      <td>${u.branch_name||'All Branches'}</td>
      <td><span class="badge ${u.is_active!==false?'badge-green':'badge-red'}">${u.is_active!==false?'Active':'Inactive'}</span></td>
      <td style="white-space:nowrap">
        ${!isDefault ? `
          <button class="action-btn edit-btn" onclick="openUserModal('${u.id}')"><i class="ti ti-edit" style="font-size:12px"></i> Edit</button>
          <button class="action-btn" style="border-color:var(--amber);color:var(--amber);background:white;margin-left:4px" onclick="openChangePass('${u.id}')"><i class="ti ti-key" style="font-size:12px"></i> Password</button>
          <button class="action-btn del-btn" onclick="deleteUser('${u.id}')" style="margin-left:4px"><i class="ti ti-trash" style="font-size:12px"></i></button>
        ` : '<span style="font-size:11px;color:var(--gray-400)">Protected</span>'}
      </td>
    </tr>`;
  }).join('');
}

function openUserModal(id=null) {
  editingUserId = id;
  // Populate branch dropdown
  const branchSel = document.getElementById('um-branch');
  branchSel.innerHTML = '<option value="">-- Select Branch --</option>' + branches.map(b=>`<option value="${b.id}">${b.name}</option>`).join('');
  document.getElementById('um-title').innerHTML = id
    ? '<i class="ti ti-user-edit" style="font-size:18px"></i> Edit User'
    : '<i class="ti ti-user-plus" style="font-size:18px"></i> Add User';
  document.getElementById('um-error').style.display = 'none';
  if (id) {
    const u = posUsers.find(x => String(x.id) === String(id));
    if (!u) return;
    document.getElementById('um-name').value = u.name;
    document.getElementById('um-username').value = u.username;
    document.getElementById('um-role').value = u.role;
    document.getElementById('um-branch').value = u.branch_id || '';
    document.getElementById('um-status').value = String(u.is_active !== false);
    document.getElementById('um-password').value = '';
    document.getElementById('um-confirm').value = '';
    document.getElementById('um-pass-label').textContent = 'New Password (leave blank to keep)';
  } else {
    ['um-name','um-username','um-password','um-confirm'].forEach(f => document.getElementById(f).value='');
    document.getElementById('um-role').value = 'cashier';
    document.getElementById('um-branch').value = '';
    document.getElementById('um-status').value = 'true';
    document.getElementById('um-pass-label').textContent = 'Password *';
  }
  openModal('user-modal');
}

async function saveUser() {
  const name = document.getElementById('um-name').value.trim();
  const username = document.getElementById('um-username').value.trim().toLowerCase();
  const role = document.getElementById('um-role').value;
  const branchId = document.getElementById('um-branch').value;
  const branchName = document.getElementById('um-branch').options[document.getElementById('um-branch').selectedIndex]?.text || '';
  const password = document.getElementById('um-password').value;
  const confirm = document.getElementById('um-confirm').value;
  const isActive = document.getElementById('um-status').value === 'true';
  const errEl = document.getElementById('um-error');

  if (!name || !username) { errEl.textContent = 'Name and username are required.'; errEl.style.display='block'; return; }
  if (!editingUserId && !password) { errEl.textContent = 'Password is required.'; errEl.style.display='block'; return; }
  if (password && password !== confirm) { errEl.textContent = 'Passwords do not match.'; errEl.style.display='block'; return; }
  if (password && password.length < 6) { errEl.textContent = 'Password must be at least 6 characters.'; errEl.style.display='block'; return; }

  // Check duplicate username
  const duplicate = posUsers.find(u => u.username === username && String(u.id) !== String(editingUserId));
  if (duplicate || username === 'admin') {
    errEl.textContent = 'Username already exists.'; errEl.style.display='block'; return;
  }

  errEl.style.display = 'none';
  const userData = { name, username, role, branch_id: branchId||null, branch_name: branchId ? branchName : 'All Branches', is_active: isActive };
  if (password) userData.password = password;

  if (dbMode === 'supabase') {
    if (editingUserId) {
      const { error } = await sbClient.from('pos_users').update(userData).eq('id', editingUserId);
      if (error) { errEl.textContent = 'Error: ' + error.message; errEl.style.display='block'; return; }
    } else {
      const { error } = await sbClient.from('pos_users').insert([userData]);
      if (error) { errEl.textContent = 'Error: ' + error.message; errEl.style.display='block'; return; }
    }
    await loadUsersFromDB();
  } else {
    if (editingUserId) {
      const u = posUsers.find(x => String(x.id) === String(editingUserId));
      Object.assign(u, userData);
    } else {
      posUsers.push({ id: String(nextLocalId++), ...userData });
    }
    saveUsersLocal();
  }
  closeModal('user-modal');
  renderUsers();
  showToast(editingUserId ? 'User updated!' : 'User created!', 'success');
}

async function deleteUser(id) {
  if (!confirm('Delete this user account?')) return;
  if (dbMode === 'supabase') {
    await sbClient.from('pos_users').delete().eq('id', id);
    await loadUsersFromDB();
  } else {
    posUsers = posUsers.filter(u => String(u.id) !== String(id));
    saveUsersLocal();
  }
  renderUsers();
  showToast('User deleted', 'success');
}

function openChangePass(id) {
  changingPassUserId = id;
  const u = posUsers.find(x => String(x.id) === String(id));
  if (!u) return;
  document.getElementById('cp-username-label').textContent = u.username;
  document.getElementById('cp-new').value = '';
  document.getElementById('cp-confirm').value = '';
  document.getElementById('cp-error').style.display = 'none';
  openModal('change-pass-modal');
}

async function confirmChangePass() {
  const newPass = document.getElementById('cp-new').value;
  const confirm = document.getElementById('cp-confirm').value;
  const errEl = document.getElementById('cp-error');
  if (!newPass) { errEl.textContent = 'Please enter a new password.'; errEl.style.display='block'; return; }
  if (newPass.length < 6) { errEl.textContent = 'Password must be at least 6 characters.'; errEl.style.display='block'; return; }
  if (newPass !== confirm) { errEl.textContent = 'Passwords do not match.'; errEl.style.display='block'; return; }
  errEl.style.display = 'none';
  if (dbMode === 'supabase') {
    await sbClient.from('pos_users').update({ password: newPass }).eq('id', changingPassUserId);
    await loadUsersFromDB();
  } else {
    const u = posUsers.find(x => String(x.id) === String(changingPassUserId));
    if (u) u.password = newPass;
    saveUsersLocal();
  }
  closeModal('change-pass-modal');
  showToast('Password changed successfully!', 'success');
}

function togglePassVis(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i class="ti ti-eye-off"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i class="ti ti-eye"></i>';
  }
}