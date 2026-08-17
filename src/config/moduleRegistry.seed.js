// moduleRegistry.seed.js
// Auto-generated seed data for ModuleConfig collection.
// Confirmed against live navigation — moduleKey values are real URL-derived paths, not guesses.
// formFields left empty for pageType 'master'/'document' entries where no live form data was captured —
// populate from the real MasterPage.jsx / modal fields already in the app, do NOT invent field lists.

const moduleRegistrySeed = [
  {
    "moduleKey": "dashboard/dashboard",
    "section": "Dashboard",
    "label": "Dashboard",
    "pageType": "special",
    "collectionName": "dashboard",
    "columns": [],
    "formFields": [],
    "buttons": [],
    "permissions": [
      "dashboard"
    ]
  },
  {
    "moduleKey": "inventory/inventory/barcodeitem",
    "section": "Inventory",
    "label": "Barcode Item",
    "pageType": "special",
    "icon": "ScanBarcode",
    "collectionName": "barcodes",
    "columns": [],
    "formFields": [],
    "buttons": [],
    "permissions": [
      "inventory"
    ]
  },
  {
    "moduleKey": "settings/setting/business",
    "section": "Settings",
    "label": "Business Masters",
    "pageType": "master",
    "collectionName": "businessMasters",
    "columns": [
      {
        "key": "businessName",
        "label": "Business Name",
        "type": "text"
      },
      {
        "key": "zipCode",
        "label": "Zip Code",
        "type": "text"
      },
      {
        "key": "state",
        "label": "State",
        "type": "text"
      },
      {
        "key": "city",
        "label": "City",
        "type": "text"
      },
      {
        "key": "isActive",
        "label": "Is Active",
        "type": "text"
      }
    ],
    "formFields": [
      { "key": "businessName", "label": "Name", "type": "text", "required": true },
      { "key": "businessPrintName", "label": "Business Print Name", "type": "text", "required": true, "placeholder": "Short Name" },
      { "key": "landmark", "label": "Landmark", "type": "text" },
      { "key": "city", "label": "City", "type": "select", "required": true, "placeholder": "Select City" },
      { "key": "state", "label": "State", "type": "text", "disabled": true },
      { "key": "country", "label": "Country", "type": "text", "disabled": true },
      { "key": "zipCode", "label": "Zip Code", "type": "text", "required": true },
      { "key": "addressLine1", "label": "Address line 1", "type": "text" },
      { "key": "addressLine2", "label": "Address line 2", "type": "text" },
      { "key": "mobile", "label": "Mobile", "type": "text" },
      { "key": "alternateContactNumber", "label": "Alternate Contact Number", "type": "text" },
      { "key": "email", "label": "Email", "type": "email" },
      { "key": "websiteUrl", "label": "Website URL", "type": "text" },
      { "key": "gstin", "label": "GSTIN", "type": "text", "required": true, "placeholder": "ex: 27ABCDE1234F1Z5" },
      { "key": "isActive", "label": "Is Active", "type": "select", "required": true, "options": ["Active", "Inactive"], "default": "Active" },
      { "key": "currency", "label": "Currency", "type": "select", "required": true, "options": ["INR", "USD", "EUR", "GBP", "AED"] },
      { "key": "timezone", "label": "Timezone", "type": "select", "required": true, "options": ["Asia/Kolkata", "Asia/Dubai", "UTC", "America/New_York", "Europe/London"] }
    ],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "Upload Logo"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/companylocations",
    "section": "Settings",
    "label": "Company Locations",
    "pageType": "master",
    "collectionName": "companyLocations",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "landmark",
        "label": "Landmark",
        "type": "text"
      },
      {
        "key": "zipCode",
        "label": "Zip Code",
        "type": "text"
      },
      {
        "key": "state",
        "label": "State",
        "type": "text"
      },
      {
        "key": "city",
        "label": "City",
        "type": "text"
      },
      {
        "key": "business",
        "label": "Business",
        "type": "text"
      }
    ],
    "formFields": [
      { "key": "name", "label": "Name", "type": "text", "required": true },
      { "key": "businessPrintName", "label": "Business Print Name", "type": "text", "placeholder": "Short Name" },
      { "key": "landmark", "label": "Landmark", "type": "text" },
      { "key": "city", "label": "City", "type": "select", "required": true, "placeholder": "Select City" },
      { "key": "state", "label": "State", "type": "text", "disabled": true },
      { "key": "country", "label": "Country", "type": "text", "disabled": true },
      { "key": "zipCode", "label": "Zip Code", "type": "text", "required": true },
      { "key": "addressLine1", "label": "Address line 1", "type": "text" },
      { "key": "addressLine2", "label": "Address line 2", "type": "text" },
      { "key": "mobile", "label": "Mobile", "type": "text" },
      { "key": "alternateContactNumber", "label": "Alternate Contact Number", "type": "text" },
      { "key": "email", "label": "Email", "type": "email" },
      { "key": "websiteUrl", "label": "Website URL", "type": "text" },
      { "key": "gstin", "label": "GSTIN", "type": "text", "placeholder": "ex: 27ABCDE1234F1Z5" },
      { "key": "termsConditions", "label": "Terms & Conditions", "type": "textarea" }
    ],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/ledgergroups",
    "section": "Settings",
    "label": "Ledger Group",
    "pageType": "master",
    "collectionName": "ledgerGroup",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "isActive",
        "label": "Is Active",
        "type": "text"
      },
      {
        "key": "parent",
        "label": "Parent",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/ledger",
    "section": "Settings",
    "label": "Ledger",
    "pageType": "master",
    "collectionName": "ledger",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "group",
        "label": "Group",
        "type": "text"
      },
      {
        "key": "isActive",
        "label": "Is Active",
        "type": "text"
      },
      {
        "key": "default",
        "label": "Default",
        "type": "text"
      },
      {
        "key": "balance",
        "label": "Balance",
        "type": "text"
      },
      {
        "key": "openingBalance",
        "label": "Opening Balance",
        "type": "text"
      }
    ],
    "formFields": [
      { "key": "name", "label": "Name", "type": "text", "required": true },
      { "key": "ledgerGroup", "label": "Ledger Group", "type": "select", "required": true, "refModule": "ledgergroups" },
      { "key": "isActive", "label": "Is Active", "type": "select", "required": true, "options": ["Active", "Inactive"], "default": "Active" },
      { "key": "default", "label": "Default", "type": "select", "required": true, "options": ["Yes", "No"], "default": "No" },
      { "key": "openingBalance", "label": "Opening Balance", "type": "number", "required": true, "default": 0 },
      { "key": "gstNo", "label": "GST No.", "type": "text", "placeholder": "ex: 27ABCDE1234F1Z5" },
      { "key": "addressLine1", "label": "Address line 1", "type": "text" },
      { "key": "addressLine2", "label": "Address line 2", "type": "text" },
      { "key": "addressLine3", "label": "Address line 3", "type": "text" },
      { "key": "zipCode", "label": "Zip Code", "type": "text" },
      { "key": "mobile", "label": "Mobile", "type": "text" },
      { "key": "alternateContactNumber", "label": "Alternate Contact Number", "type": "text" },
      { "key": "landline", "label": "Landline", "type": "text" },
      { "key": "fax", "label": "Fax", "type": "text" },
      { "key": "email", "label": "Email", "type": "email" },
      { "key": "email2", "label": "Email 2", "type": "email" },
      { "key": "websiteUrl", "label": "Website URL", "type": "text" },
      { "key": "city", "label": "City", "type": "select", "placeholder": "Select City" },
      { "key": "state", "label": "State", "type": "text", "disabled": true },
      { "key": "country", "label": "Country", "type": "text", "disabled": true },
      { "key": "contactPerson", "label": "Contact Person", "type": "text" },
      { "key": "contactPersonMobile", "label": "Contact Person Mobile", "type": "text" }
    ],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/ledgergroupmapping",
    "section": "Settings",
    "label": "Ledger Mapping",
    "pageType": "master",
    "collectionName": "ledgerMapping",
    "columns": [
      {
        "key": "purpose",
        "label": "Purpose",
        "type": "text"
      },
      {
        "key": "ledgerGroup",
        "label": "Ledger Group",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/ledgersetting",
    "section": "Settings",
    "label": "Ledger Setting",
    "pageType": "master",
    "collectionName": "ledgerSetting",
    "columns": [
      {
        "key": "purpose",
        "label": "Purpose",
        "type": "text"
      },
      {
        "key": "ledger",
        "label": "Ledger",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/voucher-setting",
    "section": "Settings",
    "label": "Voucher Settings",
    "pageType": "config",
    "collectionName": "voucherSettings",
    "columns": [],
    "formFields": [],
    "buttons": [
      "Submit"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/docsetup",
    "section": "Settings",
    "label": "Doc Setup",
    "pageType": "master",
    "collectionName": "docSetup",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "type",
        "label": "Type",
        "type": "text"
      },
      {
        "key": "prefix",
        "label": "Prefix",
        "type": "text"
      },
      {
        "key": "suffix",
        "label": "Suffix",
        "type": "text"
      },
      {
        "key": "startFrom",
        "label": "Start From",
        "type": "text"
      },
      {
        "key": "validity",
        "label": "Validity",
        "type": "text"
      },
      {
        "key": "finYear",
        "label": "Fin Year",
        "type": "text"
      }
    ],
    "formFields": [
      { "key": "documentName", "label": "Document Name", "type": "text", "required": true },
      { "key": "documentType", "label": "Document Type", "type": "select", "required": true, "options": ["Sales Invoice", "Purchase Invoice", "Sales Return", "Purchase Return", "Receipt Voucher", "Payment Voucher", "Contra Voucher", "Quotation", "Delivery Challan"] },
      { "key": "description", "label": "Description", "type": "text" },
      { "key": "prefix", "label": "Prefix", "type": "text", "required": true, "helpText": "Prefix Short Code: [MMM]=Short Month, [YY]=Short Year, [YYYY]=Year, [FYY]=Short Year-Year, [FYYYY]=Year-Year" },
      { "key": "suffix", "label": "Suffix", "type": "text" },
      { "key": "autoNumberLength", "label": "Auto Number Length", "type": "number", "required": true, "default": 0 },
      { "key": "startFrom", "label": "Start From", "type": "text", "required": true },
      { "key": "sample", "label": "Sample", "type": "text", "required": true, "disabled": true, "helpText": "Maximum 16 characters are allowed" },
      { "key": "validity", "label": "Validity", "type": "select", "required": true, "options": ["Current Financial Year", "All Financial Years"] },
      { "key": "finYear", "label": "Financial Year", "type": "text", "disabled": true }
    ],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/purchasegroup",
    "section": "Settings",
    "label": "Purchase Group Master",
    "pageType": "master",
    "collectionName": "purchaseGroupMaster",
    "columns": [
      {
        "key": "groupName",
        "label": "Group Name",
        "type": "text"
      },
      {
        "key": "business",
        "label": "Business",
        "type": "text"
      },
      {
        "key": "status",
        "label": "Status",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/goodstype",
    "section": "Settings",
    "label": "Goods Type Master",
    "pageType": "master",
    "collectionName": "goodsTypeMaster",
    "columns": [
      {
        "key": "goodsName",
        "label": "Goods Name",
        "type": "text"
      },
      {
        "key": "business",
        "label": "Business",
        "type": "text"
      },
      {
        "key": "status",
        "label": "Status",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/stockpoint",
    "section": "Settings",
    "label": "Stock Point Master",
    "pageType": "master",
    "collectionName": "stockPointMaster",
    "columns": [
      {
        "key": "stockpointName",
        "label": "Stockpoint Name",
        "type": "text"
      },
      {
        "key": "typeName",
        "label": "Type Name",
        "type": "text"
      },
      {
        "key": "status",
        "label": "Status",
        "type": "text"
      },
      {
        "key": "parent",
        "label": "Parent",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/poscounter",
    "section": "Settings",
    "label": "Pos Counter Master",
    "pageType": "master",
    "collectionName": "posCounterMaster",
    "columns": [
      {
        "key": "counterName",
        "label": "Counter Name",
        "type": "text"
      },
      {
        "key": "invoiceLayout",
        "label": "Invoice Layout",
        "type": "text"
      },
      {
        "key": "isActive",
        "label": "Is Active",
        "type": "text"
      },
      {
        "key": "repeatInvoice",
        "label": "Repeat Invoice",
        "type": "text"
      },
      {
        "key": "business",
        "label": "Business",
        "type": "text"
      },
      {
        "key": "location",
        "label": "Location",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/barcodesetting",
    "section": "Settings",
    "label": "Barcode Settings",
    "pageType": "master",
    "collectionName": "barcodeSettings",
    "columns": [
      {
        "key": "type",
        "label": "Type",
        "type": "text"
      },
      {
        "key": "subType",
        "label": "Sub Type",
        "type": "text"
      },
      {
        "key": "prefix",
        "label": "Prefix",
        "type": "text"
      },
      {
        "key": "suffix",
        "label": "Suffix",
        "type": "text"
      },
      {
        "key": "startNumber",
        "label": "Start Number",
        "type": "text"
      },
      {
        "key": "numberLength",
        "label": "Number Length",
        "type": "text"
      },
      {
        "key": "sampleBarcode",
        "label": "Sample Barcode",
        "type": "text"
      },
      {
        "key": "effectiveDate",
        "label": "Effective Date",
        "type": "text"
      },
      {
        "key": "expiryDate",
        "label": "Expiry Date",
        "type": "text"
      },
      {
        "key": "financialYear",
        "label": "Financial Year",
        "type": "text"
      }
    ],
    "formFields": [
      {
        "key": "type",
        "label": "Barcode Type",
        "type": "select",
        "options": ["Periodic", "Sequential"],
        "required": true
      },
      {
        "key": "subType",
        "label": "Barcode Sub Type",
        "type": "select",
        "options": ["Yearly", "Quarterly", "Monthly"],
        "required": true
      },
      {
        "key": "prefix",
        "label": "Prefix",
        "type": "text"
      },
      {
        "key": "suffix",
        "label": "Suffix",
        "type": "text"
      },
      {
        "key": "startNumber",
        "label": "Start Number",
        "type": "number",
        "required": true
      },
      {
        "key": "numberLength",
        "label": "Number Length",
        "type": "number",
        "required": true
      },
      {
        "key": "sampleBarcode",
        "label": "Sample Barcode",
        "type": "text",
        "required": true
      },
      {
        "key": "effectiveDate",
        "label": "Effective Date",
        "type": "date",
        "required": true
      },
      {
        "key": "expiryDate",
        "label": "Expiry Date",
        "type": "date",
        "required": true
      },
      {
        "key": "financialYear",
        "label": "Financial Year",
        "type": "text"
      }
    ],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/split-barcode-setting",
    "section": "Settings",
    "label": "Split Barcode Settings",
    "pageType": "master",
    "collectionName": "splitBarcodeSettings",
    "columns": [
      {
        "key": "useFor",
        "label": "Use For",
        "type": "text"
      },
      {
        "key": "prefix",
        "label": "Prefix",
        "type": "text"
      },
      {
        "key": "suffix",
        "label": "Suffix",
        "type": "text"
      },
      {
        "key": "startNumber",
        "label": "Start Number",
        "type": "text"
      },
      {
        "key": "sampleBarcode",
        "label": "Sample Barcode",
        "type": "text"
      },
      {
        "key": "effectiveDate",
        "label": "Effective Date",
        "type": "text"
      },
      {
        "key": "expiryDate",
        "label": "Expiry Date",
        "type": "text"
      },
      {
        "key": "financialYear",
        "label": "Financial Year",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/barcode-label-setting",
    "section": "Settings",
    "label": "Barcode Label Settings",
    "pageType": "master",
    "collectionName": "barcodeLabelSettings",
    "columns": [
      {
        "key": "choice",
        "label": "Choice",
        "type": "text"
      },
      {
        "key": "default",
        "label": "Default",
        "type": "text"
      },
      {
        "key": "labelName",
        "label": "Label Name",
        "type": "text"
      },
      {
        "key": "description",
        "label": "Description",
        "type": "text"
      },
      {
        "key": "pageSizeWidthXHeight",
        "label": "Page Size\n(width x height)",
        "type": "text"
      },
      {
        "key": "labelSizeWidthXHeight",
        "label": "Label Size\n(width x height)",
        "type": "text"
      },
      {
        "key": "stickerInRow",
        "label": "Sticker In Row",
        "type": "text"
      },
      {
        "key": "preview",
        "label": "Preview",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/procurementtype",
    "section": "Settings",
    "label": "Procurement Type Master",
    "pageType": "master",
    "collectionName": "procurementTypeMaster",
    "columns": [
      {
        "key": "procurementType",
        "label": "Procurement Type",
        "type": "text"
      },
      {
        "key": "status",
        "label": "Status",
        "type": "text"
      },
      {
        "key": "business",
        "label": "Business",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/paymentmethod",
    "section": "Settings",
    "label": "Payment Method Master",
    "pageType": "master",
    "collectionName": "paymentMethodMaster",
    "columns": [
      {
        "key": "methodName",
        "label": "Method Name",
        "type": "text"
      },
      {
        "key": "isActive",
        "label": "Is Active",
        "type": "text"
      },
      {
        "key": "isDefault",
        "label": "Is Default",
        "type": "text"
      },
      {
        "key": "isCash",
        "label": "Is Cash",
        "type": "text"
      },
      {
        "key": "isLoyalty",
        "label": "Is Loyalty",
        "type": "text"
      },
      {
        "key": "ledgerName",
        "label": "Ledger Name",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/tax",
    "section": "Settings",
    "label": "Tax Master",
    "pageType": "master",
    "collectionName": "taxMaster",
    "columns": [
      {
        "key": "taxName",
        "label": "Tax Name",
        "type": "text"
      },
      {
        "key": "igst",
        "label": "IGST",
        "type": "text"
      },
      {
        "key": "cgst",
        "label": "CGST",
        "type": "text"
      },
      {
        "key": "sgst",
        "label": "SGST",
        "type": "text"
      },
      {
        "key": "cess",
        "label": "CESS",
        "type": "text"
      },
      {
        "key": "status",
        "label": "Status",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/hsn",
    "section": "Settings",
    "label": "HSN Master",
    "pageType": "master",
    "collectionName": "hsnMaster",
    "columns": [
      {
        "key": "code",
        "label": "Code",
        "type": "text"
      },
      {
        "key": "effectiveDate",
        "label": "Effective Date",
        "type": "text"
      },
      {
        "key": "status",
        "label": "Status",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/purchase/master/charge",
    "section": "Settings",
    "label": "Purchase Charge Master",
    "pageType": "master",
    "collectionName": "purchaseChargeMaster",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "type",
        "label": "Type",
        "type": "text"
      },
      {
        "key": "status",
        "label": "Status",
        "type": "text"
      },
      {
        "key": "gstPosition",
        "label": "GST Position",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/purchase/master/term",
    "section": "Settings",
    "label": "Purchase Term Master",
    "pageType": "master",
    "collectionName": "purchaseTermMaster",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/purchase_setting",
    "section": "Settings",
    "label": "Purchase Setting",
    "pageType": "config",
    "collectionName": "purchaseSetting",
    "columns": [],
    "formFields": [],
    "buttons": [
      "Submit"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/sales/master/charge",
    "section": "Settings",
    "label": "Sales Charge Master",
    "pageType": "master",
    "collectionName": "salesChargeMaster",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "type",
        "label": "Type",
        "type": "text"
      },
      {
        "key": "status",
        "label": "Status",
        "type": "text"
      },
      {
        "key": "business",
        "label": "Business",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/sales/master/term",
    "section": "Settings",
    "label": "Sales Term Master",
    "pageType": "master",
    "collectionName": "salesTermMaster",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/loyaltypoint",
    "section": "Settings",
    "label": "Loyalty Point",
    "pageType": "config",
    "collectionName": "loyaltyPoint",
    "columns": [],
    "formFields": [],
    "buttons": [
      "Submit"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/login-security",
    "section": "Settings",
    "label": "Login Security",
    "pageType": "config",
    "collectionName": "loginSecurity",
    "columns": [],
    "formFields": [],
    "buttons": [
      "Submit"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/pos_setting",
    "section": "Settings",
    "label": "Pos Settings",
    "pageType": "config",
    "collectionName": "posSettings",
    "columns": [],
    "formFields": [],
    "buttons": [
      "Submit"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/ecom_setting",
    "section": "Settings",
    "label": "Ecom Settings",
    "pageType": "config",
    "collectionName": "ecomSettings",
    "columns": [],
    "formFields": [],
    "buttons": [
      "Submit"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/invoice-layout-setting",
    "section": "Settings",
    "label": "Invoice Layout Setting",
    "pageType": "master",
    "collectionName": "invoiceLayoutSetting",
    "columns": [
      {
        "key": "choice",
        "label": "Choice",
        "type": "text"
      },
      {
        "key": "default",
        "label": "Default",
        "type": "text"
      },
      {
        "key": "layoutName",
        "label": "Layout Name",
        "type": "text"
      },
      {
        "key": "description",
        "label": "Description",
        "type": "text"
      },
      {
        "key": "preview",
        "label": "Preview",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/location-setting",
    "section": "Settings",
    "label": "General Setting Location",
    "pageType": "config",
    "collectionName": "generalSettingLocation",
    "columns": [],
    "formFields": [],
    "buttons": [
      "Submit"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/business-contact",
    "section": "Settings",
    "label": "Business Contact",
    "pageType": "master",
    "collectionName": "businessContact",
    "columns": [
      {
        "key": "business",
        "label": "Business",
        "type": "text"
      },
      {
        "key": "contact",
        "label": "Contact",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/branches",
    "section": "Settings",
    "label": "Branches",
    "pageType": "master",
    "collectionName": "branches",
    "columns": [
      { "key": "branchName", "label": "Branch Name", "type": "text" },
      { "key": "branchCode", "label": "Branch Code", "type": "text" },
      { "key": "branchManager", "label": "Branch Manager", "type": "text" },
      { "key": "phone", "label": "Phone", "type": "text" },
      { "key": "email", "label": "Email", "type": "text" },
      { "key": "address", "label": "Address", "type": "textarea" },
      { "key": "city", "label": "City", "type": "text" },
      { "key": "state", "label": "State", "type": "text" },
      { "key": "zipCode", "label": "Zip Code", "type": "text" },
      { "key": "country", "label": "Country", "type": "text" },
      { "key": "locationType", "label": "Location Type", "type": "text" },
      { "key": "region", "label": "Region", "type": "text" },
      { "key": "businessUnit", "label": "Business Unit", "type": "text" },
      { "key": "department", "label": "Department", "type": "text" },
      { "key": "costCenter", "label": "Cost Center", "type": "text" },
      { "key": "openingDate", "label": "Opening Date", "type": "date" },
      { "key": "status", "label": "Status", "type": "text" },
      { "key": "notes", "label": "Notes", "type": "textarea" },
      { "key": "createdBy", "label": "Created By", "type": "text" },
      { "key": "createdAt", "label": "Created At", "type": "date" }
    ],
    "formFields": [
      { "key": "branchName", "label": "Branch Name", "type": "text", "required": true },
      { "key": "branchCode", "label": "Branch Code", "type": "text", "required": true },
      { "key": "branchManager", "label": "Branch Manager", "type": "text" },
      { "key": "phone", "label": "Phone", "type": "text" },
      { "key": "email", "label": "Email", "type": "text" },
      { "key": "address", "label": "Address", "type": "textarea" },
      { "key": "city", "label": "City", "type": "text" },
      { "key": "state", "label": "State", "type": "text" },
      { "key": "zipCode", "label": "Zip Code", "type": "text" },
      { "key": "country", "label": "Country", "type": "text" },
      { "key": "locationType", "label": "Location Type", "type": "text" },
      { "key": "region", "label": "Region", "type": "text" },
      { "key": "businessUnit", "label": "Business Unit", "type": "text" },
      { "key": "department", "label": "Department", "type": "text" },
      { "key": "costCenter", "label": "Cost Center", "type": "text" },
      { "key": "openingDate", "label": "Opening Date", "type": "date" },
      { "key": "status", "label": "Status", "type": "select", "options": ["active", "inactive"] },
      { "key": "notes", "label": "Notes", "type": "textarea" },
      { "key": "createdBy", "label": "Created By", "type": "text" },
      { "key": "createdAt", "label": "Created At", "type": "date" }
    ],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/departments",
    "section": "Settings",
    "label": "Departments",
    "pageType": "master",
    "collectionName": "departments",
    "columns": [
      { "key": "departmentName", "label": "Department Name", "type": "text" },
      { "key": "departmentCode", "label": "Department Code", "type": "text" },
      { "key": "headOfDepartment", "label": "Head of Department", "type": "text" },
      { "key": "phone", "label": "Phone", "type": "text" },
      { "key": "email", "label": "Email", "type": "text" },
      { "key": "location", "label": "Location", "type": "text" },
      { "key": "branch", "label": "Branch", "type": "text" },
      { "key": "status", "label": "Status", "type": "text" },
      { "key": "costCenter", "label": "Cost Center", "type": "text" },
      { "key": "manager", "label": "Manager", "type": "text" },
      { "key": "employeeCount", "label": "Employee Count", "type": "number" },
      { "key": "budgetCode", "label": "Budget Code", "type": "text" },
      { "key": "description", "label": "Description", "type": "textarea" },
      { "key": "createdBy", "label": "Created By", "type": "text" },
      { "key": "createdAt", "label": "Created At", "type": "date" }
    ],
    "formFields": [
      { "key": "departmentName", "label": "Department Name", "type": "text", "required": true },
      { "key": "departmentCode", "label": "Department Code", "type": "text", "required": true },
      { "key": "headOfDepartment", "label": "Head of Department", "type": "text" },
      { "key": "phone", "label": "Phone", "type": "text" },
      { "key": "email", "label": "Email", "type": "text" },
      { "key": "location", "label": "Location", "type": "text" },
      { "key": "branch", "label": "Branch", "type": "text" },
      { "key": "status", "label": "Status", "type": "select", "options": ["active", "inactive"] },
      { "key": "costCenter", "label": "Cost Center", "type": "text" },
      { "key": "manager", "label": "Manager", "type": "text" },
      { "key": "employeeCount", "label": "Employee Count", "type": "number" },
      { "key": "budgetCode", "label": "Budget Code", "type": "text" },
      { "key": "description", "label": "Description", "type": "textarea" },
      { "key": "createdBy", "label": "Created By", "type": "text" },
      { "key": "createdAt", "label": "Created At", "type": "date" }
    ],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/warehouses",
    "section": "Settings",
    "label": "Warehouses",
    "pageType": "master",
    "collectionName": "warehouses",
    "columns": [
      { "key": "warehouseName", "label": "Warehouse Name", "type": "text" },
      { "key": "warehouseCode", "label": "Warehouse Code", "type": "text" },
      { "key": "branch", "label": "Branch", "type": "text" },
      { "key": "location", "label": "Location", "type": "text" },
      { "key": "capacity", "label": "Capacity", "type": "text" },
      { "key": "manager", "label": "Manager", "type": "text" },
      { "key": "phone", "label": "Phone", "type": "text" },
      { "key": "email", "label": "Email", "type": "text" },
      { "key": "status", "label": "Status", "type": "text" },
      { "key": "securityLevel", "label": "Security Level", "type": "text" },
      { "key": "areaSqFt", "label": "Area (sq ft)", "type": "number" },
      { "key": "zone", "label": "Zone", "type": "text" },
      { "key": "city", "label": "City", "type": "text" },
      { "key": "state", "label": "State", "type": "text" },
      { "key": "postalCode", "label": "Postal Code", "type": "text" },
      { "key": "country", "label": "Country", "type": "text" },
      { "key": "notes", "label": "Notes", "type": "textarea" },
      { "key": "createdBy", "label": "Created By", "type": "text" },
      { "key": "createdAt", "label": "Created At", "type": "date" }
    ],
    "formFields": [
      { "key": "warehouseName", "label": "Warehouse Name", "type": "text", "required": true },
      { "key": "warehouseCode", "label": "Warehouse Code", "type": "text", "required": true },
      { "key": "branch", "label": "Branch", "type": "text" },
      { "key": "location", "label": "Location", "type": "text" },
      { "key": "capacity", "label": "Capacity", "type": "text" },
      { "key": "manager", "label": "Manager", "type": "text" },
      { "key": "phone", "label": "Phone", "type": "text" },
      { "key": "email", "label": "Email", "type": "text" },
      { "key": "status", "label": "Status", "type": "select", "options": ["active", "inactive"] },
      { "key": "securityLevel", "label": "Security Level", "type": "text" },
      { "key": "areaSqFt", "label": "Area (sq ft)", "type": "number" },
      { "key": "zone", "label": "Zone", "type": "text" },
      { "key": "city", "label": "City", "type": "text" },
      { "key": "state", "label": "State", "type": "text" },
      { "key": "postalCode", "label": "Postal Code", "type": "text" },
      { "key": "country", "label": "Country", "type": "text" },
      { "key": "notes", "label": "Notes", "type": "textarea" },
      { "key": "createdBy", "label": "Created By", "type": "text" },
      { "key": "createdAt", "label": "Created At", "type": "date" }
    ],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "settings/setting/cost-centers",
    "section": "Settings",
    "label": "Cost Centers",
    "pageType": "master",
    "collectionName": "costCenters",
    "columns": [
      { "key": "costCenterName", "label": "Cost Center Name", "type": "text" },
      { "key": "costCenterCode", "label": "Cost Center Code", "type": "text" },
      { "key": "branch", "label": "Branch", "type": "text" },
      { "key": "department", "label": "Department", "type": "text" },
      { "key": "manager", "label": "Manager", "type": "text" },
      { "key": "budgetOwner", "label": "Budget Owner", "type": "text" },
      { "key": "budgetAmount", "label": "Budget Amount", "type": "number" },
      { "key": "currency", "label": "Currency", "type": "text" },
      { "key": "status", "label": "Status", "type": "text" },
      { "key": "location", "label": "Location", "type": "text" },
      { "key": "businessUnit", "label": "Business Unit", "type": "text" },
      { "key": "costCenterType", "label": "Cost Center Type", "type": "text" },
      { "key": "description", "label": "Description", "type": "textarea" },
      { "key": "startDate", "label": "Start Date", "type": "date" },
      { "key": "endDate", "label": "End Date", "type": "date" },
      { "key": "createdBy", "label": "Created By", "type": "text" },
      { "key": "createdAt", "label": "Created At", "type": "date" }
    ],
    "formFields": [
      { "key": "costCenterName", "label": "Cost Center Name", "type": "text", "required": true },
      { "key": "costCenterCode", "label": "Cost Center Code", "type": "text", "required": true },
      { "key": "branch", "label": "Branch", "type": "text" },
      { "key": "department", "label": "Department", "type": "text" },
      { "key": "manager", "label": "Manager", "type": "text" },
      { "key": "budgetOwner", "label": "Budget Owner", "type": "text" },
      { "key": "budgetAmount", "label": "Budget Amount", "type": "number" },
      { "key": "currency", "label": "Currency", "type": "text" },
      { "key": "status", "label": "Status", "type": "select", "options": ["active", "inactive"] },
      { "key": "location", "label": "Location", "type": "text" },
      { "key": "businessUnit", "label": "Business Unit", "type": "text" },
      { "key": "costCenterType", "label": "Cost Center Type", "type": "text" },
      { "key": "description", "label": "Description", "type": "textarea" },
      { "key": "startDate", "label": "Start Date", "type": "date" },
      { "key": "endDate", "label": "End Date", "type": "date" },
      { "key": "createdBy", "label": "Created By", "type": "text" },
      { "key": "createdAt", "label": "Created At", "type": "date" }
    ],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "settings"
    ]
  },
  {
    "moduleKey": "inventory/inventory/product/filter",
    "section": "Inventory",
    "label": "Filter",
    "pageType": "master",
    "collectionName": "filter",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "description",
        "label": "Description",
        "type": "text"
      },
      {
        "key": "parent",
        "label": "Parent",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "inventory"
    ]
  },
  {
    "moduleKey": "inventory/inventory/product/group",
    "section": "Inventory",
    "label": "Group",
    "pageType": "master",
    "collectionName": "group",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "business",
        "label": "Business",
        "type": "text"
      },
      {
        "key": "prefix",
        "label": "Prefix",
        "type": "text"
      },
      {
        "key": "parent",
        "label": "Parent",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "Hierarchy View"
    ],
    "permissions": [
      "inventory"
    ]
  },
  {
    "moduleKey": "inventory/inventory/uom",
    "section": "Inventory",
    "label": "Unit of Measurement",
    "pageType": "master",
    "collectionName": "unitOfMeasurement",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "shortName",
        "label": "Short Name",
        "type": "text"
      },
      {
        "key": "allowDecimal",
        "label": "Allow Decimal",
        "type": "text"
      },
      {
        "key": "defaultValue",
        "label": "Default Value",
        "type": "text"
      },
      {
        "key": "business",
        "label": "Business",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "inventory"
    ]
  },
  {
    "moduleKey": "inventory/inventory/attribute-addon",
    "section": "Inventory",
    "label": "Attribute Addons",
    "pageType": "master",
    "collectionName": "attributeAddons",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "status",
        "label": "Status",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "inventory"
    ]
  },
  {
    "moduleKey": "inventory/inventory/category",
    "section": "Inventory",
    "label": "Category",
    "pageType": "master",
    "collectionName": "category",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "shortName",
        "label": "Short Name",
        "type": "text"
      },
      {
        "key": "shortCode",
        "label": "Short Code",
        "type": "text"
      },
      {
        "key": "status",
        "label": "Status",
        "type": "text"
      },
      {
        "key": "parent",
        "label": "Parent",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "inventory"
    ]
  },
  {
    "moduleKey": "inventory/inventory/item",
    "section": "Inventory",
    "label": "Item",
    "pageType": "master",
    "collectionName": "item",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "itemType",
        "label": "Item Type",
        "type": "text"
      },
      {
        "key": "hsnCode",
        "label": "HSN Code",
        "type": "text"
      },
      {
        "key": "uom",
        "label": "UOM",
        "type": "text"
      },
      {
        "key": "prefix",
        "label": "Prefix",
        "type": "text"
      },
      {
        "key": "itemCode",
        "label": "Item Code",
        "type": "text"
      },
      {
        "key": "group",
        "label": "Group",
        "type": "text"
      },
      {
        "key": "subGroup",
        "label": "Sub Group",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "inventory"
    ]
  },
  {
    "moduleKey": "inventory/inventory/barcode-print",
    "section": "Inventory",
    "label": "Print Label",
    "pageType": "master",
    "collectionName": "printLabel",
    "columns": [
      {
        "key": "itemName",
        "label": "Item Name",
        "type": "text"
      },
      {
        "key": "itemCode",
        "label": "Item Code",
        "type": "text"
      },
      {
        "key": "quantity",
        "label": "Quantity",
        "type": "text"
      },
      {
        "key": "rspPrice",
        "label": "RSP Price",
        "type": "text"
      },
      {
        "key": "wspPrice",
        "label": "WSP Price",
        "type": "text"
      },
      {
        "key": "barcodeCopies",
        "label": "Barcode Copies",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "Preview"
    ],
    "permissions": [
      "inventory"
    ]
  },
  {
    "moduleKey": "inventory/inventory/barcodeitem",
    "section": "Inventory",
    "label": "Barcode Item",
    "pageType": "master",
    "collectionName": "barcodeItem",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "code",
        "label": "Code",
        "type": "text"
      },
      {
        "key": "isActive",
        "label": "Status",
        "type": "checkbox"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "inventory"
    ]
  },
  {
    "moduleKey": "inventory/inventory/stock-adjustment",
    "section": "Inventory",
    "label": "Stock Adjustment",
    "pageType": "document",
    "collectionName": "stockAdjustment",
    "columns": [
      {
        "key": "adjustmentNo",
        "label": "Adjustment No",
        "type": "text"
      },
      {
        "key": "type",
        "label": "Type",
        "type": "text"
      },
      {
        "key": "creadtedOn",
        "label": "Creadted On",
        "type": "text"
      },
      {
        "key": "reason",
        "label": "Reason",
        "type": "text"
      },
      {
        "key": "createdBy",
        "label": "Created By",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "inventory"
    ]
  },
  {
    "moduleKey": "inventory/inventory/bulk-price-update",
    "section": "Inventory",
    "label": "Bulk Price Update",
    "pageType": "special",
    "collectionName": "bulkPriceUpdate",
    "columns": [
      {
        "key": "field",
        "label": "#",
        "type": "text"
      },
      {
        "key": "item",
        "label": "Item",
        "type": "text"
      },
      {
        "key": "barcode",
        "label": "Barcode",
        "type": "text"
      },
      {
        "key": "purchase",
        "label": "Purchase",
        "type": "text"
      },
      {
        "key": "discount",
        "label": "Discount",
        "type": "text"
      },
      {
        "key": "rate",
        "label": "Rate",
        "type": "text"
      },
      {
        "key": "rsp",
        "label": "RSP",
        "type": "text"
      },
      {
        "key": "wsp",
        "label": "WSP",
        "type": "text"
      },
      {
        "key": "dp",
        "label": "DP",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Apply"
    ],
    "permissions": [
      "inventory"
    ]
  },
  {
    "moduleKey": "inventory/inventory/barcodeitem",
    "section": "Inventory",
    "label": "Barcode Items",
    "pageType": "special",
    "collectionName": "barcodeItems",
    "columns": [],
    "formFields": [],
    "buttons": [],
    "permissions": [
      "inventory"
    ]
  },
  {
    "moduleKey": "contacts/contact/contact-type",
    "section": "Contacts",
    "label": "Contact Types",
    "pageType": "master",
    "collectionName": "contactTypes",
    "columns": [
      {
        "key": "typeName",
        "label": "Type Name",
        "type": "text"
      },
      {
        "key": "contactType",
        "label": "Contact Type",
        "type": "text"
      },
      {
        "key": "prefix",
        "label": "Prefix",
        "type": "text"
      },
      {
        "key": "status",
        "label": "Status",
        "type": "text"
      },
      {
        "key": "businessName",
        "label": "Business Name",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "contacts"
    ]
  },
  {
    "moduleKey": "contacts/contact/supplier",
    "section": "Contacts",
    "label": "Suppliers",
    "pageType": "master",
    "collectionName": "suppliers",
    "columns": [
      {
        "key": "businessName",
        "label": "Business Name",
        "type": "text"
      },
      {
        "key": "contactId",
        "label": "Contact ID",
        "type": "text"
      },
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "mobile",
        "label": "Mobile",
        "type": "text"
      },
      {
        "key": "email",
        "label": "Email",
        "type": "text"
      },
      {
        "key": "address",
        "label": "Address",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "contacts"
    ]
  },
  {
    "moduleKey": "contacts/contact/agent",
    "section": "Contacts",
    "label": "Agents",
    "pageType": "master",
    "collectionName": "agents",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "contactId",
        "label": "Contact ID",
        "type": "text"
      },
      {
        "key": "mobile",
        "label": "Mobile",
        "type": "text"
      },
      {
        "key": "email",
        "label": "Email",
        "type": "text"
      },
      {
        "key": "address",
        "label": "Address",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "contacts"
    ]
  },
  {
    "moduleKey": "contacts/contact/customer",
    "section": "Contacts",
    "label": "Customers",
    "pageType": "master",
    "collectionName": "customers",
    "columns": [
      {
        "key": "businessName",
        "label": "Business Name",
        "type": "text"
      },
      {
        "key": "contactId",
        "label": "Contact ID",
        "type": "text"
      },
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "mobile",
        "label": "Mobile",
        "type": "text"
      },
      {
        "key": "email",
        "label": "Email",
        "type": "text"
      },
      {
        "key": "address",
        "label": "Address",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "contacts"
    ]
  },
  {
    "moduleKey": "logistic/logistic/transport",
    "section": "Logistic",
    "label": "Transporter Master",
    "pageType": "master",
    "collectionName": "transportMaster",
    "columns": [
      {
        "key": "transporterName",
        "label": "Transporter Name",
        "type": "text"
      },
      {
        "key": "transporterCode",
        "label": "Transporter Code",
        "type": "text"
      },
      {
        "key": "gstNo",
        "label": "GST No",
        "type": "text"
      },
      {
        "key": "contactNo",
        "label": "Contact No",
        "type": "text"
      }
    ],
    "formFields": [
      {
        "key": "transporterName",
        "label": "Transporter Name",
        "type": "text",
        "required": true
      },
      {
        "key": "transporterCode",
        "label": "Transporter Code",
        "type": "text",
        "required": true
      },
      {
        "key": "gstNo",
        "label": "GST No",
        "type": "text"
      },
      {
        "key": "contactNo",
        "label": "Contact No",
        "type": "text"
      },
      {
        "key": "email",
        "label": "Email",
        "type": "text"
      },
      {
        "key": "address",
        "label": "Address",
        "type": "textarea"
      },
      {
        "key": "city",
        "label": "City",
        "type": "text"
      },
      {
        "key": "state",
        "label": "State",
        "type": "text"
      },
      {
        "key": "freight",
        "label": "Freight Modes",
        "type": "group",
        "fields": [
          {
            "key": "toPay",
            "label": "To Pay",
            "type": "checkbox"
          },
          {
            "key": "postPaid",
            "label": "Post Paid",
            "type": "checkbox"
          },
          {
            "key": "paid",
            "label": "Paid",
            "type": "checkbox"
          },
          {
            "key": "upiOrBankTrf",
            "label": "UPI or Bank Transfer",
            "type": "checkbox"
          }
        ]
      },
      {
        "key": "gst",
        "label": "Is GST Applicable",
        "type": "select",
        "options": ["yes", "no"]
      }
    ],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "logistic"
    ]
  },
  {
    "moduleKey": "logistic/logistic/vehicle",
    "section": "Logistic",
    "label": "Vehicle Master",
    "pageType": "master",
    "collectionName": "vehicleMaster",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "code",
        "label": "Code",
        "type": "text"
      },
      {
        "key": "isActive",
        "label": "Status",
        "type": "checkbox"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "logistic"
    ]
  },
  {
    "moduleKey": "logistic/logistic/driver",
    "section": "Logistic",
    "label": "Driver Master",
    "pageType": "master",
    "collectionName": "driverMaster",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "code",
        "label": "Code",
        "type": "text"
      },
      {
        "key": "isActive",
        "label": "Status",
        "type": "checkbox"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "logistic"
    ]
  },
  {
    "moduleKey": "logistic/logistic/route",
    "section": "Logistic",
    "label": "Route Master",
    "pageType": "master",
    "collectionName": "routeMaster",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "code",
        "label": "Code",
        "type": "text"
      },
      {
        "key": "isActive",
        "label": "Status",
        "type": "checkbox"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "logistic"
    ]
  },
  {
    "moduleKey": "logistic/logistic/dispatch",
    "section": "Logistic",
    "label": "Dispatch",
    "pageType": "document",
    "collectionName": "dispatch",
    "columns": [
      {
        "key": "docNo",
        "label": "Doc No",
        "type": "text"
      },
      {
        "key": "date",
        "label": "Date",
        "type": "date"
      },
      {
        "key": "party",
        "label": "Party",
        "type": "lookup"
      },
      {
        "key": "amount",
        "label": "Amount",
        "type": "number"
      },
      {
        "key": "status",
        "label": "Status",
        "type": "select"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "logistic"
    ]
  },
  {
    "moduleKey": "logistic/logistic/delivery",
    "section": "Logistic",
    "label": "Delivery",
    "pageType": "document",
    "collectionName": "delivery",
    "columns": [
      {
        "key": "docNo",
        "label": "Doc No",
        "type": "text"
      },
      {
        "key": "date",
        "label": "Date",
        "type": "date"
      },
      {
        "key": "party",
        "label": "Party",
        "type": "lookup"
      },
      {
        "key": "amount",
        "label": "Amount",
        "type": "number"
      },
      {
        "key": "status",
        "label": "Status",
        "type": "select"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "logistic"
    ]
  },
  {
    "moduleKey": "purchase/transaction/purchase/grc",
    "section": "Purchase",
    "label": "Goods Receipt Challan",
    "pageType": "document",
    "collectionName": "goodsReceiptChallan",
    "columns": [
      {
        "key": "vendorName",
        "label": "Vendor Name",
        "type": "text"
      },
      {
        "key": "grcNo",
        "label": "GRC NO",
        "type": "text"
      },
      {
        "key": "grcDate",
        "label": "GRC Date",
        "type": "text"
      },
      {
        "key": "logisticNo",
        "label": "Logistic No",
        "type": "text"
      },
      {
        "key": "purchaseGroup",
        "label": "Purchase Group",
        "type": "text"
      },
      {
        "key": "occasion",
        "label": "Occasion",
        "type": "text"
      },
      {
        "key": "agent",
        "label": "Agent",
        "type": "text"
      },
      {
        "key": "vendorDocNo",
        "label": "Vendor Doc No",
        "type": "text"
      },
      {
        "key": "procurementType",
        "label": "Procurement Type",
        "type": "text"
      },
      {
        "key": "purchaseTerm",
        "label": "Purchase Term",
        "type": "text"
      },
      {
        "key": "taxable",
        "label": "Taxable",
        "type": "text"
      },
      {
        "key": "totalQuantity",
        "label": "Total Quantity",
        "type": "text"
      },
      {
        "key": "gst",
        "label": "GST",
        "type": "text"
      },
      {
        "key": "netAmount",
        "label": "Net Amount",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "purchase"
    ]
  },
  {
    "moduleKey": "purchase/transaction/purchase/invoice",
    "section": "Purchase",
    "label": "Purchase Invoice",
    "pageType": "document",
    "collectionName": "purchaseInvoice",
    "columns": [
      {
        "key": "purchaseInvoice",
        "label": "Purchase Invoice",
        "type": "text"
      },
      {
        "key": "purchaseDate",
        "label": "Purchase Date",
        "type": "text"
      },
      {
        "key": "supplierName",
        "label": "Supplier Name",
        "type": "text"
      },
      {
        "key": "grcNo",
        "label": "GRC NO",
        "type": "text"
      },
      {
        "key": "netPurchaseAmt",
        "label": "Net Purchase Amt",
        "type": "text"
      },
      {
        "key": "totalPayable",
        "label": "Total Payable",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "purchase"
    ]
  },
  {
    "moduleKey": "purchase/transaction/purchase/grt",
    "section": "Purchase",
    "label": "Goods Return Note",
    "pageType": "document",
    "collectionName": "goodsReturnNote",
    "columns": [
      {
        "key": "grtNo",
        "label": "GRT NO",
        "type": "text"
      },
      {
        "key": "grtDate",
        "label": "GRT Date",
        "type": "text"
      },
      {
        "key": "supplierName",
        "label": "Supplier Name",
        "type": "text"
      },
      {
        "key": "grcNo",
        "label": "GRC NO",
        "type": "text"
      },
      {
        "key": "qty",
        "label": "Qty",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "purchase"
    ]
  },
  {
    "moduleKey": "purchase/transaction/purchase/debitnote",
    "section": "Purchase",
    "label": "Debit Note",
    "pageType": "document",
    "collectionName": "debitNote",
    "columns": [
      {
        "key": "debitNoteNo",
        "label": "Debit Note No",
        "type": "text"
      },
      {
        "key": "debitCreadted",
        "label": "Debit Creadted",
        "type": "text"
      },
      {
        "key": "supplier",
        "label": "Supplier",
        "type": "text"
      },
      {
        "key": "grtNo",
        "label": "GRT NO",
        "type": "text"
      },
      {
        "key": "qty",
        "label": "Qty",
        "type": "text"
      },
      {
        "key": "value",
        "label": "Value",
        "type": "text"
      },
      {
        "key": "remaining",
        "label": "Remaining",
        "type": "text"
      },
      {
        "key": "adjStatus",
        "label": "Adj. Status",
        "type": "text"
      },
      {
        "key": "adjustedAgainstPi",
        "label": "Adjusted Against (PI)",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "purchase"
    ]
  },
  {
    "moduleKey": "sell/transaction/sell/deliverychallan",
    "section": "Sell",
    "label": "Delivery Challan",
    "pageType": "document",
    "collectionName": "deliveryChallan",
    "columns": [
      {
        "key": "deliveryChallanNo",
        "label": "Delivery Challan No",
        "type": "text"
      },
      {
        "key": "customerName",
        "label": "Customer Name",
        "type": "text"
      },
      {
        "key": "customerMobile",
        "label": "Customer Mobile",
        "type": "text"
      },
      {
        "key": "customerGstNo",
        "label": "Customer GST No",
        "type": "text"
      },
      {
        "key": "creadtedOn",
        "label": "Creadted On",
        "type": "text"
      },
      {
        "key": "logisticNo",
        "label": "Logistic No",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "sell"
    ]
  },
  {
    "moduleKey": "sell/transaction/sell/salesinvoice",
    "section": "Sell",
    "label": "Sales Invoice",
    "pageType": "document",
    "collectionName": "salesInvoice",
    "columns": [
      {
        "key": "salesInvoiceNo",
        "label": "Sales Invoice No",
        "type": "text"
      },
      {
        "key": "customerName",
        "label": "Customer Name",
        "type": "text"
      },
      {
        "key": "customerMobile",
        "label": "Customer Mobile",
        "type": "text"
      },
      {
        "key": "customerGstNo",
        "label": "Customer GST No",
        "type": "text"
      },
      {
        "key": "deliveryChallanNo",
        "label": "Delivery Challan No",
        "type": "text"
      },
      {
        "key": "creadtedOn",
        "label": "Creadted On",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "sell"
    ]
  },
  {
    "moduleKey": "sell/transaction/sell/salereturn",
    "section": "Sell",
    "label": "Sales Return",
    "pageType": "document",
    "collectionName": "salesReturn",
    "columns": [
      {
        "key": "customerName",
        "label": "Customer Name",
        "type": "text"
      },
      {
        "key": "salesReturnNo",
        "label": "Sales Return No",
        "type": "text"
      },
      {
        "key": "creadtedOn",
        "label": "Creadted On",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "sell"
    ]
  },
  {
    "moduleKey": "sell/transaction/sell/creditnote",
    "section": "Sell",
    "label": "Credit Note",
    "pageType": "document",
    "collectionName": "creditNote",
    "columns": [
      {
        "key": "customerName",
        "label": "Customer Name",
        "type": "text"
      },
      {
        "key": "creditNoteCode",
        "label": "Credit Note Code",
        "type": "text"
      },
      {
        "key": "totalQty",
        "label": "Total Qty",
        "type": "text"
      },
      {
        "key": "creadtedOn",
        "label": "Creadted On",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "sell"
    ]
  },
  {
    "moduleKey": "sell/transaction/sell/pos",
    "section": "Sell",
    "label": "POS",
    "pageType": "special",
    "collectionName": "pos",
    "columns": [
      {
        "key": "date",
        "label": "Date",
        "type": "text"
      },
      {
        "key": "invoiceNo",
        "label": "Invoice No",
        "type": "text"
      },
      {
        "key": "counter",
        "label": "Counter",
        "type": "text"
      },
      {
        "key": "customerName",
        "label": "Customer Name",
        "type": "text"
      },
      {
        "key": "customerContact",
        "label": "Customer Contact",
        "type": "text"
      },
      {
        "key": "exempted",
        "label": "Exempted",
        "type": "text"
      },
      {
        "key": "billingType",
        "label": "Billing Type",
        "type": "text"
      },
      {
        "key": "paymentStatus",
        "label": "Payment Status",
        "type": "text"
      },
      {
        "key": "totalAmount",
        "label": "Total Amount",
        "type": "text"
      },
      {
        "key": "paid",
        "label": "Paid",
        "type": "text"
      },
      {
        "key": "sellDue",
        "label": "Sell Due",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [],
    "permissions": [
      "sell"
    ]
  },
  {
    "moduleKey": "sell/transaction/sell/pos-return",
    "section": "Sell",
    "label": "POS Return",
    "pageType": "document",
    "collectionName": "posReturn",
    "columns": [
      {
        "key": "date",
        "label": "Date",
        "type": "text"
      },
      {
        "key": "invoiceNo",
        "label": "Invoice No",
        "type": "text"
      },
      {
        "key": "parentInvoice",
        "label": "Parent Invoice",
        "type": "text"
      },
      {
        "key": "customerName",
        "label": "Customer Name",
        "type": "text"
      },
      {
        "key": "paymentStatus",
        "label": "Payment Status",
        "type": "text"
      },
      {
        "key": "totalAmount",
        "label": "Total Amount",
        "type": "text"
      },
      {
        "key": "location",
        "label": "Location",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "sell"
    ]
  },
  {
    "moduleKey": "sell/transaction/sell/b2binvoice",
    "section": "Sell",
    "label": "B2B Invoice",
    "pageType": "document",
    "collectionName": "b2bInvoice",
    "columns": [
      {
        "key": "location",
        "label": "Location",
        "type": "text"
      },
      {
        "key": "invoiceNo",
        "label": "Invoice No",
        "type": "text"
      },
      {
        "key": "customerName",
        "label": "Customer Name",
        "type": "text"
      },
      {
        "key": "customerContact",
        "label": "Customer Contact",
        "type": "text"
      },
      {
        "key": "gstNo",
        "label": "GST No",
        "type": "text"
      },
      {
        "key": "state",
        "label": "State",
        "type": "text"
      },
      {
        "key": "totalTaxable",
        "label": "Total Taxable",
        "type": "text"
      },
      {
        "key": "totalIgstAmount",
        "label": "Total IGST Amount",
        "type": "text"
      },
      {
        "key": "totalCgstAmount",
        "label": "Total CGST Amount",
        "type": "text"
      },
      {
        "key": "totalSgstAmount",
        "label": "Total SGST Amount",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "sell"
    ]
  },
  {
    "moduleKey": "staff-management/staff-management/roles-permissions",
    "section": "Staff Management",
    "label": "Roles & Permissions",
    "pageType": "master",
    "collectionName": "rolesPermissions",
    "columns": [
      {
        "key": "businessName",
        "label": "Business Name",
        "type": "text"
      },
      {
        "key": "rollName",
        "label": "Roll Name",
        "type": "text"
      },
      {
        "key": "description",
        "label": "Description",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "staffManagement"
    ]
  },
  {
    "moduleKey": "staff-management/staff-management/staff",
    "section": "Staff Management",
    "label": "Staffs",
    "pageType": "master",
    "collectionName": "staffs",
    "columns": [
      {
        "key": "username",
        "label": "Username",
        "type": "text"
      },
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "email",
        "label": "Email",
        "type": "text"
      },
      {
        "key": "role",
        "label": "Role",
        "type": "text"
      },
      {
        "key": "allowLogin",
        "label": "Allow login",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "staffManagement"
    ]
  },
  {
    "moduleKey": "staff-management/staff-management/staff/salesperson",
    "section": "Staff Management",
    "label": "Sales Persons",
    "pageType": "master",
    "collectionName": "salesPersons",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "email",
        "label": "Email",
        "type": "text"
      },
      {
        "key": "spCode",
        "label": "SP Code",
        "type": "text"
      },
      {
        "key": "spName",
        "label": "SP Name",
        "type": "text"
      },
      {
        "key": "default",
        "label": "Default",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "staffManagement"
    ]
  },
  {
    "moduleKey": "stock-transfers/transaction/stocktransfers/transferstockpacket",
    "section": "Stock Transfers",
    "label": "Transfer Stock Packet",
    "pageType": "document",
    "collectionName": "transferStockPacket",
    "columns": [
      {
        "key": "transferDate",
        "label": "Transfer Date",
        "type": "text"
      },
      {
        "key": "transferFrom",
        "label": "Transfer From",
        "type": "text"
      },
      {
        "key": "transferTo",
        "label": "Transfer To",
        "type": "text"
      },
      {
        "key": "packetNo",
        "label": "Packet No",
        "type": "text"
      },
      {
        "key": "creadtedOn",
        "label": "Creadted On",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "stockTransfers"
    ]
  },
  {
    "moduleKey": "stock-transfers/transaction/stocktransfers/transferstocklocation",
    "section": "Stock Transfers",
    "label": "Transfer Stock Location",
    "pageType": "document",
    "collectionName": "transferStockLocation",
    "columns": [
      {
        "key": "packetNo",
        "label": "Packet No",
        "type": "text"
      },
      {
        "key": "transferFrom",
        "label": "Transfer From",
        "type": "text"
      },
      {
        "key": "transferTo",
        "label": "Transfer To",
        "type": "text"
      },
      {
        "key": "transferDate",
        "label": "Transfer Date",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "stockTransfers"
    ]
  },
  {
    "moduleKey": "stock-transfers/transaction/stocktransfers/transferstockreceiveds",
    "section": "Stock Transfers",
    "label": "Transfer Stock Received",
    "pageType": "document",
    "collectionName": "transferStockReceived",
    "columns": [
      {
        "key": "packetNo",
        "label": "Packet No",
        "type": "text"
      },
      {
        "key": "transferFrom",
        "label": "Transfer From",
        "type": "text"
      },
      {
        "key": "transferTo",
        "label": "Transfer To",
        "type": "text"
      },
      {
        "key": "date",
        "label": "Date",
        "type": "text"
      },
      {
        "key": "sentQty",
        "label": "Sent Qty",
        "type": "text"
      },
      {
        "key": "receivedQty",
        "label": "Received Qty",
        "type": "text"
      },
      {
        "key": "pendingQty",
        "label": "Pending Qty",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "stockTransfers"
    ]
  },
  {
    "moduleKey": "inter-company-sell/transaction/intercompanysell/deliverychallan",
    "section": "Inter Company Sell",
    "label": "Delivery Challan",
    "pageType": "document",
    "collectionName": "deliveryChallan",
    "columns": [
      {
        "key": "customerName",
        "label": "Customer Name",
        "type": "text"
      },
      {
        "key": "toBusiness",
        "label": "To Business",
        "type": "text"
      },
      {
        "key": "toLocation",
        "label": "To Location",
        "type": "text"
      },
      {
        "key": "dcNo",
        "label": "DC No",
        "type": "text"
      },
      {
        "key": "dcDate",
        "label": "DC Date",
        "type": "text"
      },
      {
        "key": "creadtedOn",
        "label": "Creadted On",
        "type": "text"
      },
      {
        "key": "totalValue",
        "label": "Total Value",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "interCompanySell"
    ]
  },
  {
    "moduleKey": "inter-company-sell/transaction/intercompanysell/salesinvoice",
    "section": "Inter Company Sell",
    "label": "Sales Invoice",
    "pageType": "document",
    "collectionName": "salesInvoice",
    "columns": [
      {
        "key": "invoiceDate",
        "label": "Invoice Date",
        "type": "text"
      },
      {
        "key": "invoiceNo",
        "label": "Invoice No",
        "type": "text"
      },
      {
        "key": "customerName",
        "label": "Customer Name",
        "type": "text"
      },
      {
        "key": "toBusiness",
        "label": "To Business",
        "type": "text"
      },
      {
        "key": "toLocation",
        "label": "To Location",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print",
      "Print Invoice"
    ],
    "permissions": [
      "interCompanySell"
    ]
  },
  {
    "moduleKey": "inter-company-sell/transaction/intercompanysell/auto-purchases-received",
    "section": "Inter Company Sell",
    "label": "Auto Purchases Received",
    "pageType": "document",
    "collectionName": "autoPurchasesReceived",
    "columns": [
      {
        "key": "invoiceNo",
        "label": "Invoice No",
        "type": "text"
      },
      {
        "key": "transferBusiness",
        "label": "Transfer Business",
        "type": "text"
      },
      {
        "key": "transferLocation",
        "label": "Transfer Location",
        "type": "text"
      },
      {
        "key": "date",
        "label": "Date",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "interCompanySell"
    ]
  },
  {
    "moduleKey": "inter-company-sell/transaction/intercompanysell/auto-purchases-return",
    "section": "Inter Company Sell",
    "label": "Auto Purchases Return",
    "pageType": "document",
    "collectionName": "autoPurchasesReturn",
    "columns": [
      {
        "key": "docNo",
        "label": "Doc No",
        "type": "text"
      },
      {
        "key": "date",
        "label": "Date",
        "type": "date"
      },
      {
        "key": "party",
        "label": "Party",
        "type": "lookup"
      },
      {
        "key": "amount",
        "label": "Amount",
        "type": "number"
      },
      {
        "key": "status",
        "label": "Status",
        "type": "select"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "interCompanySell"
    ]
  },
  {
    "moduleKey": "inter-company-sell/transaction/intercompanysell/salereturn",
    "section": "Inter Company Sell",
    "label": "Sales Return",
    "pageType": "document",
    "collectionName": "salesReturn",
    "columns": [
      {
        "key": "docNo",
        "label": "Doc No",
        "type": "text"
      },
      {
        "key": "date",
        "label": "Date",
        "type": "date"
      },
      {
        "key": "party",
        "label": "Party",
        "type": "lookup"
      },
      {
        "key": "amount",
        "label": "Amount",
        "type": "number"
      },
      {
        "key": "status",
        "label": "Status",
        "type": "select"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "interCompanySell"
    ]
  },
  {
    "moduleKey": "reports/reports/barcode-report",
    "section": "Reports",
    "label": "Barcode Report",
    "pageType": "report",
    "collectionName": "barcodeReport",
    "columns": [
      {
        "key": "date",
        "label": "Date",
        "type": "date"
      },
      {
        "key": "value",
        "label": "Value",
        "type": "number"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/receipt-voucher-report",
    "section": "Reports",
    "label": "Receipt Voucher Report",
    "pageType": "report",
    "collectionName": "receiptVoucherReport",
    "columns": [
      {
        "key": "voucherNo",
        "label": "Voucher No",
        "type": "text"
      },
      {
        "key": "date",
        "label": "Date",
        "type": "text"
      },
      {
        "key": "customerName",
        "label": "Customer Name",
        "type": "text"
      },
      {
        "key": "totalAmount",
        "label": "Total Amount",
        "type": "text"
      },
      {
        "key": "bank",
        "label": "Bank",
        "type": "text"
      },
      {
        "key": "cash",
        "label": "Cash",
        "type": "text"
      },
      {
        "key": "upi",
        "label": "UPI",
        "type": "text"
      },
      {
        "key": "advanceAmount",
        "label": "Advance Amount",
        "type": "text"
      },
      {
        "key": "advanceStatus",
        "label": "Advance Status",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print",
      "Export CSV"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/payment-voucher-report",
    "section": "Reports",
    "label": "Payment Voucher Report",
    "pageType": "report",
    "collectionName": "paymentVoucherReport",
    "columns": [
      {
        "key": "voucherNo",
        "label": "Voucher No",
        "type": "text"
      },
      {
        "key": "date",
        "label": "Date",
        "type": "text"
      },
      {
        "key": "supplier",
        "label": "Supplier",
        "type": "text"
      },
      {
        "key": "totalAmount",
        "label": "Total Amount",
        "type": "text"
      },
      {
        "key": "bank",
        "label": "Bank",
        "type": "text"
      },
      {
        "key": "cash",
        "label": "Cash",
        "type": "text"
      },
      {
        "key": "discount",
        "label": "Discount",
        "type": "text"
      },
      {
        "key": "onAccount",
        "label": "On Account",
        "type": "text"
      },
      {
        "key": "settlementStatus",
        "label": "Settlement Status",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print",
      "Export CSV"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/sales-analysis",
    "section": "Reports",
    "label": "Sales Analysis",
    "pageType": "report",
    "collectionName": "salesAnalysis",
    "columns": [
      {
        "key": "location",
        "label": "Location",
        "type": "text"
      },
      {
        "key": "salesValue",
        "label": "Sales Value",
        "type": "text"
      },
      {
        "key": "returnValue",
        "label": "Return Value",
        "type": "text"
      },
      {
        "key": "netSales",
        "label": "Net Sales",
        "type": "text"
      },
      {
        "key": "saleQuantity",
        "label": "Sale Quantity",
        "type": "text"
      },
      {
        "key": "returnQuantity",
        "label": "Return Quantity",
        "type": "text"
      },
      {
        "key": "netQty",
        "label": "Net Qty",
        "type": "text"
      },
      {
        "key": "billCount",
        "label": "Bill Count",
        "type": "text"
      },
      {
        "key": "averageBasketQuantity",
        "label": "Average Basket Quantity",
        "type": "text"
      },
      {
        "key": "averageBasketValue",
        "label": "Average Basket value",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/sales-report",
    "section": "Reports",
    "label": "Sales Report",
    "pageType": "report",
    "collectionName": "salesReport",
    "columns": [
      {
        "key": "date",
        "label": "Date",
        "type": "date"
      },
      {
        "key": "value",
        "label": "Value",
        "type": "number"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/stock-image",
    "section": "Reports",
    "label": "Stock Image",
    "pageType": "report",
    "collectionName": "stockImage",
    "columns": [
      {
        "key": "date",
        "label": "Date",
        "type": "date"
      },
      {
        "key": "value",
        "label": "Value",
        "type": "number"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/sales-image",
    "section": "Reports",
    "label": "Sales Image",
    "pageType": "report",
    "collectionName": "salesImage",
    "columns": [
      {
        "key": "date",
        "label": "Date",
        "type": "date"
      },
      {
        "key": "value",
        "label": "Value",
        "type": "number"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/sales-person",
    "section": "Reports",
    "label": "Sales Person",
    "pageType": "report",
    "collectionName": "salesPerson",
    "columns": [
      {
        "key": "salesPerson",
        "label": "Sales Person",
        "type": "text"
      },
      {
        "key": "sellQty",
        "label": "Sell Qty",
        "type": "text"
      },
      {
        "key": "totalTaxable",
        "label": "Total Taxable",
        "type": "text"
      },
      {
        "key": "sellValue",
        "label": "Sell Value",
        "type": "text"
      },
      {
        "key": "returnQty",
        "label": "Return Qty",
        "type": "text"
      },
      {
        "key": "returnValue",
        "label": "Return Value",
        "type": "text"
      },
      {
        "key": "netValue",
        "label": "Net Value",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print",
      "Bill Wise view"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/pos-summary",
    "section": "Reports",
    "label": "POS Summary",
    "pageType": "report",
    "collectionName": "posSummary",
    "columns": [
      {
        "key": "date",
        "label": "Date",
        "type": "date"
      },
      {
        "key": "value",
        "label": "Value",
        "type": "number"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/pos-report",
    "section": "Reports",
    "label": "POS Report",
    "pageType": "report",
    "collectionName": "posReport",
    "columns": [
      {
        "key": "cells",
        "label": "cells",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/pos-credit-note",
    "section": "Reports",
    "label": "POS Credit Note",
    "pageType": "report",
    "collectionName": "posCreditNote",
    "columns": [
      {
        "key": "locationName",
        "label": "Location Name",
        "type": "text"
      },
      {
        "key": "creditNo",
        "label": "Credit No.",
        "type": "text"
      },
      {
        "key": "transactionDate",
        "label": "Transaction Date",
        "type": "text"
      },
      {
        "key": "finalTotal",
        "label": "Final Total",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/item-stock",
    "section": "Reports",
    "label": "Item Stock",
    "pageType": "report",
    "collectionName": "itemStock",
    "columns": [
      {
        "key": "locationName",
        "label": "Location Name",
        "type": "text"
      },
      {
        "key": "groupName",
        "label": "Group Name",
        "type": "text"
      },
      {
        "key": "openQty",
        "label": "Open Qty",
        "type": "text"
      },
      {
        "key": "openValue",
        "label": "Open Value",
        "type": "text"
      },
      {
        "key": "inwardQty",
        "label": "Inward Qty",
        "type": "text"
      },
      {
        "key": "inwardValue",
        "label": "Inward Value",
        "type": "text"
      },
      {
        "key": "outwardQty",
        "label": "Outward Qty",
        "type": "text"
      },
      {
        "key": "outwardValue",
        "label": "Outward Value",
        "type": "text"
      },
      {
        "key": "closeQty",
        "label": "Close Qty",
        "type": "text"
      },
      {
        "key": "closeValue",
        "label": "Close Value",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/supplier-bill",
    "section": "Reports",
    "label": "Supplier Bill Report",
    "pageType": "report",
    "collectionName": "supplierBillReport",
    "columns": [
      {
        "key": "location",
        "label": "Location",
        "type": "text"
      },
      {
        "key": "supplier",
        "label": "Supplier",
        "type": "text"
      },
      {
        "key": "grcNo",
        "label": "GRC No",
        "type": "text"
      },
      {
        "key": "date",
        "label": "Date",
        "type": "text"
      },
      {
        "key": "billValue",
        "label": "Bill Value",
        "type": "text"
      },
      {
        "key": "purchaseQty",
        "label": "Purchase Qty",
        "type": "text"
      },
      {
        "key": "rerurnQty",
        "label": "Rerurn Qty",
        "type": "text"
      },
      {
        "key": "netSaleQty",
        "label": "Net Sale Qty",
        "type": "text"
      },
      {
        "key": "closeQty",
        "label": "Close Qty",
        "type": "text"
      },
      {
        "key": "closeBal",
        "label": "Close Bal",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/supplier-outstanding-report",
    "section": "Reports",
    "label": "Supplier Outstanding Report",
    "pageType": "report",
    "collectionName": "supplierOutstandingReport",
    "columns": [
      {
        "key": "supplier",
        "label": "SUPPLIER",
        "type": "text"
      },
      {
        "key": "outstandingPurchaseInvoice",
        "label": "OUTSTANDING PURCHASE INVOICE",
        "type": "text"
      },
      {
        "key": "outstandingDebitNote",
        "label": "OUTSTANDING DEBIT NOTE",
        "type": "text"
      },
      {
        "key": "totalDue",
        "label": "TOTAL DUE",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/customer-outstanding-report",
    "section": "Reports",
    "label": "Customer Outstanding Report",
    "pageType": "report",
    "collectionName": "customerOutstandingReport",
    "columns": [
      {
        "key": "customer",
        "label": "Customer",
        "type": "text"
      },
      {
        "key": "outstandingPosInvoice",
        "label": "Outstanding POS Invoice",
        "type": "text"
      },
      {
        "key": "outstandingPosReturn",
        "label": "Outstanding POS Return",
        "type": "text"
      },
      {
        "key": "totalDue",
        "label": "Total Due",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/stock-gallery-view",
    "section": "Reports",
    "label": "Stock Gallery View",
    "pageType": "report",
    "collectionName": "stockGalleryView",
    "columns": [
      {
        "key": "date",
        "label": "Date",
        "type": "date"
      },
      {
        "key": "value",
        "label": "Value",
        "type": "number"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/stock-summary",
    "section": "Reports",
    "label": "Stock Summary",
    "pageType": "report",
    "collectionName": "stockSummary",
    "columns": [
      {
        "key": "location",
        "label": "Location",
        "type": "text"
      },
      {
        "key": "groupName",
        "label": "Group Name",
        "type": "text"
      },
      {
        "key": "totalQty",
        "label": "Total Qty",
        "type": "text"
      },
      {
        "key": "cpValue",
        "label": "CP Value",
        "type": "text"
      },
      {
        "key": "rspValue",
        "label": "RSP Value",
        "type": "text"
      },
      {
        "key": "wspValue",
        "label": "WSP Value",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/gst-summary",
    "section": "Reports",
    "label": "GST Summary",
    "pageType": "report",
    "collectionName": "gstSummary",
    "columns": [
      {
        "key": "description",
        "label": "DESCRIPTION",
        "type": "text"
      },
      {
        "key": "noOfRecords",
        "label": "NO. OF RECORDS",
        "type": "text"
      },
      {
        "key": "subTotalNetSales",
        "label": "SUB TOTAL (NET SALES)",
        "type": "text"
      },
      {
        "key": "taxableAmount",
        "label": "TAXABLE AMOUNT",
        "type": "text"
      },
      {
        "key": "igst",
        "label": "IGST",
        "type": "text"
      },
      {
        "key": "cgst",
        "label": "CGST",
        "type": "text"
      },
      {
        "key": "sgst",
        "label": "SGST",
        "type": "text"
      },
      {
        "key": "billDetails",
        "label": "BILL DETAILS",
        "type": "text"
      },
      {
        "key": "itemDetails",
        "label": "ITEM DETAILS",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/hsn-summary",
    "section": "Reports",
    "label": "Hsn Summary",
    "pageType": "report",
    "collectionName": "hsnSummary",
    "columns": [
      {
        "key": "type",
        "label": "Type",
        "type": "text"
      },
      {
        "key": "hsn",
        "label": "HSN",
        "type": "text"
      },
      {
        "key": "uom",
        "label": "UoM",
        "type": "text"
      },
      {
        "key": "taxRate",
        "label": "Tax Rate %",
        "type": "text"
      },
      {
        "key": "qty",
        "label": "Qty",
        "type": "text"
      },
      {
        "key": "subTotalNetSales",
        "label": "Sub Total (Net Sales)",
        "type": "text"
      },
      {
        "key": "taxableAmount",
        "label": "Taxable Amount",
        "type": "text"
      },
      {
        "key": "igst",
        "label": "IGST",
        "type": "text"
      },
      {
        "key": "cgst",
        "label": "CGST",
        "type": "text"
      },
      {
        "key": "sgst",
        "label": "SGST",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/customer-report",
    "section": "Reports",
    "label": "Customer Report",
    "pageType": "report",
    "collectionName": "customerReport",
    "columns": [
      {
        "key": "cells",
        "label": "cells",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/day-end-report",
    "section": "Reports",
    "label": "Day End Report",
    "pageType": "report",
    "collectionName": "dayEndReport",
    "columns": [
      {
        "key": "cells",
        "label": "cells",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/master-report",
    "section": "Reports",
    "label": "Master Report",
    "pageType": "report",
    "collectionName": "masterReport",
    "columns": [
      {
        "key": "businessName",
        "label": "Business Name",
        "type": "text"
      },
      {
        "key": "jnr",
        "label": "JNR",
        "type": "text"
      },
      {
        "key": "hsr",
        "label": "HSR",
        "type": "text"
      },
      {
        "key": "sf",
        "label": "SF",
        "type": "text"
      },
      {
        "key": "rrn",
        "label": "RRN",
        "type": "text"
      },
      {
        "key": "grandTotal",
        "label": "Grand Total",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/item-barcode",
    "section": "Reports",
    "label": "Get Item Barcode",
    "pageType": "report",
    "collectionName": "getItemBarcode",
    "columns": [
      {
        "key": "date",
        "label": "Date",
        "type": "date"
      },
      {
        "key": "value",
        "label": "Value",
        "type": "number"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "reports/reports/performance",
    "section": "Reports",
    "label": "Performance Report",
    "pageType": "report",
    "collectionName": "performanceReport",
    "columns": [
      {
        "key": "date",
        "label": "Date",
        "type": "date"
      },
      {
        "key": "value",
        "label": "Value",
        "type": "number"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "Print"
    ],
    "permissions": [
      "reports"
    ]
  },
  {
    "moduleKey": "communication/communication/email",
    "section": "Communication",
    "label": "Email Setup",
    "pageType": "config",
    "collectionName": "emailSetup",
    "columns": [],
    "formFields": [],
    "buttons": [
      "Submit"
    ],
    "permissions": [
      "communication"
    ]
  },
  {
    "moduleKey": "communication/communication/whatsapp",
    "section": "Communication",
    "label": "Whatsapp Setup",
    "pageType": "config",
    "collectionName": "whatsappSetup",
    "columns": [],
    "formFields": [],
    "buttons": [
      "Submit"
    ],
    "permissions": [
      "communication"
    ]
  },
  {
    "moduleKey": "tools/tools/image-link",
    "section": "Tools",
    "label": "Image Link",
    "pageType": "master",
    "collectionName": "imageLink",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "code",
        "label": "Code",
        "type": "text"
      },
      {
        "key": "isActive",
        "label": "Status",
        "type": "checkbox"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "Upload"
    ],
    "permissions": [
      "tools"
    ]
  },
  {
    "moduleKey": "tools/tools/imports",
    "section": "Tools",
    "label": "Imports",
    "pageType": "master",
    "collectionName": "imports",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "code",
        "label": "Code",
        "type": "text"
      },
      {
        "key": "isActive",
        "label": "Status",
        "type": "checkbox"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "Import"
    ],
    "permissions": [
      "tools"
    ]
  },
  {
    "moduleKey": "tools/tools/item-split",
    "section": "Tools",
    "label": "Item Split",
    "pageType": "master",
    "collectionName": "itemSplit",
    "columns": [
      {
        "key": "splitCode",
        "label": "Split Code",
        "type": "text"
      },
      {
        "key": "itemCode",
        "label": "Item Code",
        "type": "text"
      },
      {
        "key": "itemName",
        "label": "Item Name",
        "type": "text"
      },
      {
        "key": "isComplete",
        "label": "Is Complete",
        "type": "text"
      },
      {
        "key": "creator",
        "label": "Creator",
        "type": "text"
      },
      {
        "key": "createdAt",
        "label": "Created At",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "Barcode Print"
    ],
    "permissions": [
      "tools"
    ]
  },
  {
    "moduleKey": "tools/tools/create-barcode",
    "section": "Tools",
    "label": "Create New Barcode",
    "pageType": "master",
    "collectionName": "createNewBarcode",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "code",
        "label": "Code",
        "type": "text"
      },
      {
        "key": "isActive",
        "label": "Status",
        "type": "checkbox"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "tools"
    ]
  },
  {
    "moduleKey": "tools/tools/item-merge",
    "section": "Tools",
    "label": "Item Merge",
    "pageType": "master",
    "collectionName": "itemMerge",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "code",
        "label": "Code",
        "type": "text"
      },
      {
        "key": "isActive",
        "label": "Status",
        "type": "checkbox"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "tools"
    ]
  },
  {
    "moduleKey": "cash-register/cashregister",
    "section": "Cash Register",
    "label": "Cash Register",
    "pageType": "special",
    "collectionName": "cashRegister",
    "columns": [],
    "formFields": [],
    "buttons": [],
    "permissions": [
      "cashRegister"
    ]
  },
  {
    "moduleKey": "cash-register/cashregister/cashin",
    "section": "Cash Register",
    "label": "Cash In",
    "pageType": "master",
    "collectionName": "cashIn",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "code",
        "label": "Code",
        "type": "text"
      },
      {
        "key": "isActive",
        "label": "Status",
        "type": "checkbox"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "cashRegister"
    ]
  },
  {
    "moduleKey": "cash-register/cashregister/cashout",
    "section": "Cash Register",
    "label": "Cash Out",
    "pageType": "master",
    "collectionName": "cashOut",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "code",
        "label": "Code",
        "type": "text"
      },
      {
        "key": "isActive",
        "label": "Status",
        "type": "checkbox"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "cashRegister"
    ]
  },
  {
    "moduleKey": "voucher/voucher/receipt-vouchers",
    "section": "Voucher",
    "label": "Receipt Vouchers",
    "pageType": "document",
    "collectionName": "receiptVouchers",
    "columns": [
      {
        "key": "voucherNumber",
        "label": "Voucher Number",
        "type": "text"
      },
      {
        "key": "date",
        "label": "Date",
        "type": "text"
      },
      {
        "key": "customerName",
        "label": "Customer Name",
        "type": "text"
      },
      {
        "key": "totalAmount",
        "label": "Total Amount",
        "type": "text"
      },
      {
        "key": "advance",
        "label": "Advance",
        "type": "text"
      },
      {
        "key": "remark",
        "label": "Remark",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "voucher"
    ]
  },
  {
    "moduleKey": "voucher/voucher/contra-vouchers",
    "section": "Voucher",
    "label": "Contra Vouchers",
    "pageType": "document",
    "collectionName": "contraVouchers",
    "columns": [
      {
        "key": "voucherNumber",
        "label": "Voucher Number",
        "type": "text"
      },
      {
        "key": "date",
        "label": "Date",
        "type": "text"
      },
      {
        "key": "toDestination",
        "label": "To (Destination)",
        "type": "text"
      },
      {
        "key": "fromSource",
        "label": "From (Source)",
        "type": "text"
      },
      {
        "key": "totalAmount",
        "label": "Total Amount",
        "type": "text"
      },
      {
        "key": "remark",
        "label": "Remark",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "voucher"
    ]
  },
  {
    "moduleKey": "voucher/voucher/payment-vouchers",
    "section": "Voucher",
    "label": "Payment Vouchers",
    "pageType": "document",
    "collectionName": "paymentVouchers",
    "columns": [
      {
        "key": "voucherNumber",
        "label": "Voucher Number",
        "type": "text"
      },
      {
        "key": "date",
        "label": "Date",
        "type": "text"
      },
      {
        "key": "supplierName",
        "label": "Supplier Name",
        "type": "text"
      },
      {
        "key": "totalAmount",
        "label": "Total Amount",
        "type": "text"
      },
      {
        "key": "settlement",
        "label": "Settlement",
        "type": "text"
      },
      {
        "key": "remark",
        "label": "Remark",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "voucher"
    ]
  },
  {
    "moduleKey": "ledger-transaction/ledgertnx",
    "section": "Ledger Transaction",
    "label": "Ledger Transaction",
    "pageType": "master",
    "collectionName": "ledgerTransaction",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "code",
        "label": "Code",
        "type": "text"
      },
      {
        "key": "isActive",
        "label": "Status",
        "type": "checkbox"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "ledgerTransaction"
    ]
  },
  {
    "moduleKey": "ledger-transaction/ledgertnx/bank-reconciliation",
    "section": "Ledger Transaction",
    "label": "Bank Reconciliation",
    "pageType": "special",
    "collectionName": "bankReconciliation",
    "columns": [],
    "formFields": [],
    "buttons": [],
    "permissions": [
      "ledgerTransaction"
    ]
  },
  {
    "moduleKey": "e-commerce/ecommerce/product",
    "section": "E-commerce",
    "label": "Products",
    "pageType": "master",
    "collectionName": "products",
    "columns": [
      {
        "key": "name",
        "label": "Name",
        "type": "text"
      },
      {
        "key": "itemCode",
        "label": "Item Code",
        "type": "text"
      },
      {
        "key": "hsnCode",
        "label": "HSN Code",
        "type": "text"
      },
      {
        "key": "group",
        "label": "Group",
        "type": "text"
      },
      {
        "key": "subGroup",
        "label": "Sub Group",
        "type": "text"
      },
      {
        "key": "stock",
        "label": "Stock",
        "type": "text"
      },
      {
        "key": "uom",
        "label": "UOM",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "eCommerce"
    ]
  },
  {
    "moduleKey": "e-commerce/ecommerce/order",
    "section": "E-commerce",
    "label": "Orders",
    "pageType": "document",
    "collectionName": "orders",
    "columns": [
      {
        "key": "docNo",
        "label": "Doc No",
        "type": "text"
      },
      {
        "key": "date",
        "label": "Date",
        "type": "date"
      },
      {
        "key": "party",
        "label": "Party",
        "type": "lookup"
      },
      {
        "key": "amount",
        "label": "Amount",
        "type": "number"
      },
      {
        "key": "status",
        "label": "Status",
        "type": "select"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete",
      "View",
      "Print"
    ],
    "permissions": [
      "eCommerce"
    ]
  },
  {
    "moduleKey": "e-commerce/ecommerce/coupon",
    "section": "E-commerce",
    "label": "Coupons",
    "pageType": "master",
    "collectionName": "coupons",
    "columns": [
      {
        "key": "code",
        "label": "Code",
        "type": "text"
      },
      {
        "key": "discountType",
        "label": "Discount Type",
        "type": "text"
      },
      {
        "key": "discountValue",
        "label": "Discount Value",
        "type": "text"
      },
      {
        "key": "minimumOrderAmount",
        "label": "Minimum Order Amount",
        "type": "text"
      },
      {
        "key": "maxCouponVaue",
        "label": "Max Coupon Vaue",
        "type": "text"
      },
      {
        "key": "expireDate",
        "label": "Expire Date",
        "type": "text"
      }
    ],
    "formFields": [],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "eCommerce"
    ]
  },
  {
    "moduleKey": "accounts/accounts/changepassword",
    "section": "Accounts",
    "label": "Change Password",
    "pageType": "config",
    "collectionName": "changePassword",
    "columns": [],
    "formFields": [],
    "buttons": [
      "Submit"
    ],
    "permissions": [
      "accounts"
    ]
  },
  {
    "moduleKey": "staff/roles",
    "section": "Staff Management",
    "label": "Roles",
    "pageType": "master",
    "collectionName": "roles",
    "columns": [
      { "key": "roleName", "label": "Role Name", "type": "text" },
      { "key": "description", "label": "Description", "type": "text" },
      { "key": "isActive", "label": "Is Active", "type": "boolean" },
      { "key": "isSystemRole", "label": "System Role", "type": "boolean" },
      { "key": "createdAt", "label": "Created At", "type": "date" }
    ],
    "formFields": [
      { "key": "roleName", "label": "Role Name", "type": "text", "required": true },
      { "key": "description", "label": "Description", "type": "textarea" },
      { "key": "isActive", "label": "Is Active", "type": "checkbox", "default": true },
      { "key": "permissions", "label": "Permissions", "type": "textarea", "helpText": "JSON format: [{module: 'inventory', actions: ['view', 'create', 'edit', 'delete']}]" }
    ],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "staff"
    ]
  },
  {
    "moduleKey": "staff/staff",
    "section": "Staff Management",
    "label": "Staff",
    "pageType": "master",
    "collectionName": "staff",
    "columns": [
      { "key": "staffCode", "label": "Staff Code", "type": "text" },
      { "key": "name", "label": "Name", "type": "text" },
      { "key": "email", "label": "Email", "type": "text" },
      { "key": "mobile", "label": "Mobile", "type": "text" },
      { "key": "role", "label": "Role", "type": "text" },
      { "key": "department", "label": "Department", "type": "text" },
      { "key": "designation", "label": "Designation", "type": "text" },
      { "key": "joiningDate", "label": "Joining Date", "type": "date" },
      { "key": "isActive", "label": "Is Active", "type": "boolean" }
    ],
    "formFields": [
      { "key": "name", "label": "Name", "type": "text", "required": true },
      { "key": "email", "label": "Email", "type": "email", "required": true },
      { "key": "mobile", "label": "Mobile", "type": "text" },
      { "key": "role", "label": "Role", "type": "reference", "referenceModule": "staff/roles", "required": true },
      { "key": "department", "label": "Department", "type": "text" },
      { "key": "designation", "label": "Designation", "type": "text" },
      { "key": "joiningDate", "label": "Joining Date", "type": "date" },
      { "key": "salary", "label": "Salary", "type": "number" },
      { "key": "allowLogin", "label": "Allow Login", "type": "checkbox", "default": false },
      { "key": "isActive", "label": "Is Active", "type": "checkbox", "default": true },
      { "key": "address.street", "label": "Street", "type": "text" },
      { "key": "address.city", "label": "City", "type": "text" },
      { "key": "address.state", "label": "State", "type": "text" },
      { "key": "address.zipCode", "label": "Zip Code", "type": "text" },
      { "key": "emergencyContact.name", "label": "Emergency Contact Name", "type": "text" },
      { "key": "emergencyContact.phone", "label": "Emergency Contact Phone", "type": "text" }
    ],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "staff"
    ]
  },
  {
    "moduleKey": "staff/salesperson",
    "section": "Staff Management",
    "label": "Sales Persons",
    "pageType": "master",
    "collectionName": "salespersons",
    "columns": [
      { "key": "spCode", "label": "SP Code", "type": "text" },
      { "key": "spName", "label": "SP Name", "type": "text" },
      { "key": "email", "label": "Email", "type": "text" },
      { "key": "mobile", "label": "Mobile", "type": "text" },
      { "key": "territory", "label": "Territory", "type": "text" },
      { "key": "salesTarget", "label": "Sales Target", "type": "number" },
      { "key": "commissionRate", "label": "Commission %", "type": "number" },
      { "key": "isDefault", "label": "Is Default", "type": "boolean" },
      { "key": "isActive", "label": "Is Active", "type": "boolean" }
    ],
    "formFields": [
      { "key": "staff", "label": "Staff", "type": "reference", "referenceModule": "staff/staff", "required": true },
      { "key": "spName", "label": "SP Name", "type": "text", "required": true },
      { "key": "email", "label": "Email", "type": "email" },
      { "key": "mobile", "label": "Mobile", "type": "text" },
      { "key": "territory", "label": "Territory", "type": "text" },
      { "key": "targetType", "label": "Target Type", "type": "select", "options": ["monthly", "quarterly", "yearly"], "default": "monthly" },
      { "key": "salesTarget", "label": "Sales Target", "type": "number", "default": 0 },
      { "key": "commissionRate", "label": "Commission Rate %", "type": "number", "default": 0 },
      { "key": "isDefault", "label": "Is Default", "type": "checkbox", "default": false },
      { "key": "isActive", "label": "Is Active", "type": "checkbox", "default": true }
    ],
    "buttons": [
      "Search",
      "Refresh",
      "Column visibility",
      "Export to CSV",
      "Export to Excel",
      "Export to PDF",
      "ADD",
      "Edit",
      "Delete"
    ],
    "permissions": [
      "staff"
    ]
  }
];

module.exports = moduleRegistrySeed;
