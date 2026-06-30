import React, { useState, useEffect } from "react";
import { 
  Landmark, 
  User, 
  HelpCircle, 
  Search, 
  FileText, 
  Activity, 
  History, 
  ExternalLink, 
  Trash2, 
  FileSpreadsheet, 
  ChevronRight,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Award,
  Sparkles,
  Check,
  Copy,
  ArrowRight,
  CheckSquare,
  ThumbsDown,
  FileDown,
  Database,
  Briefcase
} from "lucide-react";
import ExcelUploader from "./components/ExcelUploader";
import ComplaintForm from "./components/ComplaintForm";
import ManagementDashboard from "./components/ManagementDashboard";
import EmergencyEscalationModule from "./components/EmergencyEscalationModule";
import { DEFAULT_MASTER_CONFIG } from "./utils/excelParser";
import { ComplaintData, GenerationResult, MasterConfig, HistoryRecord } from "./types";

// IndianOil Vector Emblem conforming to the uploaded design specification
function IndianOilLogo() {
  return (
    <div id="indian-oil-logo-container" className="flex flex-col items-center justify-center shrink-0">
      <svg 
        id="indian-oil-svg"
        className="w-[54px] h-[54px]" 
        viewBox="0 0 160 160" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="inner-circle-clip">
            <circle cx="80" cy="80" r="59" />
          </clipPath>
        </defs>

        {/* Outer deep blue ring */}
        <circle cx="80" cy="80" r="76" fill="#012169" />
        
        {/* White ring gap */}
        <circle cx="80" cy="80" r="71" fill="#FFFFFF" />
        
        {/* Inner thin deep blue circle boundary */}
        <circle cx="80" cy="80" r="62" fill="#012169" />
        
        {/* Vibrant saffron/orange center */}
        <circle cx="80" cy="80" r="59" fill="#FF6900" />
        
        {/* Horizontal deep blue banner, clipped to the inner circle */}
        <g clipPath="url(#inner-circle-clip)">
          <rect x="15" y="58" width="130" height="44" fill="#012169" />
        </g>
        
        {/* Devanagari text "इंडियनऑयल" in white */}
        <text 
          x="80" 
          y="86" 
          fill="#FFFFFF" 
          fontSize="16" 
          fontWeight="900" 
          textAnchor="middle" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          letterSpacing="0.2"
        >
          इंडियनऑयल
        </text>
      </svg>
      <span className="text-[10px] font-black uppercase tracking-wider text-white mt-1 font-sans">
        IndianOil
      </span>
    </div>
  );
}

// LPG Historical database search simulator for similarity matching (Point 9 & 14)
const getSimilarCases = (category: string) => {
  const norm = category.toLowerCase();
  if (norm.includes("leak") || norm.includes("safety") || norm.includes("fire")) {
    return [
      { id: "LPG-4201", desc: "Valve seal broken upon seal-cap removal. Safety mechanic arrived in 18 minutes. Status: Closed.", duration: "1.2 Hrs", action: "Dispatched panic crew" },
      { id: "LPG-9902", desc: "Loose head valve thread on commercial cylinder. Escalated to Area Officer.", duration: "3.5 Hrs", action: "Cylinder replaced" },
      { id: "LPG-1182", desc: "Consumer reports vapor release in kitchen. Safety alert protocol triggered instantly.", duration: "0.8 Hrs", action: "O-ring replaced" }
    ];
  }
  if (norm.includes("delivery") || norm.includes("delayed") || norm.includes("refill")) {
    return [
      { id: "LPG-3312", desc: "Delays due to local logistics heavy rain backlog. Backlog cleared via depot shifts.", duration: "1.5 Days", action: "Alternative vehicle routed" },
      { id: "LPG-7119", desc: "Digital billing ledger mismatch on fast payment. Credit verified with bank gateway.", duration: "4.0 Hrs", action: "Gateway sync manual" },
      { id: "LPG-4411", desc: "System bottleneck on distributor portal. Booked and invoiced manually on OMC.", duration: "6.0 Hrs", action: "Manual clearance" }
    ];
  }
  if (norm.includes("subsidy") || norm.includes("billing") || norm.includes("price") || norm.includes("payment")) {
    return [
      { id: "LPG-1011", desc: "PAHAL DBTL missing due to regional bank merging. Aadhaar seed re-verified.", duration: "1.0 Days", action: "NPCI seed updated" },
      { id: "LPG-5678", desc: "Subsidy sent to inactive bank account listed. Linkage updated on portal.", duration: "2.0 Days", action: "Bank route updated" },
      { id: "LPG-2211", desc: "Aadhaar mismatch between bank ledger and LPG card. Corrected with local e-KYC.", duration: "1.5 Days", action: "eKYC updated" }
    ];
  }
  if (norm.includes("overcharging") || norm.includes("overpricing") || norm.includes("charge")) {
    return [
      { id: "LPG-8822", desc: "Overcharging by delivery boy. Penalty of INR 5000 levied on agency ledger.", duration: "8.0 Hrs", action: "Disciplinary action" },
      { id: "LPG-4112", desc: "Excess carriage cash demanded at top floor. Distributor instructed to credit back.", duration: "5.5 Hrs", action: "LPG ledger credited" },
      { id: "LPG-3904", desc: "Delivery boy demanded carriage fee on ground floor. Handled via warning pin.", duration: "2.0 Hrs", action: "Delivery boy suspended" }
    ];
  }
  // Default general cases: Behaviour/Transfer/Regulator
  return [
    { id: "LPG-9014", desc: "Transfer SV pending due to regional office database latency. TV issued manually.", duration: "12.0 Hrs", action: "TV manually issued" },
    { id: "LPG-6011", desc: "Consumer reported rude distributor staff behaviour. Warned distributor manager.", duration: "4.0 Hrs", action: "Formal warning letter" },
    { id: "LPG-8241", desc: "Regulator replacement flatly refused by dealership. Regulator replaced in 1 hr.", duration: "1.0 Hrs", action: "Direct replacement" }
  ];
};

