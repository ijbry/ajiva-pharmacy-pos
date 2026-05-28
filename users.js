/* ================================================
   AJIVA Pharmacy POS - Main Stylesheet
   Author: James Brian Villar
   Description: Base styles, layout, components
================================================ */

*{box-sizing:border-box;margin:0;padding:0}
:root{
  --green:#1a7a4a;--green-light:#e8f5ee;--green-mid:#2d9e60;--green-dark:#0f5132;
  --white:#fff;--gray-50:#f8fafc;--gray-100:#f1f5f9;--gray-200:#e2e8f0;
  --gray-400:#94a3b8;--gray-600:#475569;--gray-800:#1e293b;
  --red:#dc2626;--amber:#d97706;--blue:#2563eb;
  --radius:8px;--radius-lg:12px;
}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#f0f4f8;color:var(--gray-800);min-height:100vh;display:flex;flex-direction:column}

/* ===== SUPABASE SETUP SCREEN ===== */
#setup-screen{display:flex;align-items:center;justify-content:center;min-height:100vh;background:linear-gradient(135deg,#0f5132 0%,#1a7a4a 60%,#2d9e60 100%);padding:1rem}
.setup-card{background:white;border-radius:16px;padding:2rem;width:100%;max-width:560px;box-shadow:0 20px 60px rgba(0,0,0,0.25)}
.setup-logo{text-align:center;margin-bottom:1.5rem}
.setup-logo .logo-icon{width:56px;height:56px;background:var(--green-light);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 0.5rem;border:2px solid var(--green)}
.setup-logo h1{font-size:20px;font-weight:700;color:var(--green)}
.setup-logo p{font-size:12px;color:var(--gray-600);margin-top:2px}
.steps-list{margin-bottom:1.5rem}
.step-item{display:flex;gap:10px;padding:10px;border-radius:var(--radius);margin-bottom:6px;background:var(--gray-50);border:1px solid var(--gray-200)}
.step-num{width:22px;height:22px;min-width:22px;border-radius:50%;background:var(--green);color:white;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center}
.step-text{font-size:12px;color:var(--gray-600);line-height:1.5}
.step-text strong{color:var(--gray-800);display:block;margin-bottom:2px}
.step-text code{background:var(--gray-100);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:11px;color:var(--green-dark);word-break:break-all}
.setup-divider{border:none;border-top:1px solid var(--gray-200);margin:1.25rem 0}
.setup-field{margin-bottom:0.875rem}
.setup-field label{display:block;font-size:12px;font-weight:600;color:var(--gray-600);margin-bottom:5px}
.setup-field input{width:100%;padding:9px 12px;border:1.5px solid var(--gray-200);border-radius:var(--radius);font-size:13px;outline:none;font-family:monospace;color:var(--gray-800)}
.setup-field input:focus{border-color:var(--green)}
.setup-btn{width:100%;padding:12px;background:var(--green);color:white;border:none;border-radius:var(--radius);font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px}
.setup-btn:hover{background:#155e3a}
.setup-skip{width:100%;padding:9px;background:none;color:var(--gray-600);border:1.5px solid var(--gray-200);border-radius:var(--radius);font-size:13px;cursor:pointer;margin-top:6px}
.setup-skip:hover{border-color:var(--gray-400)}
.setup-error{color:var(--red);font-size:12px;margin-top:6px;display:none}
.sql-box{background:#1e293b;border-radius:var(--radius);padding:10px 12px;margin-top:6px;font-family:monospace;font-size:10.5px;color:#7dd3a8;line-height:1.6;white-space:pre-wrap;word-break:break-all;max-height:120px;overflow-y:auto}
.copy-sql-btn{margin-top:6px;padding:5px 10px;background:var(--gray-100);border:1px solid var(--gray-200);border-radius:var(--radius);font-size:11px;cursor:pointer;display:flex;align-items:center;gap:4px;color:var(--gray-600)}
.copy-sql-btn:hover{background:var(--green-light);color:var(--green)}
.db-status{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;padding:4px 10px;border-radius:20px;margin-bottom:1rem}
.db-status.online{background:#d1fae5;color:#065f46}
.db-status.offline{background:#fee2e2;color:#991b1b}
.db-status.local{background:#fef3c7;color:#92400e}

/* ===== LOGIN ===== */
#login-screen{display:none;align-items:center;justify-content:center;min-height:100vh;background:linear-gradient(135deg,#0f5132 0%,#1a7a4a 50%,#2d9e60 100%)}
.login-card{background:white;border-radius:16px;padding:2.5rem;width:380px;box-shadow:0 20px 60px rgba(0,0,0,0.2)}
.login-logo{text-align:center;margin-bottom:2rem}
.login-logo .logo-icon{width:64px;height:64px;background:var(--green-light);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 0.75rem;border:2px solid var(--green)}
.login-logo h1{font-size:22px;font-weight:700;color:var(--green)}
.login-logo p{font-size:13px;color:var(--gray-600);margin-top:2px}
.login-field{margin-bottom:1rem}
.login-field label{display:block;font-size:13px;font-weight:500;color:var(--gray-600);margin-bottom:6px}
.login-field input,.login-field select{width:100%;padding:10px 12px;border:1.5px solid var(--gray-200);border-radius:var(--radius);font-size:14px;color:var(--gray-800);outline:none;transition:border .2s}
.login-field input:focus{border-color:var(--green)}
.login-btn{width:100%;padding:12px;background:var(--green);color:white;border:none;border-radius:var(--radius);font-size:15px;font-weight:600;cursor:pointer}
.login-btn:hover{background:#155e3a}
.login-error{color:var(--red);font-size:13px;text-align:center;margin-top:.5rem;display:none}
.db-badge{text-align:center;margin-bottom:1rem}

/* ===== APP SHELL ===== */
#app{display:none;flex-direction:column;min-height:100vh}
.topnav{background:var(--green);color:white;padding:0 1.25rem;height:52px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
.topnav-brand{display:flex;align-items:center;gap:8px;font-weight:700;font-size:16px}
.topnav-right{display:flex;align-items:center;gap:1rem}
.topnav-user{font-size:13px;opacity:.9}
.nav-logout{background:rgba(255,255,255,0.15);border:none;color:white;padding:5px 12px;border-radius:var(--radius);font-size:13px;cursor:pointer;display:flex;align-items:center;gap:5px}
.nav-logout:hover{background:rgba(255,255,255,0.25)}
.app-body{display:flex;flex:1}
.sidebar{width:200px;background:white;border-right:1px solid var(--gray-200);padding:1rem 0;display:flex;flex-direction:column;gap:2px;flex-shrink:0}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 1rem;font-size:14px;color:var(--gray-600);cursor:pointer;transition:all .15s;border-left:3px solid transparent}
.nav-item i{font-size:18px}
.nav-item:hover{background:var(--green-light);color:var(--green)}
.nav-item.active{background:var(--green-light);color:var(--green);font-weight:600;border-left-color:var(--green)}
.nav-section-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--gray-400);padding:.75rem 1rem .25rem}
.main-content{flex:1;overflow:auto;padding:1.25rem;background:#f0f4f8;min-width:0}
.screen{display:none}
.screen.active{display:block}

/* ===== DASHBOARD ===== */
.page-header{margin-bottom:1.25rem}
.page-header h2{font-size:18px;font-weight:600}
.page-header p{font-size:13px;color:var(--gray-600);margin-top:2px}
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:1.25rem}
.stat-card{background:white;border-radius:var(--radius-lg);padding:1rem 1.25rem;border:1px solid var(--gray-200)}
.stat-label{font-size:12px;color:var(--gray-600);font-weight:500;margin-bottom:4px;display:flex;align-items:center;gap:5px}
.stat-value{font-size:24px;font-weight:700}
.stat-sub{font-size:12px;color:var(--gray-400);margin-top:2px}
.stat-green .stat-value{color:var(--green)}
.stat-amber .stat-value{color:var(--amber)}
.stat-red .stat-value{color:var(--red)}
.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.dash-card{background:white;border-radius:var(--radius-lg);padding:1.25rem;border:1px solid var(--gray-200)}
.dash-card h3{font-size:14px;font-weight:600;margin-bottom:1rem;display:flex;align-items:center;gap:6px}
.transaction-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--gray-100);font-size:13px}
.transaction-row:last-child{border-bottom:none}
.tx-amount{font-weight:600;color:var(--green)}
.low-stock-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--gray-100);font-size:13px}
.low-stock-row:last-child{border-bottom:none}
.badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600}
.badge-red{background:#fee2e2;color:#b91c1c}
.badge-amber{background:#fef3c7;color:#92400e}
.badge-green{background:var(--green-light);color:#155e3a}
.badge-blue{background:#dbeafe;color:#1e40af}

/* ===== POS ===== */
.pos-layout{display:grid;grid-template-columns:1fr 380px;gap:12px;height:calc(100vh - 52px - 2.5rem)}
.pos-left{display:flex;flex-direction:column;gap:10px;overflow:hidden}
.pos-search-bar{background:white;border-radius:var(--radius-lg);padding:.75rem 1rem;border:1px solid var(--gray-200);display:flex;align-items:center;gap:8px}
.pos-search-bar i{color:var(--gray-400);font-size:20px}
.pos-search-bar input{flex:1;border:none;outline:none;font-size:14px}
.pos-search-bar input::placeholder{color:var(--gray-400)}
.cat-tabs{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}
.cat-tabs::-webkit-scrollbar{display:none}
.cat-tab{padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;border:1.5px solid var(--gray-200);background:white;cursor:pointer;white-space:nowrap;color:var(--gray-600);transition:all .15s}
.cat-tab:hover{border-color:var(--green);color:var(--green)}
.cat-tab.active{background:var(--green);border-color:var(--green);color:white}
.products-grid{flex:1;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:8px;align-content:start}
.product-card{background:white;border-radius:var(--radius);padding:.75rem;border:1.5px solid var(--gray-200);cursor:pointer;transition:all .15s}
.product-card:hover{border-color:var(--green);box-shadow:0 2px 8px rgba(26,122,74,0.1)}
.product-card.out-of-stock{opacity:.5;cursor:not-allowed}
.product-cat{font-size:10px;color:var(--gray-400);font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px}
.product-name{font-size:13px;font-weight:600;margin-bottom:2px;line-height:1.3}
.product-price{font-size:14px;font-weight:700;color:var(--green)}
.product-stock-label{font-size:11px;color:var(--gray-400);margin-top:2px}
.product-stock-label.low{color:var(--amber)}
.pos-right{background:white;border-radius:var(--radius-lg);border:1px solid var(--gray-200);display:flex;flex-direction:column;overflow:hidden}
.cart-header{padding:1rem;border-bottom:1px solid var(--gray-200);display:flex;align-items:center;justify-content:space-between}
.cart-header h3{font-size:14px;font-weight:600;display:flex;align-items:center;gap:6px}
.cart-clear{background:none;border:none;color:var(--gray-400);font-size:12px;cursor:pointer;display:flex;align-items:center;gap:4px}
.cart-clear:hover{color:var(--red)}
.cart-items{flex:1;overflow-y:auto;padding:.5rem}
.cart-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--gray-400);font-size:13px;gap:8px}
.cart-empty i{font-size:36px}
.cart-item{display:flex;align-items:center;gap:8px;padding:8px;border-radius:var(--radius);margin-bottom:4px;background:var(--gray-50);border:1px solid var(--gray-100)}
.cart-item-info{flex:1;min-width:0}
.cart-item-name{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cart-item-price{font-size:12px;color:var(--gray-600)}
.cart-qty{display:flex;align-items:center;gap:4px}
.qty-btn{width:22px;height:22px;border-radius:50%;border:1.5px solid var(--gray-200);background:white;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--gray-600);font-weight:700;line-height:1}
.qty-btn:hover{border-color:var(--green);color:var(--green)}
.qty-num{font-size:13px;font-weight:600;min-width:20px;text-align:center}
.cart-item-total{font-size:13px;font-weight:700;color:var(--green);min-width:55px;text-align:right}
.cart-remove{background:none;border:none;color:var(--gray-300);cursor:pointer;font-size:16px;line-height:1}
.cart-remove:hover{color:var(--red)}
.cart-footer{padding:1rem;border-top:1px solid var(--gray-200)}
.summary-row{display:flex;justify-content:space-between;font-size:13px;color:var(--gray-600);margin-bottom:6px}
.summary-row.total{font-size:16px;font-weight:700;color:var(--gray-800);border-top:1px solid var(--gray-200);padding-top:8px;margin-top:8px}
.discount-row{display:flex;gap:6px;margin-bottom:10px}
.discount-row input{flex:1;padding:7px 10px;border:1.5px solid var(--gray-200);border-radius:var(--radius);font-size:13px;outline:none}
.discount-row input:focus{border-color:var(--green)}
.checkout-btn{width:100%;padding:13px;background:var(--green);color:white;border:none;border-radius:var(--radius);font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:background .2s}
.checkout-btn:hover{background:#155e3a}
.checkout-btn:disabled{background:var(--gray-200);color:var(--gray-400);cursor:not-allowed}

/* ===== INVENTORY ===== */
.toolbar{display:flex;align-items:center;gap:8px;margin-bottom:1rem;flex-wrap:wrap}
.search-input-wrap{position:relative}
.search-input-wrap i{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--gray-400);font-size:16px}
.search-input-wrap input{width:220px;padding:8px 10px 8px 32px;border:1.5px solid var(--gray-200);border-radius:var(--radius);font-size:13px;outline:none}
.search-input-wrap input:focus{border-color:var(--green)}
.btn-primary{padding:8px 14px;background:var(--green);color:white;border:none;border-radius:var(--radius);font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:5px}
.btn-primary:hover{background:#155e3a}
.btn-secondary{padding:8px 14px;background:white;color:var(--gray-600);border:1.5px solid var(--gray-200);border-radius:var(--radius);font-size:13px;cursor:pointer;display:flex;align-items:center;gap:5px}
.btn-secondary:hover{border-color:var(--green);color:var(--green)}
.btn-print{padding:8px 14px;background:#1d4ed8;color:white;border:none;border-radius:var(--radius);font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:5px}
.btn-print:hover{background:#1e40af}
.data-table{width:100%;border-collapse:collapse;background:white;border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--gray-200)}
.data-table th{background:var(--gray-50);padding:10px 14px;text-align:left;font-size:12px;font-weight:700;color:var(--gray-600);border-bottom:1px solid var(--gray-200);text-transform:uppercase;letter-spacing:.5px}
.data-table td{padding:10px 14px;font-size:13px;border-bottom:1px solid var(--gray-100)}
.data-table tr:last-child td{border-bottom:none}
.data-table tr:hover td{background:var(--gray-50)}
.action-btn{padding:4px 10px;border-radius:var(--radius);font-size:12px;cursor:pointer;border:1.5px solid;display:inline-flex;align-items:center;gap:4px}
.edit-btn{border-color:var(--blue);color:var(--blue);background:white}
.edit-btn:hover{background:#eff6ff}
.del-btn{border-color:var(--red);color:var(--red);background:white}
.del-btn:hover{background:#fee2e2}

/* ===== REPORTS ===== */
.report-tabs{display:flex;gap:6px;margin-bottom:1.25rem;border-bottom:2px solid var(--gray-200);padding-bottom:0}
.report-tab{padding:8px 16px;font-size:13px;font-weight:600;color:var(--gray-600);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .15s}
.report-tab:hover{color:var(--green)}
.report-tab.active{color:var(--green);border-bottom-color:var(--green)}
.report-section{display:none}
.report-section.active{display:block}
.report-card{background:white;border-radius:var(--radius-lg);padding:1.25rem;border:1px solid var(--gray-200);margin-bottom:12px}
.report-card h3{font-size:14px;font-weight:600;margin-bottom:1rem;display:flex;align-items:center;gap:6px}
.bar-chart{display:flex;align-items:flex-end;gap:5px;height:140px;padding-bottom:24px;position:relative}
.bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;height:100%;position:relative}
.bar{width:100%;background:var(--green);border-radius:4px 4px 0 0;min-height:2px;position:relative;transition:height .4s}
.bar-label{font-size:10px;color:var(--gray-400);position:absolute;bottom:-20px;white-space:nowrap}
.bar-val{font-size:9px;font-weight:600;color:var(--green);margin-bottom:2px;white-space:nowrap}
.progress-bar-bg{background:var(--gray-100);border-radius:20px;height:6px;overflow:hidden;margin-top:3px}
.progress-bar-fill{background:var(--green);height:100%;border-radius:20px}
.date-filter{display:flex;gap:8px;align-items:center;margin-bottom:1rem;flex-wrap:wrap}
.date-filter select,.date-filter input{padding:7px 10px;border:1.5px solid var(--gray-200);border-radius:var(--radius);font-size:13px;outline:none}
.date-filter select:focus,.date-filter input:focus{border-color:var(--green)}
.report-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}

/* ===== MODAL ===== */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:none;align-items:center;justify-content:center;z-index:1000;padding:1rem}
.modal-overlay.open{display:flex!important}
.modal{background:white;border-radius:var(--radius-lg);padding:1.5rem;width:440px;max-height:92vh;overflow-y:auto;position:relative}
.modal h3{font-size:16px;font-weight:700;margin-bottom:1.25rem;display:flex;align-items:center;gap:8px}
.modal-close{position:absolute;top:1rem;right:1rem;background:none;border:none;cursor:pointer;font-size:20px;color:var(--gray-400)}
.modal-close:hover{color:var(--gray-800)}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.form-field{margin-bottom:.875rem}
.form-field label{display:block;font-size:12px;font-weight:600;color:var(--gray-600);margin-bottom:5px}
.form-field input,.form-field select,.form-field textarea{width:100%;padding:8px 10px;border:1.5px solid var(--gray-200);border-radius:var(--radius);font-size:13px;outline:none}
.form-field input:focus,.form-field select:focus{border-color:var(--green)}
.modal-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:1.25rem;padding-top:1rem;border-top:1px solid var(--gray-100)}

/* ===== CASH MODAL ===== */
.cash-display{background:var(--green-light);border-radius:var(--radius);padding:1rem;text-align:center;margin-bottom:1rem}
.cash-display .label{font-size:12px;color:var(--gray-600);margin-bottom:2px}
.cash-display .amount{font-size:28px;font-weight:700;color:var(--green)}
.numpad{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:1rem}
.numpad-btn{padding:12px;background:var(--gray-50);border:1.5px solid var(--gray-200);border-radius:var(--radius);font-size:15px;font-weight:600;cursor:pointer;transition:all .1s}
.numpad-btn:hover{background:var(--green-light);border-color:var(--green)}
.numpad-btn:active{transform:scale(0.96)}
.change-display{background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:var(--radius);padding:.75rem 1rem;display:flex;justify-content:space-between;font-size:14px;font-weight:600;margin-bottom:1rem}
.change-val{font-size:18px;font-weight:700;color:var(--green)}

/* ===== RECEIPT ===== */
.receipt{font-family:'Courier New',monospace;font-size:12.5px;line-height:1.65;padding:1rem;border:1px dashed var(--gray-300);border-radius:var(--radius);background:var(--gray-50)}
.receipt-header{text-align:center;margin-bottom:.75rem}
.receipt-divider{border-bottom:1px dashed var(--gray-400);margin:5px 0}
.receipt-row{display:flex;justify-content:space-between}
.receipt-total-row{display:flex;justify-content:space-between;font-weight:700;font-size:13.5px}

/* ===== TOAST ===== */
.toast{position:fixed;bottom:1.5rem;right:1.5rem;background:var(--gray-800);color:white;padding:10px 16px;border-radius:var(--radius);font-size:13px;font-weight:500;z-index:9999;opacity:0;transform:translateY(8px);transition:all .3s;pointer-events:none;display:flex;align-items:center;gap:8px}
.toast.show{opacity:1;transform:translateY(0)}
.toast.success{background:#166534}
.toast.error{background:#991b1b}

/* ===== PRINT STYLES ===== */