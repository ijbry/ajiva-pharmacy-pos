/* ================================================
   AJIVA Pharmacy POS - app.js
   Author: James Brian Villar
   Description: App entry point - initialization on page load
================================================ */

// check for saved supabase credentials
window.addEventListener('load', async () => {
  const url = localStorage.getItem('ajiva_sb_url');
  const key = localStorage.getItem('ajiva_sb_key');
  if (url && key) {
    document.getElementById('sb-url').value = url;
    document.getElementById('sb-key').value = key;
    sbClient = supabase.createClient(url, key);
    dbMode = 'supabase';
    // Show a loading indicator while connecting
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('db-badge').innerHTML = '<span class="db-status local"><i class="ti ti-loader" style="font-size:13px"></i> Connecting...</span>';
    await showLoginScreen();
  }
});