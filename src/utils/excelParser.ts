import * as XLSX from "xlsx";
import { MasterConfig } from "../types";

export const DEFAULT_CATEGORIES: { [category: string]: string[] } = {
  "Cylinder Leakage & Safety": [
    "Valve leakage from cylinder head",
    "Regulator joint leakage",
    "Body leakage / pinhole crack",
    "O-Ring damage/missing",
    "Defective/missing safety protective cap",
    "Hot plate / burner gas leakage",
    "Rubber tube/hose cracked/damaged"
  ],
  "Refill Delivery Issues": [
    "Under-weight cylinder delivered",
    "Delivery delay beyond 48 hours",
    "Overcharging above retail selling price",
    "Delivery staff misconduct / rude behavior",
    "Refusal to deliver to top floors",
    "Fake delivery SMS without physical cylinder",
    "Refill card/blue-book entry missing"
  ],
  "Distributor Service Quality": [
    "Forced purchase of insurance/gas stoves",
    "Office staff uncooperative or rude",
    "Refusal to book consumer refill request",
    "Delay in deposit refund for connection cancellation",
    "Distributor phone number always busy/unreachable",
    "Unscheduled closure of distributor office"
  ],
  "Subsidy & Billing Issues": [
    "DBTL/PAHAL subsidy not credited to bank account",
    "Double bill amount debited from online transaction",
    "Subsidy credited to incorrect bank account",
    "Incorrect tariff applied / Commercial versus Domestic bill"
  ],
  "New Connection & Equipment Transfer": [
    "Excessive delay in releasing new connection",
    "Forced premium accessory sale by showroom staff",
    "Unfair security deposit value requested",
    "Delay in inter-distributor connection transfer"
  ],
  "Transporter & Bulk Issues": [
    "Bulk bullet tanker valve integrity failure",
    "Logistical delays in commercial storage tanks",
    "Price discrepancy on high-volume commercial invoices"
  ]
};

export const DEFAULT_PRIORITIES = ["1-ASAP", "2-High", "3-Medium"];

export const DEFAULT_STATUSES = ["Open", "In Progress", "Closed"];

export const DEFAULT_MASTER_CONFIG: MasterConfig = {
  categories: DEFAULT_CATEGORIES,
  priorities: DEFAULT_PRIORITIES,
  statuses: DEFAULT_STATUSES,
};

/**
 * Robustly parses Category and Subcategory Excel sheet
 */
export async function parseCategoryExcel(file: File): Promise<{ [category: string]: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonRows = XLSX.utils.sheet_to_json<any>(worksheet);

        if (!jsonRows || jsonRows.length === 0) {
          throw new Error("The uploaded spreadsheet is empty.");
        }

        // Find keys corresponding to Category and Subcategory
        const firstRow = jsonRows[0];
        let catKey = "";
        let subKey = "";

        for (const key of Object.keys(firstRow)) {
          const lKey = key.toLowerCase();
          if (lKey.includes("sub-category") || lKey.includes("subcategory") || lKey.includes("sub category")) {
            subKey = key;
          } else if (lKey.includes("category")) {
            catKey = key;
          }
        }

        // Fallback to first two headers if unable to discover
        const headers = Object.keys(firstRow);
        if (!catKey && headers.length > 0) catKey = headers[0];
        if (!subKey && headers.length > 1) subKey = headers[1];

        if (!catKey || !subKey) {
          throw new Error("Could not automatically locate Category/Subcategory columns in this spreadsheet.");
        }

        const map: { [category: string]: string[] } = {};
        for (const row of jsonRows) {
          const rawCat = row[catKey];
          const rawSub = row[subKey];

          if (rawCat) {
            const catStr = String(rawCat).trim();
            const subStr = rawSub ? String(rawSub).trim() : "";

            if (!map[catStr]) {
              map[catStr] = [];
            }
            if (subStr && !map[catStr].includes(subStr)) {
              map[catStr].push(subStr);
            }
          }
        }

        resolve(map);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("File reading error."));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parses Priority Excel sheet
 */
export async function parsePriorityExcel(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonRows = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });

        const list: string[] = [];
        for (const row of jsonRows) {
          if (Array.isArray(row)) {
            for (const val of row) {
              if (val) {
                const sVal = String(val).trim();
                if (sVal && !list.includes(sVal) && sVal !== "Priority" && sVal !== "priority") {
                  list.push(sVal);
                }
              }
            }
          }
        }

        if (list.length === 0) {
          throw new Error("Could not find any items under columns in Priority sheet.");
        }
        resolve(list);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("File reading error."));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parses SR Status Excel sheet
 */
export async function parseStatusExcel(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonRows = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });

        const list: string[] = [];
        for (const row of jsonRows) {
          if (Array.isArray(row)) {
            for (const val of row) {
              if (val) {
                const sVal = String(val).trim();
                if (sVal && !list.includes(sVal) && sVal !== "Status" && sVal !== "status" && sVal !== "SR Status" && sVal !== "sr status") {
                  list.push(sVal);
                }
              }
            }
          }
        }

        if (list.length === 0) {
          throw new Error("Could not find any status cells in SR Status file.");
        }
        resolve(list);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("File reading error."));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Generates and downloads a dummy template matching the expected excel layout
 */
export function generateMockSpreadsheet(type: "category" | "priority" | "status") {
  const wb = XLSX.utils.book_new();
  let wsData: any[] = [];
  let name = "";

  if (type === "category") {
    name = "Complaint Category and Subcategory.xlsx";
    wsData = [
      { "Complaint Category": "Safety Hazard / Emergency", "Complaint Subcategory": "High Pressure Regulator Leak" },
      { "Complaint Category": "Safety Hazard / Emergency", "Complaint Subcategory": "Cylinder Wall Micro Crack" },
      { "Complaint Category": "Safety Hazard / Emergency", "Complaint Subcategory": "Defective Burner Ignition Valve" },
      { "Complaint Category": "Delivery Disruption", "Complaint Subcategory": "Refill Delay Over 72 Hours" },
      { "Complaint Category": "Delivery Disruption", "Complaint Subcategory": "Commercial Tanker Delay" },
      { "Complaint Category": "Subsidy & Billing", "Complaint Subcategory": "Bank Aadhaar link status error" },
      { "Complaint Category": "Subsidy & Billing", "Complaint Subcategory": "Incorrect domestic ledger charges" },
    ];
  } else if (type === "priority") {
    name = "Priority.xlsx";
    wsData = [
      ["Priority"],
      ["1-ASAP"],
      ["2-High"],
      ["3-Medium"],
      ["4-Routine"]
    ];
  } else {
    name = "SR Status.xlsx";
    wsData = [
      ["SR Status"],
      ["Open"],
      ["In Progress"],
      ["Waiting for Distributor"],
      ["Closed"]
    ];
  }

  const ws = type === "category" ? XLSX.utils.json_to_sheet(wsData) : XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, name);
}
