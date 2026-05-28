/* ================================================
   AJIVA Pharmacy POS - auth.js
   Author: James Brian Villar
   Description: Login, logout, session management
================================================ */

// ===== LOGIN =====
async function doLogin() {
  const uname = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value;
  const branchEl = document.getElementById('login-branch');
  const branchId = branchEl.value;
  const branchName = branchEl.options[branchEl.selectedIndex]?.text || '';
  const errEl = document.getElementById('login-error');

  if (!uname || !pass) { errEl.textContent = 'Please enter username and password.'; errEl.style.display='block'; return; }
  if (!branchId) { errEl.textContent = 'Please select a branch.'; errEl.style.display='block'; return; }

  // Check built-in admin
  let matchedUser = null;
  if (uname === BUILTIN_ADMIN.username && pass === BUILTIN_ADMIN.pass) {
    matchedUser = { username: BUILTIN_ADMIN.username, name: BUILTIN_ADMIN.name, role: BUILTIN_ADMIN.role };
  }

  // Check DB/local created users
  if (!matchedUser) {
    const dbUser = posUsers.find(u => u.username === uname && u.password === pass && u.is_active !== false);
    if (dbUser) {
      // Check branch restriction — if user has assigned branch, they can only log in to that branch
      if (dbUser.branch_id && String(dbUser.branch_id) !== String(branchId)) {
        errEl.textContent = 'You are not assigned to this branch. Please select your assigned branch.';
        errEl.style.display = 'block';
        return;
      }
      matchedUser = { username: dbUser.username, name: dbUser.name, role: dbUser.role, id: dbUser.id };
    }
  }

  if (matchedUser) {
    currentUser = matchedUser;
    currentBranch = { id: branchId, name: branchName };
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    document.getElementById('nav-user-label').textContent = currentUser.name + ' — ' + branchName;

    // Reset all nav items first
    ['nav-admin-section','nav-inventory','nav-reports','nav-branches',
     'nav-ops-label','nav-shift','nav-incoming','nav-alerts','nav-users','nav-refund','nav-plu'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = '';
    });

    // Hide admin-only items for cashier
    if (currentUser.role === 'cashier') {
      ['nav-admin-section','nav-inventory','nav-reports','nav-branches',
       'nav-ops-label','nav-incoming','nav-alerts','nav-users','nav-refund'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });
    }
    errEl.style.display = 'none';
    initApp();
    initMobileNav();
  } else {
    errEl.textContent = 'Invalid username or password, or account is inactive.';
    errEl.style.display = 'block';
  }
}

function doLogout() {
  currentUser = null; cart = []; discountAmt = 0; currentShift = null; products = []; transactions = []; txItems = [];
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
}