export default function App() {
  const [masterConfig, setMasterConfig] = useState<MasterConfig>(DEFAULT_MASTER_CONFIG);
  const [activeTab, setActiveTab] = useState<"customer" | "internal" | "history">("customer");
  
  // Executive Demonstration & Operation Modes
  const [viewMode, setViewMode] = useState<"officer" | "management">("officer");
  const [customerLang, setCustomerLang] = useState<"en" | "hi">("en");
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [crmStatus, setCrmStatus] = useState<"idle" | "sending" | "success">("idle");
  const [crmCode, setCrmCode] = useState("");

  const isSafetyComplaint = () => {
    const keywords = [
      "leakage", "gas leakage", "cylinder leakage", "regulator leakage", 
      "valve leakage", "smell of gas", "fire", "explosion", "safety", "emergency"
    ];
    const cat = (formData.category || "").toLowerCase();
    const sub = (formData.subCategory || "").toLowerCase();
    
    return keywords.some(kw => cat.includes(kw) || sub.includes(kw));
  };

  // Animated executive counters state
  const [counts, setCounts] = useState({
    processed: 1000,
    avgHrs: 15.0,
    accuracy: 75,
    saved: 20,
    open: 1300,
  });

  // Animated counters ticking effect on initial mount
  useEffect(() => {
    const duration = 1200; // ms
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutQuad animation curve
      const ease = progress * (2 - progress);

      setCounts({
        processed: Math.floor(1000 + (1248 - 1000) * ease),
        avgHrs: parseFloat((15.0 + (4.2 - 15.0) * ease).toFixed(1)),
        accuracy: Math.floor(75 + (92 - 75) * ease),
        saved: Math.floor(20 + (68 - 20) * ease),
        open: Math.floor(1300 + (1541 - 1300) * ease),
      });

      if (progress === 1) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Enterprise default record for quick Sales Officer operations demonstration
  const [formData, setFormData] = useState<ComplaintData>({
    customerId: "CID489953",
    distributorName: "Shree Krishna Indane Gas Agency",
    consumerName: "Rajeev Kumar Prasad",
    consumerNumber: "558902123",
    mobileNumber: "9876543210",
    srNumber: "SR-9011-LPG",
    dateOpened: "2026-06-19",
    assignedTo: "Manish Kumar Sharma (Sales Officer)",
    category: "Cylinder Leakage & Safety",
    subCategory: "Valve leakage from cylinder head",
    priority: "1-ASAP",
    srStatus: "Open",
    complaintDescription: "URGENT SAFETY EMERGENCY: I just received a domestic 14.2kg LPG cylinder. Upon removing the safety cap, there is a continuous, loud whistling sound and a strong smell of gas coming from the top valve pin. The cylinder is stored in a well-ventilated yard right now but we are scared to connect the regulator. Please send a safety mechanic or emergency officer immediately! We have turned off all electrical devices.",
  });

  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Real active session history record logger
  const [historyLogs, setHistoryLogs] = useState<HistoryRecord[]>([]);

  // Calculate dynamic meta metrics for the operations portal
  const [complaintAge, setComplaintAge] = useState<string>("0 Days (Immediate)");
  const [prevComplaints, setPrevComplaints] = useState<number>(2);
  const [distributorSla, setDistributorSla] = useState<string>("94.2% (Grade A)");

  useEffect(() => {
    // Dynamic recalculation of Complaint Age based on system baseline date (2026-06-19)
    if (!formData.dateOpened) {
      setComplaintAge("N/A");
      return;
    }
    const baseline = new Date("2026-06-19");
    const openDate = new Date(formData.dateOpened);
    const diffTime = Math.abs(baseline.getTime() - openDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (formData.dateOpened === "2026-06-19") {
      setComplaintAge("0 Days (Same-day Ticket)");
    } else {
      setComplaintAge(`${diffDays} Days Active`);
    }

    // Dynamic Previous Complaints Count based on CID
    if (formData.customerId === "CID489953") {
      setPrevComplaints(2);
      setDistributorSla("94.2% (SLA Grade A)");
    } else if (formData.customerId === "CID331201") {
      setPrevComplaints(1);
      setDistributorSla("88.5% (SLA Grade B)");
    } else if (formData.customerId === "CID104772") {
      setPrevComplaints(0);
      setDistributorSla("91.0% (SLA Grade A)");
    } else if (!formData.customerId) {
      setPrevComplaints(0);
      setDistributorSla("N/A");
    } else {
      // Deterministic pseudo-randomness for mock user input
      const sum = formData.customerId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      setPrevComplaints(sum % 4);
      setDistributorSla(`${75 + (sum % 21)}.8% (SLA Grade ${sum % 2 === 0 ? "B" : "C"})`);
    }
  }, [formData.dateOpened, formData.customerId]);

  // Reset CRM status and feedback code back to normal when the complaint details are changed or reset for testing
  useEffect(() => {
    setCrmStatus("idle");
    setCrmCode("");
  }, [formData]);

  const handleGenerateReply = async () => {
    if (!formData.complaintDescription.trim()) {
      setError("Complaint description cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Portal response failure! Status: ${response.status}`);
      }

      const data: GenerationResult = await response.json();
      setGenerationResult(data);
      
      // Auto-append recommendation result to Tab 3: Resolution History log cache
      const newHistoryItem: HistoryRecord = {
        id: "REC-" + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }) + " UTC",
        srNumber: formData.srNumber || "SR-NEW",
        consumerName: formData.consumerName || "General Complainant",
        category: formData.category || "Classified Case",
        customerResponse: data.customerResponse,
        probableCause: data.probableCause,
        suggestedAction: data.suggestedAction,
        escalationRequired: data.escalationRequired,
        confidenceLevel: data.confidenceLevel,
        priority: formData.priority,
        srStatus: formData.srStatus,
      };

      setHistoryLogs((prev) => [newHistoryItem, ...prev]);
      
      // Auto move active tab to customer draft for immediate action
      setActiveTab("customer");
    } catch (err: any) {
      console.error("[ERROR] Engine API query dispatch failure:", err);
      setError(err.message || "Failed to establish a duplex connection with the OMC generation backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      customerId: "",
      distributorName: "",
      consumerName: "",
      consumerNumber: "",
      mobileNumber: "",
      srNumber: "",
      dateOpened: "2026-06-19",
      assignedTo: "Manish Kumar Sharma (Sales Officer)",
      category: "",
      subCategory: "",
      priority: "2-High",
      srStatus: "Open",
      complaintDescription: "",
    });
    setGenerationResult(null);
    setError(null);
  };

  // Immediate plain text file export downloads for official portal standard
  const handleExportText = () => {
    if (!generationResult) return;
    const bodyText = `OIL MARKETING COMPANY COMPLAINT RESOLUTION FILE\n` +
      `==================================================\n` +
      `SR Number: ${formData.srNumber}\n` +
      `Consumer Name: ${formData.consumerName}\n` +
      `Customer ID: ${formData.customerId}\n` +
      `Date Resolved: 2026-06-19\n` +
      `SLA Priority: ${formData.priority}\n` +
      `Status: ${formData.srStatus}\n` +
      `--------------------------------------------------\n\n` +
      `CUSTOMER OUTGOING RESPONSE:\n` +
      `"${generationResult.customerResponse}"\n\n` +
      `--------------------------------------------------\n` +
      `INTERNAL CLASSIFIED AUDIT NOTE:\n` +
      `- Probable Root Cause: ${generationResult.probableCause}\n` +
      `- Recommended Resolution Plan: ${generationResult.suggestedAction}\n` +
      `- Escalation Flag Triggered: ${generationResult.escalationRequired}\n` +
      `- Recommended Priority Flag: ${generationResult.priority}\n` +
      `- Technical Resolution Confidence: ${generationResult.confidenceLevel}\n` +
      `==================================================\n` +
      `Generated via Regional Resolution Recommendation Engine.`;
    
    const element = document.createElement("a");
    const file = new Blob([bodyText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `OMC-Resolution-${formData.srNumber || "DRAFT"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendToCRM = (sr: string) => {
    setCrmStatus("sending");
    setTimeout(() => {
      setCrmStatus("success");
      setCrmCode(`OMC-CRM-${sr || "NEW"}-${Math.floor(1000 + Math.random() * 9000)}-TICKET-TRANSMITTED-OK`);
    }, 1200);
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#F5F7FA] text-[#1F2937] font-sans antialiased text-[14px]">
      
      {/* Sticky Header Wrapper holding Header, KPI Bar, and Status/Timeline Bar */}
      <div id="sticky-portal-header" className="sticky top-0 z-50 shadow-md">
        {/* 1. Official PSU Corporate Main Header */}
        <header className="bg-[#003366] border-b border-[#002244] text-white shadow-md">
          <div className="max-w-[1600px] mx-auto px-5 py-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            
            {/* Brand Left Header with official IndianOil PSU styling & Demo Tagline (Point 15) */}
            <div className="flex items-start space-x-4">
              <IndianOilLogo />
              <div>
                <h1 className="text-[22px] font-black font-sans tracking-tight text-white flex items-center space-x-2">
                  <span>LPG Customer Complaint Resolution Portal</span>
                </h1>
                <div className="mt-1 space-y-0.5">
                  <p className="text-[12px] text-amber-400 font-bold font-sans tracking-wide">
                    AI-Assisted Complaint Resolution Engine for LPG Customer Service
                  </p>
                  <p className="text-[10px] text-slate-300 font-sans font-medium">
                    Reducing Resolution Time • Improving Customer Satisfaction • Supporting Field Sales Officers
                  </p>
                </div>
              </div>
            </div>
   
            {/* View Mode Switcher Panel (Point 12) & Stats info on Right */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-sans">
              
              {/* Real Interactive Demo State Toggle */}
              <div className="flex items-center bg-[#002244] border border-[#004488] p-1 rounded-[4px] space-x-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setViewMode("officer")}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-[3px] uppercase transition-all tracking-wider cursor-pointer ${
                    viewMode === "officer"
                      ? "bg-[#FF6900] text-white shadow"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  Sales Officer View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("management")}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-[3px] uppercase transition-all tracking-wider cursor-pointer ${
                    viewMode === "management"
                      ? "bg-[#FF6900] text-white shadow"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  Management View
                </button>
              </div>

              <div className="bg-[#002244] border border-[#004488] px-3 py-2 rounded-[4px] text-slate-200 hidden sm:block font-sans">
                <span className="text-slate-400">Officer Profile: </span>
                <span className="font-semibold text-white">M. K. Sharma</span>
              </div>
              
              <button
                onClick={handleResetForm}
                title="Reset current profile and work area"
                className="px-2.5 py-2 border border-slate-500 hover:border-white text-slate-200 hover:text-white rounded-[4px] bg-transparent cursor-pointer transition-all uppercase tracking-wider text-[10px] font-bold"
              >
                Reset Session
              </button>
            </div>
   
          </div>
        </header>

        {/* 1. Executive KPI Bar with Animated Counters (Point 1) - Visible only in Management View */}
        {viewMode === "management" && (
          <section className="bg-slate-900 border-b border-[#002244] text-white py-3.5 px-5">
            <div className="max-w-[1600px] mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="border-r border-slate-800 last:border-0 pr-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Processed Today</span>
                  <span className="text-[20px] font-black text-white font-mono select-none">{counts.processed.toLocaleString()} Cases</span>
                  <span className="block text-[9px] text-emerald-400 font-semibold mt-0.5">▲ +12.4% vs last week</span>
                </div>
                
                <div className="border-r border-slate-800 last:border-0 pr-2 md:pl-4">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Resolution Time</span>
                  <span className="text-[20px] font-black text-white font-mono select-none">{counts.avgHrs} Hours</span>
                  <span className="block text-[9px] text-[#FF6900] font-semibold mt-0.5">⚡ -68% AI Efficiency Gain</span>
                </div>
                
                <div className="border-r border-slate-800 last:border-0 pr-2 md:pl-4">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Accuracy Rating</span>
                  <span className="text-[20px] font-black text-emerald-400 font-mono select-none">{counts.accuracy}% Score</span>
                  <span className="block text-[9px] text-slate-400 font-semibold mt-0.5">99.9% System SLA Uptime</span>
                </div>
                
                <div className="border-r border-slate-800 last:border-0 pr-2 md:pl-4">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Time Saved/Ticket</span>
                  <span className="text-[20px] font-black text-emerald-400 font-mono select-none">{counts.saved}% Time saved</span>
                  <span className="block text-[9px] text-emerald-400 font-semibold mt-0.5">⚡ Under 45 seconds ticket draft</span>
                </div>
                
                <div className="last:border-0 md:pl-4 col-span-2 md:col-span-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open Backlog tickets</span>
                  <span className="text-[20px] font-black text-red-400 font-mono select-none">{counts.open} SRs</span>
                  <span className="block text-[9px] text-red-400 font-semibold mt-0.5">● Active SLA Backlog Queue</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 2. Top Portal Service Bar (Status and Metrics Timeline) */}
        <section className="bg-white border-b border-[#D9E2EC] py-2.5 px-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Active record header meta */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs">
              <div className="text-slate-500 flex items-center">
                <span className="uppercase text-[10px] tracking-wider mr-2 font-bold text-slate-400">Selected Case:</span>
                <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-[3px] border border-slate-200">
                  {formData.srNumber || "DRAFT"}
                </span>
              </div>
              <div className="h-4 w-[1px] bg-slate-300 hidden md:block"></div>
              <div className="flex items-center text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                <span>Calculated Ticket Age: <span className="font-semibold text-slate-900">{complaintAge}</span></span>
              </div>
              <div className="h-4 w-[1px] bg-slate-300 hidden md:block"></div>
              <div className="flex items-center text-slate-600">
                <AlertOctagon className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                <span>Prior Records for Complainant: <span className="font-semibold text-[#D32F2F]">{prevComplaints} Active</span></span>
              </div>
              <div className="h-4 w-[1px] bg-slate-300 hidden md:block"></div>
              <div className="flex items-center text-slate-600" title="Distributor Service Level Agreement performance score">
                <Award className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                <span>Distributor Performance Score: <span className="font-semibold text-[#2E7D32]">{distributorSla}</span></span>
              </div>
            </div>

            {/* Core Service ticket sequence timeline */}
            <div className="flex items-center text-[11px] font-semibold text-slate-400">
              <span className={`${formData.srStatus === "Open" ? "text-[#003366] font-bold" : ""}`}>1. Record Open</span>
              <ChevronRight className="w-3 h-3 mx-1 text-slate-300" />
              <span className={`${formData.srStatus === "In Progress" || formData.srStatus === "Waiting for Distributor" ? "text-[#005B96] font-bold" : ""}`}>2. Under Review</span>
              <ChevronRight className="w-3 h-3 mx-1 text-slate-300" />
              <span className={`${generationResult ? "text-[#2E7D32] font-semibold" : ""}`}>3. Draft Compiled</span>
              <ChevronRight className="w-3 h-3 mx-1 text-slate-300" />
              <span>4. Closed & Archived</span>
            </div>

          </div>
        </section>
      </div>

      {/* 3. Main Workspace Container Grid */}
      <main className="max-w-[1600px] mx-auto px-5 py-5">
        
        {viewMode === "management" ? (
          <ManagementDashboard />
        ) : (
          <>
            {/* Dynamic excel spreadsheets block custom formatted for administrative view */}
            <ExcelUploader config={masterConfig} onConfigChange={setMasterConfig} />

            {/* Dual column CRM desktop structure: LEFT 40% (Inputs) | RIGHT 60% (Resolutions) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4 items-start font-sans">
              
              {/* ==================== LEFT PANEL (40% - COMPLAINT INFORMATION) ==================== */}
              <section className={`lg:col-span-5 space-y-4 lg:sticky lg:overflow-y-auto pr-1 ${viewMode === 'management' ? 'lg:top-[205px] lg:h-[calc(100vh-225px)]' : 'lg:top-[125px] lg:h-[calc(100vh-145px)]'}`}>
                <ComplaintForm
                  formData={formData}
                  setFormData={setFormData}
                  masterConfig={masterConfig}
                  onSubmit={handleGenerateReply}
                  isLoading={isLoading}
                  onEmergencyTrigger={() => setIsEmergencyOpen(true)}
                />
              </section>

              {/* ==================== RIGHT PANEL (60% - GENERATED RESOLUTION WORKSPACE) ==================== */}
              <section className={`lg:col-span-7 bg-white border border-[#D9E2EC] rounded-[6px] shadow-xs lg:sticky lg:overflow-y-auto ${viewMode === 'management' ? 'lg:top-[205px] lg:h-[calc(100vh-225px)]' : 'lg:top-[125px] lg:h-[calc(100vh-145px)]'}`}>
                
                {/* Resolution Workspace Header Control & Flat Style Tabs */}
                <div className="bg-slate-50 border-b border-[#D9E2EC] px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#003366]">
                      Operations Resolution Desk
                    </h3>
                  </div>

                  {/* Action Toolbar */}
                  <div className="flex items-center space-x-2">
                    {generationResult && (
                      <button
                        onClick={handleExportText}
                        type="button"
                        className="bg-transparent hover:bg-slate-100 text-[#003366] font-bold border border-[#D9E2EC] hover:border-slate-400 py-1 px-2.5 rounded-[4px] text-xs transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Dossier Export</span>
                      </button>
                    )}
                  </div>
                </div>

                {isSafetyComplaint() && (
                  <div id="safety-critical-banner" className="bg-red-50 border-y border-red-200 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 animate-pulse">
                    <div className="flex items-center space-x-2 text-xs font-bold text-red-800">
                      <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                      <span>🚨 Critical Safety Complaint Detected – Immediate Distributor Escalation Recommended</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEmergencyOpen(true)}
                      className="bg-red-700 hover:bg-red-800 text-white font-black text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-[4px] shadow-xs hover:shadow-[0_0_12px_rgba(185,28,28,0.4)] transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <span>Start Emergency Escalation</span>
                    </button>
                  </div>
                )}

                {/* Flat Corporate Tabs List */}
                <div className="bg-slate-50 border-b border-[#D9E2EC] px-4 flex items-center space-x-1">
                  <button
                    onClick={() => {
                      setActiveTab("customer");
                      setCustomerLang("en");
                    }}
                    className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                      activeTab === "customer" || activeTab === "internal"
                        ? "border-[#FF6900] text-[#003366] bg-white font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    Active AI Resolution Workspace
                  </button>
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer relative ${
                      activeTab === "history"
                        ? "border-[#FF6900] text-[#003366] bg-white font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    Resolution History Log
                    {historyLogs.length > 0 && (
                      <span className="absolute top-2 right-1.5 bg-[#D32F2F] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {historyLogs.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Tab Contents Frame */}
                <div className="p-4 md:p-5 font-sans min-h-[500px] bg-white text-slate-800">
                  
                  {/* Handling Default State (No Resolution Compiled Yet) */}
                  {!generationResult && activeTab !== "history" ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-[#D9E2EC] rounded-[4px] bg-slate-50/50">
                      <div className="bg-slate-100 p-3 rounded-full mb-3 text-slate-400">
                        <FileText className="w-8 h-8" />
                      </div>
                      <h4 className="text-[14px] font-semibold text-slate-700 font-sans mb-1">
                        Select complaint details or click a demo scenario, then click Generate Resolution.
                      </h4>
                      <p className="text-xs text-slate-500 max-w-[380px] leading-relaxed font-sans mt-1">
                        The active analytical model will inspect details and produce an executive-ready communication dossier and operational root-cause audit sheet.
                      </p>
                    </div>
                  ) : activeTab === "history" ? (
                    /* TAB: RESOLUTION HISTORY AUDIT TRACK */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-xs font-semibold uppercase text-slate-400 tracking-wide font-sans">
                          Immutably Processed Record Streams (This Session)
                        </span>
                        <span className="text-xs text-slate-500 font-sans">
                          Count: {historyLogs.length} Records
                        </span>
                      </div>

                      {historyLogs.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 font-sans">
                          <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-xs font-semibold">No transactions logged in this current work session.</p>
                          <p className="text-[11px] mt-0.5 text-slate-500">Every draft you compile is automatically registered here.</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                          {historyLogs.map((log) => (
                            <div
                              key={log.id}
                              className="border border-[#D9E2EC] rounded-[4px] hover:bg-slate-50/80 p-3.5 transition-colors font-sans text-xs"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-mono font-bold text-[#003366]">
                                  {log.srNumber} • {log.id}
                                </span>
                                <span className="text-slate-400 font-mono text-[10px]">
                                  {log.timestamp}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2 text-slate-600 bg-slate-100/50 p-2 rounded">
                                <div>
                                  <span className="text-slate-400 font-bold block text-[9px] uppercase">Complainant</span>
                                  <span className="font-semibold text-slate-800">{log.consumerName}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 font-bold block text-[9px] uppercase">Category</span>
                                  <span className="font-semibold text-slate-800 truncate block">{log.category}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 font-bold block text-[9px] uppercase">Escalation State</span>
                                  <span className={`font-bold inline-block text-[10px] ${log.escalationRequired === "Yes" ? "text-rose-700" : "text-slate-700"}`}>{log.escalationRequired}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 font-bold block text-[9px] uppercase">Resolution Quality</span>
                                  <span className="font-bold text-[#2E7D32]">{log.confidenceLevel}</span>
                                </div>
                              </div>

                              <div>
                                <span className="text-slate-400 font-bold block text-[9px] uppercase mb-1">Generated Reply Draft</span>
                                <p className="text-slate-700 leading-relaxed font-sans whitespace-pre-line border-l-2 border-[#005B96] pl-2.5 py-0.5 italic">
                                  {log.customerResponse}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* UNIFIED ACTIVE RESOLUTION WORKSPACE (Point 14) */
                    <div className="space-y-5 text-slate-850">
                      
                      {/* Part 1: AI Complaint Intelligence Header Section (Point 2) */}
                      <div className="bg-blue-50/60 border border-blue-150 rounded-[6px] p-4 font-sans shadow-2xs">
                        <div className="flex items-center justify-between border-b border-blue-200 pb-2 mb-3">
                          <span className="text-xs font-bold uppercase text-[#003366] tracking-wide flex items-center space-x-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>AI Complaint Intelligence Panel</span>
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] text-slate-500">Suggested Action Priority:</span>
                            <span className="font-mono font-bold text-slate-100 bg-[#003366] px-2 py-0.5 rounded text-[10px]">
                              {generationResult.priority || formData.priority || "High"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-slate-450 tracking-wider">Complaint Summary (AI Synthesized)</span>
                            <p className="mt-1 text-slate-700 leading-relaxed text-[13px] font-medium italic border-l-3 border-[#FF6900] pl-2">
                              "{generationResult.customerSummary || "उपभोक्ता ने अपनी शिकायत में त्वरित समाधान और तकनीकी जांच की तत्काल मांग की है।"}"
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                            <div className="bg-white border border-blue-100 p-2.5 rounded-[4px] shadow-2xs">
                              <span className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider leading-none">Severity Assessment</span>
                              <div className="flex items-center space-x-1.5 mt-1.5">
                                <span className={`w-2.5 h-2.5 rounded-full inline-block ${
                                  generationResult.severity === "Critical" ? "bg-red-500 animate-pulse" : "bg-orange-500"
                                }`} />
                                <span className="text-xs font-black text-slate-700">{generationResult.severity || "High"}</span>
                              </div>
                            </div>

                            <div className="bg-white border border-blue-100 p-2.5 rounded-[4px] shadow-2xs">
                              <span className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider leading-none">Sentiment Analysis</span>
                              <div className="flex items-center justify-between mt-1.5">
                                <span className="text-xs font-black text-slate-700">{generationResult.sentiment || "Frustrated"}</span>
                                <span className="font-mono text-[9px] font-bold text-[#FF6900] bg-orange-50 px-1 py-0.2 rounded">
                                  {generationResult.sentimentConfidence || "94% Conf."}
                                </span>
                              </div>
                            </div>

                            <div className="bg-white border border-blue-100 p-2.5 rounded-[4px] shadow-2xs">
                              <span className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider leading-none">AI Sug. accuracy</span>
                              <div className="flex items-center justify-between mt-1.5">
                                <span className="text-xs font-black text-slate-700">{generationResult.confidenceLevel || "High"}</span>
                                <span className="font-mono text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">
                                  92% Score
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Part 2: Multilingual Outgoing Customer Draft Reply (Points 4, 8 & 11) */}
                      <div className="border border-[#D9E2EC] rounded-[6px] overflow-hidden bg-white shadow-2xs">
                        <div className="bg-slate-50 border-b border-[#D9E2EC] px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center space-x-1.5 animate-pulse">
                            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="text-[13px] font-bold text-slate-850">Auto Generated Customer Draft Reply</span>
                          </div>
                          
                          {/* English vs Hindi Selector tabs */}
                          <div className="flex items-center bg-slate-200/60 p-0.5 rounded-[4px] border border-slate-300">
                            <button
                              type="button"
                              onClick={() => setCustomerLang("en")}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-[3px] transition-colors cursor-pointer ${
                                customerLang === "en"
                                  ? "bg-[#003366] text-white"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              English
                            </button>
                            <button
                              type="button"
                              onClick={() => setCustomerLang("hi")}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-[3px] transition-colors cursor-pointer ${
                                customerLang === "hi"
                                  ? "bg-[#003366] text-white"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              हिन्दी (Hindi)
                            </button>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-950 text-slate-100 font-mono text-[13px] leading-relaxed min-h-[140px] whitespace-pre-wrap select-all">
                          {customerLang === "en" 
                            ? generationResult.customerResponse 
                            : (generationResult.customerResponseHindi || "संबंधित शिकायत का समाधान और औपचारिक उत्तर तैयार किया जा रहा है...")}
                        </div>

                        {/* Actions Suite buttons (Point 11) */}
                        <div className="p-3.5 bg-slate-50 border-t border-[#D9E2EC] flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopy(customerLang === "en" ? generationResult.customerResponse : generationResult.customerResponseHindi || "")}
                              className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-[#D9E2EC] rounded-[4px] shadow-2xs hover:bg-slate-50 flex items-center space-x-1 cursor-pointer transition-colors"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{isCopied ? "Copied!" : "Copy Clipboard"}</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleExportText}
                              className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-[#D9E2EC] rounded-[4px] shadow-2xs hover:bg-slate-50 flex items-center space-x-1 cursor-pointer transition-colors"
                            >
                              <FileDown className="w-3.5 h-3.5" />
                              <span>Download Dossier</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSendToCRM(formData.srNumber)}
                            disabled={crmStatus === "sending" || crmStatus === "success"}
                            className={`px-4 py-1.5 text-xs font-bold rounded-[4px] shadow-2xs cursor-pointer transition-all flex items-center space-x-1.5 border ${
                              crmStatus === "success"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300 pointer-events-none"
                                : crmStatus === "sending"
                                ? "bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed animate-pulse"
                                : "bg-[#FF6900] text-white border-orange-600 hover:bg-orange-600 active:scale-95"
                            }`}
                          >
                            <Database className="w-3.5 h-3.5" />
                            <span>
                              {crmStatus === "success" 
                                ? "Transmitted to CRM!" 
                                : crmStatus === "sending" 
                                ? "Connecting host..." 
                                : "Send to Portal CRM"}
                            </span>
                          </button>
                        </div>
                        
                        {crmStatus === "success" && (
                          <div className="p-3 bg-emerald-50 text-emerald-800 border-t border-emerald-200 text-[11px] font-bold font-mono">
                            ● CRM INTEGRATION FEEDBACK: {crmCode}
                          </div>
                        )}
                      </div>

                      {/* Part 3: Operational Diagnostics Note (Point 2 & 5) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-[#D9E2EC] p-3.5 rounded-[6px] bg-slate-50/75 shadow-2xs">
                          <span className="block text-[10px] font-black text-slate-450 uppercase tracking-wider mb-1">Root Cause Determination (AI Prediction)</span>
                          <div className="space-y-1 mt-1 text-xs text-slate-700">
                            <p className="font-bold text-slate-800">Primary Cause: <span className="font-medium text-slate-600">{generationResult.primaryCause || generationResult.probableCause}</span></p>
                            <p className="font-bold text-slate-800">Secondary Cause: <span className="font-medium text-slate-600">{generationResult.secondaryCause || "Logistics bottleneck"}</span></p>
                            <p className="font-bold text-slate-800">Prediction Accuracy Level: <span className="font-mono text-emerald-600 font-bold bg-[#E8F5E9] px-1 rounded">{generationResult.causeConfidence || "88%"}</span></p>
                          </div>
                        </div>

                        <div className="border border-[#D9E2EC] p-3.5 rounded-[6px] bg-slate-50/75 shadow-2xs">
                          <span className="block text-[10px] font-black text-slate-450 uppercase tracking-wider mb-1">Internal Note Suggestions (Point 5)</span>
                          <div className="space-y-1 mt-1 text-xs text-slate-700">
                            <p className="font-semibold text-slate-800">Operational Guideline Step:</p>
                            <p className="leading-relaxed">{generationResult.suggestedAction || "Proceed to dispatch standard maintenance vehicle."}</p>
                            <div className="flex items-center space-x-1.5 pt-1">
                              <span className="text-slate-500 font-bold text-[10px] uppercase">Immediate Escalation Flag:</span>
                              <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                generationResult.escalationRequired === "Yes" 
                                  ? "bg-rose-100 text-rose-800 border border-rose-300 animate-pulse" 
                                  : "bg-slate-200 text-slate-700"
                              }`}>
                                {generationResult.escalationRequired || "No"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Part 4: Recommended Actions Checklists (Point 3) */}
                      <div className="border border-[#D9E2EC] p-4 rounded-[6px] bg-white shadow-2xs">
                        <h4 className="text-[13px] font-bold text-[#003366] font-sans mb-3 flex items-center justify-between border-b pb-2">
                          <span className="flex items-center space-x-1.5">
                            <CheckSquare className="w-4 h-4 text-[#003366] shrink-0" />
                            <span>OMC Action Item Checklist (Exactly Top 3 Steps)</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Click tasks to complete</span>
                        </h4>
                        
                        <div className="space-y-2.5">
                          {generationResult.recommendedActions && generationResult.recommendedActions.slice(0, 3).map((action, idx) => (
                            <label 
                              key={idx} 
                              className="flex items-start space-x-3 bg-slate-50/50 p-2.5 rounded-[4px] border border-[#D9E2EC] cursor-pointer hover:bg-slate-50"
                            >
                              <input 
                                type="checkbox" 
                                className="mt-1 h-3.5 w-3.5 text-[#003366] border-slate-300 rounded focus:ring-[#003366]"
                              />
                              <div className="min-w-0">
                                <span className="block text-[11px] font-black uppercase text-slate-450 leading-none">Step {idx + 1}</span>
                                <span className="block text-xs font-semibold text-slate-700 leading-relaxed mt-0.5">{action}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Part 6: Time Saved Indicators (Point 7 & 10) */}
                      <div className="bg-emerald-50 border border-emerald-200 rounded-[6px] p-4 text-xs font-sans shadow-2xs">
                        <div className="flex items-center space-x-2 mb-3">
                          <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-emerald-800 uppercase tracking-wider text-[11px]">Time Saved Performance Analytics</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className="md:col-span-8 space-y-2">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-bold text-slate-500">
                                <span>Standard Operations Processing (Manual Baseline)</span>
                                <span>12.5 Minutes</span>
                              </div>
                              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-400 rounded-full" style={{ width: "100%" }}></div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-bold text-emerald-700 font-sans">
                                <span>AI-Assisted Resolution Generation drafting (This Live Suite Portal)</span>
                                <span className="font-mono font-black">45 Seconds</span>
                              </div>
                              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "6%" }}></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="md:col-span-4 bg-white border border-emerald-100 p-3 rounded-[6px] text-center shadow-2xs">
                            <span className="block text-[22px] font-black text-emerald-600 font-mono tracking-tight">-93%</span>
                            <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Efficiency Gain</span>
                            <span className="block text-[9px] text-emerald-650 font-medium mt-0.5">Saved ~11m 45s per ticket</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              </section>

            </div>
          </>
        )}
      </main>

      {/* Corporate Technical Footer */}
      <footer className="border-t border-[#D9E2EC] bg-white py-5 mt-16 text-center text-xs text-slate-500 font-sans">
        <p>LPG Sales Officer Executive Suite Portal • Registered IndianOil PSU Internal standard 2026</p>
        <p className="mt-1 text-[11px] text-slate-400 font-mono">
          Security Level: Restricted Internal Systems • Direct Interface for Regional Sales Units
        </p>
      </footer>

      <EmergencyEscalationModule 
        isOpen={isEmergencyOpen} 
        onClose={() => setIsEmergencyOpen(false)} 
        formData={formData} 
      />

    </div>
  );
}
