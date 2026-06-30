import React from "react";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Building2, 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  TrendingDown, 
  Award,
  Users
} from "lucide-react";

// Mock data for executive dashboards, aligning with actual IndianOil performance reports
const TREND_DATA = [
  { day: "Mon", open: 145, resolved: 120 },
  { day: "Tue", open: 160, resolved: 135 },
  { day: "Wed", open: 142, resolved: 141 },
  { day: "Thu", open: 180, resolved: 155 },
  { day: "Fri", open: 150, resolved: 162 },
  { day: "Sat", open: 110, resolved: 118 },
  { day: "Sun", open: 95, resolved: 104 }
];

const CATEGORY_DISTRIBUTION = [
  { name: "Refill Delivery", value: 520, percent: "41.6%", color: "#FF6900" },
  { name: "Cylinder Safety", value: 310, percent: "24.8%", color: "#D32F2F" },
  { name: "Subsidy & Billing", value: 245, percent: "19.6%", color: "#005B96" },
  { name: "Connection Transfer", value: 108, percent: "8.6%", color: "#008080" },
  { name: "Staff Behavior", value: 65, percent: "5.4%", color: "#ED6C02" }
];

const ESCALATION_DATA = [
  { name: "L1 Resolvable", value: 82 },
  { name: "Escalated to Area Manager", value: 12 },
  { name: "Escalated to Regional HQ", value: 6 }
];

const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

const DISTRIBUTOR_STATS = [
  { name: "Shree Krishna Indane Agency", score: "94.2%", delay: "2.1 Hrs", pendingL1: 4, badge: "Premium Grade A" },
  { name: "Balaji Indane Distributors", score: "91.8%", delay: "3.5 Hrs", pendingL1: 8, badge: "Grade A" },
  { name: "Indraprastha Indane Gas Service", score: "88.5%", delay: "4.8 Hrs", pendingL1: 15, badge: "Standard Grade B" },
  { name: "Malti Indane Gas Distributors", score: "82.4%", delay: "6.2 Hrs", pendingL1: 22, badge: "Unsatisfactory Grade C" },
  { name: "Vikas Indane Service", score: "78.9%", delay: "8.5 Hrs", pendingL1: 28, badge: "Critical Watchlist" }
];

