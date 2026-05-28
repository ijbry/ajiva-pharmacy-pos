/* ================================================
   AJIVA Pharmacy POS - Mobile Responsive
   Author: James Brian Villar
   Description: Responsive styles for mobile/tablet
================================================ */

/* ===== MOBILE RESPONSIVE ===== */
.hamburger-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 6px;
  border-radius: var(--radius);
  font-size: 22px;
  line-height: 1;
}
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 98;
}
.sidebar-overlay.open { display: block; }

@media (max-width: 768px) {
  /* TOPNAV */
  .topnav { padding: 0 .75rem; height: 48px; }
  .topnav-brand { font-size: 14px; }
  .topnav-brand i { font-size: 18px; }
  .topnav-user { display: none; }
  .hamburger-btn { display: flex; align-items: center; justify-content: center; }
  .nav-logout span { display: none; }

  /* SIDEBAR */
  .sidebar {
    position: fixed;
    left: -220px;
    top: 48px;
    bottom: 0;
    width: 220px;
    z-index: 99;
    transition: left .25s ease;
    box-shadow: 4px 0 20px rgba(0,0,0,0.15);
    overflow-y: auto;
  }
  .sidebar.open { left: 0; }

  /* MAIN CONTENT */
  .app-body { flex-direction: column; }
  .main-content { padding: .75rem; }

  /* DASHBOARD */
  .stat-grid { grid-template-columns: 1fr 1fr !important; gap: 8px; }
  .stat-value { font-size: 20px !important; }
  .dash-grid { grid-template-columns: 1fr !important; }

  /* POS LAYOUT */
  .pos-layout {
    grid-template-columns: 1fr !important;
    height: auto !important;
    gap: 8px;
  }
  .pos-left { height: auto; overflow: visible; }
  .products-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    max-height: 40vh;
    overflow-y: auto;
  }
  .pos-right {
    border-radius: var(--radius-lg);
    max-height: 60vh;
  }

  /* INVENTORY TABLE - make scrollable */
  .data-table { font-size: 12px; }
  .data-table th, .data-table td { padding: 7px 8px; }
  #screen-inventory .toolbar { flex-wrap: wrap; }
  #screen-inventory .search-input-wrap input { width: 160px; }
  .screen { overflow-x: auto; }

  /* REPORTS */
  .report-grid { grid-template-columns: 1fr !important; }
  .stat-grid[style*="grid-template-columns:repeat(3"] { grid-template-columns: 1fr 1fr !important; }
  .report-tabs { overflow-x: auto; white-space: nowrap; padding-bottom: 4px; }
  .date-filter { flex-wrap: wrap; gap: 6px; }
  .date-filter input, .date-filter select { font-size: 12px; padding: 6px 8px; }

  /* MODALS */
  .modal { width: 95vw !important; max-width: 95vw !important; padding: 1.25rem; }
  .form-row { grid-template-columns: 1fr !important; gap: 0; }

  /* POS RIGHT PANEL on mobile - make it a bottom sheet feel */
  .cart-footer { padding: .75rem; }
  .checkout-btn { padding: 11px; font-size: 14px; }

  /* BRANCHES GRID */
  #branches-grid { grid-template-columns: 1fr !important; }

  /* REFUND */
  #screen-refund > div { grid-template-columns: 1fr !important; height: auto !important; }

  /* PAGE HEADER */
  .page-header h2 { font-size: 16px; }
  .page-header > div { flex-direction: column; gap: 8px; align-items: flex-start !important; }

  /* SHIFT SCREEN */
  #active-shift-banner > div { flex-direction: column; }
  #active-shift-banner > div > div:last-child { flex-wrap: wrap; gap: 12px; }

  /* USER MANAGEMENT */
  .data-table td:nth-child(5),
  .data-table th:nth-child(5) { display: none; }

  /* HIDE LESS IMPORTANT COLUMNS ON MOBILE */
  #inv-tbody td:nth-child(6),
  #inv-table th:nth-child(6) { display: none; }

  /* NUMPAD */
  .numpad-btn { padding: 10px 6px; font-size: 14px; }

  /* BOTTOM NAV for mobile - quick access */
  .mobile-bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid var(--gray-200);
    z-index: 90;
    padding: 6px 0 calc(6px + env(safe-area-inset-bottom));
  }
  .mobile-bottom-nav button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--gray-400);
    font-size: 10px;
    font-weight: 600;
    padding: 4px 2px;
  }
  .mobile-bottom-nav button i { font-size: 20px; }
  .mobile-bottom-nav button.active { color: var(--green); }
  .main-content { padding-bottom: 70px !important; }
  .pos-layout { padding-bottom: 0; }
}

@media (max-width: 480px) {
  .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .stat-grid { grid-template-columns: 1fr 1fr !important; }
  .topnav-brand { font-size: 13px; }
  .product-name { font-size: 12px; }
  .product-price { font-size: 13px; }
}