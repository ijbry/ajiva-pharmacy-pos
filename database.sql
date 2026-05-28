/* ================================================
   AJIVA Pharmacy POS - Print Styles
   Author: James Brian Villar
   Description: Styles for printing reports/receipts
================================================ */

@media print{
  body *{visibility:hidden}
  #print-area,#print-area *{visibility:visible}
  #print-area{position:fixed;inset:0;padding:20px;background:white}
  .no-print{display:none!important}
  .print-header{text-align:center;margin-bottom:16px;border-bottom:2px solid #000;padding-bottom:12px}
  .print-header h1{font-size:20px;font-weight:700}
  .print-header p{font-size:12px;color:#555;margin-top:3px}
  .print-table{width:100%;border-collapse:collapse;font-size:12px}
  .print-table th{background:#f0f0f0!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;padding:7px 10px;text-align:left;border:1px solid #ccc;font-weight:700}
  .print-table td{padding:6px 10px;border:1px solid #ccc}
  .print-summary{margin-top:16px;padding:12px;background:#f9f9f9!important;-webkit-print-color-adjust:exact;border:1px solid #ccc}
  .print-summary p{font-size:13px;margin-bottom:4px}
  .print-footer{text-align:center;margin-top:20px;font-size:11px;color:#777;border-top:1px solid #ccc;padding-top:10px}
}

/* loading spinner */
.spinner{width:36px;height:36px;border:3px solid var(--green-light);border-top-color:var(--green);border-radius:50%;animation:spin .7s linear infinite;margin:0 auto}
@keyframes spin{to{transform:rotate(360deg)}}