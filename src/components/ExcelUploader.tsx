import React, { useState } from "react";
import { Upload, FileCode, CheckCircle, RefreshCw, AlertCircle, HelpCircle } from "lucide-react";
import { MasterConfig } from "../types";
import {
  parseCategoryExcel,
  parsePriorityExcel,
  parseStatusExcel,
  generateMockSpreadsheet,
  DEFAULT_CATEGORIES,
  DEFAULT_PRIORITIES,
  DEFAULT_STATUSES,
} from "../utils/excelParser";

interface Props {
  config: MasterConfig;
  onConfigChange: (newConfig: MasterConfig) => void;
}

export default function ExcelUploader({ config, onConfigChange }: Props) {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [errorStatus, setErrorStatus] = useState<{ [key: string]: string | null }>({});
  const [successStatus, setSuccessStatus] = useState<{ [key: string]: string | null }>({
    categories: "Active: Regional Standard Dataset Loaded",
    priorities: "Active: Standard Priorities Loaded",
    statuses: "Active: Operational Status Guidelines Loaded",
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "categories" | "priorities" | "statuses"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading((prev) => ({ ...prev, [type]: true }));
    setErrorStatus((prev) => ({ ...prev, [type]: null }));

    try {
      if (type === "categories") {
        const parsedMap = await parseCategoryExcel(file);
        onConfigChange({
          ...config,
          categories: parsedMap,
        });
        setSuccessStatus((prev) => ({
          ...prev,
          categories: `File parsed. Imported ${Object.keys(parsedMap).length} categories.`,
        }));
      } else if (type === "priorities") {
        const parsedList = await parsePriorityExcel(file);
        onConfigChange({
          ...config,
          priorities: parsedList,
        });
        setSuccessStatus((prev) => ({
          ...prev,
          priorities: `File parsed. Imported ${parsedList.length} priorities.`,
        }));
      } else if (type === "statuses") {
        const parsedList = await parseStatusExcel(file);
        onConfigChange({
          ...config,
          statuses: parsedList,
        });
        setSuccessStatus((prev) => ({
          ...prev,
          statuses: `File parsed. Imported ${parsedList.length} statuses.`,
        }));
      }
    } catch (err: any) {
      console.error(err);
      setErrorStatus((prev) => ({
        ...prev,
        [type]: err.message || "File parsing failed. Column mismatch.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const resetToDefault = (type: "categories" | "priorities" | "statuses") => {
    if (type === "categories") {
      onConfigChange({ ...config, categories: DEFAULT_CATEGORIES });
      setSuccessStatus((prev) => ({ ...prev, categories: "Active: Regional Standard Dataset Loaded" }));
      setErrorStatus((prev) => ({ ...prev, categories: null }));
    } else if (type === "priorities") {
      onConfigChange({ ...config, priorities: DEFAULT_PRIORITIES });
      setSuccessStatus((prev) => ({ ...prev, priorities: "Active: Standard Priorities Loaded" }));
      setErrorStatus((prev) => ({ ...prev, priorities: null }));
    } else if (type === "statuses") {
      onConfigChange({ ...config, statuses: DEFAULT_STATUSES });
      setSuccessStatus((prev) => ({ ...prev, statuses: "Active: Operational Status Guidelines Loaded" }));
      setErrorStatus((prev) => ({ ...prev, statuses: null }));
    }
  };

  return (
    <div id="excel-uploader-root" className="bg-white rounded-[6px] border border-[#D9E2EC] overflow-hidden">
      
      {/* SAP Fiori Style Admin Trigger Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-[#F5F7FA] hover:bg-slate-100 transition-colors cursor-pointer text-left font-sans"
      >
        <div className="flex items-center space-x-2.5">
          <FileCode className="h-4.5 w-4.5 text-[#005B96] shrink-0" />
          <div>
            <h3 className="font-bold text-[#003366] text-xs uppercase tracking-wider font-sans">
              System Admin Standards Integration (Excel Datasets Controller)
            </h3>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
              Administrate active classifications, priority, and ticket statuses standards by uploading spreadsheet templates (.xlsx / .xls).
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-[#003366] font-sans border border-[#D9E2EC] bg-white px-2.5 py-1 rounded-[4px]">
          {isOpen ? "CLOSE CONTROLS" : "MANAGE MASTER STANDARDS"}
        </span>
      </button>

      {/* Main Administrative Control Desk */}
      {isOpen && (
        <div className="p-4 border-t border-[#D9E2EC] bg-white animate-fade-in font-sans">
          
          <div className="mb-4 p-3 bg-slate-50 rounded-[4px] border border-[#D9E2EC] flex items-start space-x-3 text-xs text-slate-600">
            <HelpCircle className="h-4 w-4 text-[#005B96] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 mb-0.5">Corporate Spreadsheet Schema Specifications:</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                <li><strong>Categories File:</strong> Requires worksheet columns named <code>Category</code> and <code>Subcategory</code> respectively in tab one.</li>
                <li><strong>Priorities / Status Files:</strong> Simple single-column data arrays containing listed values inside tab one.</li>
                <li><strong>No document on file?</strong> Use the <code>Download Template</code> option to retrieve standard compatible excel drafts.</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Column 1: Complaint Categories */}
            <div className="flex flex-col border border-[#D9E2EC] rounded-[4px] p-3 bg-slate-50/30">
              <span className="text-[12px] font-bold text-[#003366] uppercase tracking-wide block mb-1">
                1. CRM Classifications
              </span>
              <p className="text-[11px] text-slate-500 font-sans mb-3 min-h-[28px]">
                Populates compliant Category and corresponding Subcategory options.
              </p>

              {/* Status Bar */}
              <div className="mb-3">
                {errorStatus.categories ? (
                  <div className="flex items-center space-x-1.5 p-1.5 bg-red-50 text-[#D32F2F] text-[11px] rounded-[3px] border border-red-200">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-mono truncate">{errorStatus.categories}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 p-1.5 bg-emerald-50 text-[#2E7D32] text-[11px] rounded-[3px] border border-emerald-200">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{successStatus.categories}</span>
                  </div>
                )}
              </div>

              {/* Drag n Drop Upload Area */}
              <div className="mt-auto space-y-2">
                <label className="flex flex-col items-center justify-center p-2.5 border border-dashed border-[#D9E2EC] hover:border-[#005B96] rounded-[4px] bg-white hover:bg-slate-50 cursor-pointer transition-colors text-center">
                  <Upload className="h-4 w-4 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-700 font-sans">
                    {loading.categories ? "Processing..." : "Select Categories File"}
                  </span>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => handleFileUpload(e, "categories")}
                    disabled={loading.categories}
                    className="hidden"
                  />
                </label>

                <div className="flex justify-between items-center text-[11px] pt-1 font-semibold">
                  <button
                    type="button"
                    onClick={() => generateMockSpreadsheet("category")}
                    className="text-[#005B96] hover:text-[#003366] hover:underline"
                  >
                    Download Template
                  </button>
                  <button
                    type="button"
                    onClick={() => resetToDefault("categories")}
                    className="text-slate-500 hover:text-slate-800 flex items-center space-x-0.5"
                  >
                    <RefreshCw className="h-2.5 w-2.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Column 2: Priorities */}
            <div className="flex flex-col border border-[#D9E2EC] rounded-[4px] p-3 bg-slate-50/30">
              <span className="text-[12px] font-bold text-[#003366] uppercase tracking-wide block mb-1">
                2. SLA Priorities
              </span>
              <p className="text-[11px] text-slate-500 font-sans mb-3 min-h-[28px]">
                Configures operational urgency parameters (e.g., ASAP, High).
              </p>

              {/* Status Bar */}
              <div className="mb-3">
                {errorStatus.priorities ? (
                  <div className="flex items-center space-x-1.5 p-1.5 bg-red-50 text-[#D32F2F] text-[11px] rounded-[3px] border border-red-200">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-mono truncate">{errorStatus.priorities}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 p-1.5 bg-emerald-50 text-[#2E7D32] text-[11px] rounded-[3px] border border-emerald-200">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{successStatus.priorities}</span>
                  </div>
                )}
              </div>

              {/* Drag n Drop Upload Area */}
              <div className="mt-auto space-y-2">
                <label className="flex flex-col items-center justify-center p-2.5 border border-dashed border-[#D9E2EC] hover:border-[#005B96] rounded-[4px] bg-white hover:bg-slate-50 cursor-pointer transition-colors text-center">
                  <Upload className="h-4 w-4 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-700 font-sans">
                    {loading.priorities ? "Processing..." : "Select Priorities File"}
                  </span>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => handleFileUpload(e, "priorities")}
                    disabled={loading.priorities}
                    className="hidden"
                  />
                </label>

                <div className="flex justify-between items-center text-[11px] pt-1 font-semibold">
                  <button
                    type="button"
                    onClick={() => generateMockSpreadsheet("priority")}
                    className="text-[#005B96] hover:text-[#003366] hover:underline"
                  >
                    Download Template
                  </button>
                  <button
                    type="button"
                    onClick={() => resetToDefault("priorities")}
                    className="text-slate-500 hover:text-slate-800 flex items-center space-x-0.5"
                  >
                    <RefreshCw className="h-2.5 w-2.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Column 3: Statuses */}
            <div className="flex flex-col border border-[#D9E2EC] rounded-[4px] p-3 bg-slate-50/30">
              <span className="text-[12px] font-bold text-[#003366] uppercase tracking-wide block mb-1">
                3. Lifecycle States
              </span>
              <p className="text-[11px] text-slate-500 font-sans mb-3 min-h-[28px]">
                Specifies ticket stage values (Open, Pending, Resolved).
              </p>

              {/* Status Bar */}
              <div className="mb-3">
                {errorStatus.statuses ? (
                  <div className="flex items-center space-x-1.5 p-1.5 bg-red-50 text-[#D32F2F] text-[11px] rounded-[3px] border border-red-200">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-mono truncate">{errorStatus.statuses}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 p-1.5 bg-emerald-50 text-[#2E7D32] text-[11px] rounded-[3px] border border-emerald-200">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{successStatus.statuses}</span>
                  </div>
                )}
              </div>

              {/* Drag n Drop Upload Area */}
              <div className="mt-auto space-y-2">
                <label className="flex flex-col items-center justify-center p-2.5 border border-dashed border-[#D9E2EC] hover:border-[#005B96] rounded-[4px] bg-white hover:bg-slate-50 cursor-pointer transition-colors text-center">
                  <Upload className="h-4 w-4 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-700 font-sans">
                    {loading.statuses ? "Processing..." : "Select Status File"}
                  </span>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => handleFileUpload(e, "statuses")}
                    disabled={loading.statuses}
                    className="hidden"
                  />
                </label>

                <div className="flex justify-between items-center text-[11px] pt-1 font-semibold">
                  <button
                    type="button"
                    onClick={() => generateMockSpreadsheet("status")}
                    className="text-[#005B96] hover:text-[#003366] hover:underline"
                  >
                    Download Template
                  </button>
                  <button
                    type="button"
                    onClick={() => resetToDefault("statuses")}
                    className="text-slate-500 hover:text-slate-800 flex items-center space-x-0.5"
                  >
                    <RefreshCw className="h-2.5 w-2.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