export default function ManagementDashboard() {
  return (
    <div id="management-dashboard-view" className="space-y-6 animate-fade-in">
      
      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D9E2EC] p-4 rounded-[6px] shadow-xs flex items-center justify-between">
          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Backlog Volume
            </span>
            <span className="text-[26px] font-extrabold text-slate-800 tracking-tight">
              1,541
            </span>
            <span className="text-rose-500 text-[11px] font-medium flex items-center mt-1">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +4.2% from yesterday
            </span>
          </div>
          <div className="p-3 bg-red-50 text-[#D32F2F] rounded-full">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#D9E2EC] p-4 rounded-[6px] shadow-xs flex items-center justify-between">
          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              SLA Resolution Rate
            </span>
            <span className="text-[26px] font-extrabold text-slate-800 tracking-tight">
              94.8%
            </span>
            <span className="text-emerald-500 text-[11px] font-medium flex items-center mt-1">
              <CheckCircle className="w-3.5 h-3.5 mr-0.5" /> Exceeding PSC target (90%)
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#D9E2EC] p-4 rounded-[6px] shadow-xs flex items-center justify-between">
          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Average Handling Time
            </span>
            <span className="text-[26px] font-extrabold text-slate-800 tracking-tight">
              4.2 Hours
            </span>
            <span className="text-emerald-500 text-[11px] font-medium flex items-center mt-1">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> -68% using AI automation
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-[#005B96] rounded-full">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#D9E2EC] p-4 rounded-[6px] shadow-xs flex items-center justify-between">
          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Regional Officers
            </span>
            <span className="text-[26px] font-extrabold text-slate-800 tracking-tight">
              34 Officers
            </span>
            <span className="text-slate-500 text-[11px] font-medium flex items-center mt-1">
              Across 5 States
            </span>
          </div>
          <div className="p-3 bg-orange-50 text-[#FF6900] rounded-full">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Chart 1: Complaint Trends (Area) */}
        <div className="lg:col-span-8 bg-white border border-[#D9E2EC] rounded-[6px] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-bold text-[#003366] font-sans">
                Active Weekly Complaint Volume Trends
              </h3>
              <p className="text-xs text-slate-500">
                Comparison of Open SR tickets vs. AI-Assisted Resolutions closed
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-sans">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-[#003366] mr-1.5"></span>
                <span>Incoming Tickets</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-[#10B981] mr-1.5"></span>
                <span>AI Resolved Cases</span>
              </div>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#003366" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#003366" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="open" stroke="#003366" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOpen)" name="Incoming Open" />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorResolved)" name="Self-Resolved via AI" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Escalation Breakdown (Pie) */}
        <div className="lg:col-span-4 bg-white border border-[#D9E2EC] rounded-[6px] p-5 shadow-xs">
          <div>
            <h3 className="text-[15px] font-bold text-[#003366] font-sans">
              Escalation Resolution Rate
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Breakdown of emergency or SLA escalation categories
            </p>
          </div>
          <div className="h-[180px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ESCALATION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {ESCALATION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[20px] font-black text-slate-800">82%</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase">L1 Auto-Closed</span>
            </div>
          </div>
          <div className="space-y-2 mt-2 text-xs font-sans">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></span>
                <span>L1 Handled (L1 Resolvable)</span>
              </div>
              <span className="font-bold text-slate-700">82.0%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2"></span>
                <span>Escalated to Sales Manager</span>
              </div>
              <span className="font-bold text-slate-700">12.0%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></span>
                <span>Urgent Safety / HQ Intervention</span>
              </div>
              <span className="font-bold text-slate-700">6.0%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Categories Bar Distribution */}
        <div className="lg:col-span-5 bg-white border border-[#D9E2EC] rounded-[6px] p-5 shadow-xs">
          <div>
            <h3 className="text-[15px] font-bold text-[#003366] font-sans">
              Top Complaint Categories
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Breakdown of major complaints logged across state offices
            </p>
          </div>
          <div className="space-y-3">
            {CATEGORY_DISTRIBUTION.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="font-semibold text-slate-700">{cat.name}</span>
                  <span className="font-bold text-slate-900">{cat.value} Cases ({cat.percent})</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-1000" 
                    style={{ width: cat.percent, backgroundColor: cat.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distributor Performance Stat Matrix */}
        <div className="lg:col-span-7 bg-white border border-[#D9E2EC] rounded-[6px] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[15px] font-bold text-[#003366] font-sans">
                Distributor Service Leaderboard (Selected Area)
              </h3>
              <p className="text-xs text-slate-500">
                SLA and response latency audit logs for active dealerships
              </p>
            </div>
            <span className="text-[11px] bg-sky-50 text-[#003366] font-bold px-2 py-0.5 rounded border border-sky-100 uppercase">
              Live Monitoring
            </span>
          </div>

          <div className="overflow-x-auto text-xs font-sans">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-[#D9E2EC]">
                  <th className="py-2.5 px-3">Distributor Dealership</th>
                  <th className="py-2.5 px-3">SLA Score</th>
                  <th className="py-2.5 px-3">Avg Delay</th>
                  <th className="py-2.5 px-3 text-center">Unresolved</th>
                  <th className="py-2.5 px-3 text-right">Audit Class</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DISTRIBUTOR_STATS.map((d, index) => (
                  <tr key={index} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800 flex items-center">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                      <span>{d.name}</span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-950 font-mono">
                      {d.score}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 select-none">
                      {d.delay}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-red-600 font-mono">
                      {d.pendingL1}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-[3px] text-[10px] font-bold ${
                        d.badge.includes("Premium") || d.badge.includes("Grade A")
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                          : d.badge.includes("Grade B")
                          ? "bg-sky-50 text-sky-800 border border-sky-100"
                          : d.badge.includes("Grade C")
                          ? "bg-amber-100 text-amber-800 border border-amber-200 animate-pulse"
                          : "bg-red-50 text-red-800 border border-red-200 uppercase font-black"
                      }`}>
                        {d.badge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
