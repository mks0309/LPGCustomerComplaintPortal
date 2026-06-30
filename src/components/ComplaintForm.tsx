import React, { useEffect } from "react";
import { ComplaintData, MasterConfig } from "../types";
import { Sliders, RefreshCw, Layers } from "lucide-react";

interface Props {
  formData: ComplaintData;
  setFormData: React.Dispatch<React.SetStateAction<ComplaintData>>;
  masterConfig: MasterConfig;
  onSubmit: () => void;
  isLoading: boolean;
  onEmergencyTrigger: () => void;
}

const CRM_SCENARIOS = [
  {
    label: "Emergency: Gas Leakage",
    shortLabel: "Gas Leakage Emergency",
    type: "leakage",
    color: "border-red-500 bg-red-50 text-red-800 hover:bg-red-100",
    icon: "🔥",
    data: {
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
    },
  },
  {
    label: "Logistics: Delivery Delay",
    shortLabel: "Refill Delivery Delay",
    type: "delay",
    color: "border-amber-500 bg-amber-50 text-amber-800 hover:bg-amber-100",
    icon: "🚚",
    data: {
      customerId: "CID124905",
      distributorName: "Indraprastha Indane Gas Service",
      consumerName: "Sanjay Kumar Gupta",
      consumerNumber: "123049102",
      mobileNumber: "9988776655",
      srNumber: "SR-3341-DL",
      dateOpened: "2026-06-16",
      assignedTo: "Manish Kumar Sharma (Sales Officer)",
      category: "Refill Delivery Issues",
      subCategory: "Refill delivery delayed more than 5 days",
      priority: "2-High",
      srStatus: "Open",
      complaintDescription: "It has been over 7 days since I successfully booked my LPG refill cylinder (Booking ID: BK-998124). The payment was deducted online same-day, and I received an SMS that the cylinder was dispatched, but no delivery has happened. The distributor keeps giving vague excuses about truck logistics. Currently my family is stranded without a cooking cylinder. Deliver immediately or process an instant refund!",
    },
  },
  {
    label: "Billing: Subsidy Missing",
    shortLabel: "Subsidy Not Received",
    type: "subsidy",
    color: "border-emerald-500 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
    icon: "💰",
    data: {
      customerId: "CID104772",
      distributorName: "Balaji Indane Distributors",
      consumerName: "Gurpreet Singh Gill",
      consumerNumber: "112345678",
      mobileNumber: "7345618290",
      srNumber: "SR-1099-SUB",
      dateOpened: "2026-06-15",
      assignedTo: "Manish Kumar Sharma (Sales Officer)",
      category: "Subsidy & Billing Issues",
      subCategory: "DBTL/PAHAL subsidy not credited to bank account",
      priority: "3-Medium",
      srStatus: "Open",
      complaintDescription: "My booking for LPG refill was successfully delivered and invoiced on May 28th. However, my bank account (Aadhaar linked with state bank) has still not received the Direct Benefit Transfer (PAHAL DBTL) subsidy amount. Previously I used to receive the credit within 3 banking days. I checked my Aadhaar-LPG seed status online and it shows active under the distributor ledger. Please verify if my seed registry has been un-linked or if there is some portal mismatch from the Oil Marketing Company's end.",
    },
  },
  {
    label: "Logistics: Overcharging",
    shortLabel: "Overcharging Complaint",
    type: "overcharging",
    color: "border-orange-500 bg-orange-50 text-orange-800 hover:bg-orange-100",
    icon: "⚠️",
    data: {
      customerId: "CID331201",
      distributorName: "Royal Indane Gas Distributors",
      consumerName: "Meenakshi Deshmukh",
      consumerNumber: "776329004",
      mobileNumber: "8123456789",
      srNumber: "SR-4458-DEL",
      dateOpened: "2026-06-18",
      assignedTo: "Manish Kumar Sharma (Sales Officer)",
      category: "Refill Delivery Issues",
      subCategory: "Overcharging above retail selling price",
      priority: "2-High",
      srStatus: "In Progress",
      complaintDescription: "My domestic LPG refill delivery agent (person name: Ramesh) demanded a total cash payment of INR 1150 for our domestic cylinder delivery, whereas the official digital bill shown on my SMS receipt lists only INR 1025. When I showed him the electronic confirmation, he rudely claimed that the extra 125 rupees is 'mandatory delivery commission charges' for carrying it up to the third floor, and threatened to take the cylinder back and cancel my future quotas if I did not pay immediately. I was forced to pay him. This is clear extortion. Please investigate this distributor as they are charging above the official retail selling price regularly.",
    },
  },
  {
    label: "Account: Transfer",
    shortLabel: "Transfer Request",
    type: "transfer",
    color: "border-sky-500 bg-sky-50 text-sky-800 hover:bg-sky-100",
    icon: "🔄",
    data: {
      customerId: "CID401923",
      distributorName: "Malti Indane Gas Distributors",
      consumerName: "Arunachal Swamy",
      consumerNumber: "984210499",
      mobileNumber: "9442103344",
      srNumber: "SR-8842-TR",
      dateOpened: "2026-06-17",
      assignedTo: "Manish Kumar Sharma (Sales Officer)",
      category: "Distributor & Service Standard Issues",
      subCategory: "Transfer of connection request pending/delayed",
      priority: "3-Medium",
      srStatus: "Open",
      complaintDescription: "I have submitted all the necessary documents including my original Subscription Voucher (SV) and Proof of Address to transfer my domestic connection from Malleswaram, Bangalore to Indiranagar territory 10 days ago. The current distributor says they haven't received confirmation from the Bangalore Regional Office. My request remains unallocated. I need a gas connection urgently at my new house. Please process my transfer voucher (TV) and release the e-SV.",
    },
  },
  {
    label: "Staff: Poor Behaviour",
    shortLabel: "Poor Staff Behaviour",
    type: "staff",
    color: "border-blue-500 bg-blue-50 text-blue-800 hover:bg-blue-100",
    icon: "👤",
    data: {
      customerId: "CID502812",
      distributorName: "Vikas Indane Service Center",
      consumerName: "Sarla Devi",
      consumerNumber: "331049912",
      mobileNumber: "9123459876",
      srNumber: "SR-2104-BH",
      dateOpened: "2026-06-19",
      assignedTo: "Manish Kumar Sharma (Sales Officer)",
      category: "Distributor & Service Standard Issues",
      subCategory: "Rude behaviour / poor service standards of distributor staff",
      priority: "3-Medium",
      srStatus: "Open",
      complaintDescription: "I visited the distributor office to request a regulator replacement because the valve ring was loose. The counter manager (named Vikas) was extremely rude, refused to look at my booking ledger, and shouted at me to wait in the sun for 3 hours, mockingly saying 'regulator is of no concern to us, go buy a new cylinder'. Safety and customer dignity is zero at this agency. Please log regular disciplinary actions against them.",
    },
  },
];

function getSampleDescription(category: string, subCategory: string): string {
  if (!category) return "";
  
  const sub = subCategory || "";

  // 1. Cylinder Leakage & Safety
  if (category === "Cylinder Leakage & Safety") {
    if (sub.includes("Valve leakage")) {
      return "URGENT SAFETY EMERGENCY: I just received a domestic 14.2kg LPG cylinder. Upon removing the safety cap, there is a continuous, loud whistling sound and a strong smell of gas coming from the top valve pin. The cylinder is stored in a well-ventilated yard right now but we are scared to connect the regulator. Please send a safety mechanic or emergency officer immediately! We have turned off all electrical devices.";
    }
    if (sub.includes("Regulator joint")) {
      return "There is a continuous minor gas leak occurring exactly at the joint where the LPG regulator locks onto the cylinder head valve. When we turn the regulator switch on, we hear a slight hissing sound and smell gas. We have checked the lock, but the fit feels wobbly. We have immediately disconnected the regulator for safety.";
    }
    if (sub.includes("Body leakage") || sub.includes("pinhole")) {
      return "DANGER: I suspect there is a tiny pinhole leak/crack in the metal body of the LPG cylinder. I can see fine bubbles forming and a faint odor when wiping the cylinder surface with soap water. This is extremely hazardous. Please arrange for a direct replacement and retrieve this defective unit immediately.";
    }
    if (sub.includes("O-Ring")) {
      return "The inner rubber O-ring inside the cylinder neck valve appears to be missing or severely cracked/cut. As a result, the regulator does not seat properly, and gas escapes immediately when the regulator is turned on. Please arrange to replace the cylinder or send a technician with a spare O-ring.";
    }
    if (sub.includes("safety protective cap")) {
      return "The cylinder was delivered without the mandatory plastic safety protective cap on the valve. The valve top is exposed to dust and potential impact damage during transit, which poses a safety risk. Please supply a proper tight protective cap immediately.";
    }
    if (sub.includes("burner gas leakage") || sub.includes("Hot plate")) {
      return "Whenever I turn on the burner of our double-burner gas hot plate, there is raw gas leaking from under the burner cup before it ignites. The flames are also yellowish and irregular, and there is a strong smell of unburnt gas in the kitchen. Needs emergency inspection of the hot plate.";
    }
    if (sub.includes("Rubber tube") || sub.includes("hose")) {
      return "The Suraksha rubber hose connecting the regulator to our gas stove has developed visible cracks and dry-rot along its length. There is a faint smell of gas near the back of the stove. This tube needs urgent replacement to prevent any kitchen fire hazards.";
    }
    return `Safety issue reported regarding LPG cylinder assembly: ${sub}. There is gas smell and immediate corrective inspection is requested by the customer.`;
  }

  // 2. Refill Delivery Issues
  if (category === "Refill Delivery Issues") {
    if (sub.includes("Under-weight")) {
      return "The refill cylinder delivered to my house today weighs significantly less than standard. Net weight should be 14.2 kg, but on my portable scale it registered only 11.5 kg of gas (total gross weight is 4kg short of what is printed on the cylinder body). I suspect gas theft or a faulty fill at the bottling plant. The delivery person refused to use his spring scale to verify. Please inspect.";
    }
    if (sub.includes("delay") || sub.includes("48 hours")) {
      return "It has been over 72 hours since I successfully booked my LPG refill cylinder (Booking ID: BK-998124). The online payment was deducted successfully, and the portal status shows 'Dispatched', but the delivery hasn't arrived. Our home is completely out of gas. Please expedite delivery.";
    }
    if (sub.includes("Overcharging")) {
      return "My domestic LPG refill delivery agent (person name: Ramesh) demanded a total cash payment of INR 1150 for our domestic cylinder delivery, whereas the official digital bill shown on my SMS receipt lists only INR 1025. When I showed him the electronic confirmation, he rudely claimed that the extra 125 rupees is 'mandatory delivery commission charges' for carrying it up to the third floor, and threatened to take the cylinder back and cancel my future quotas if I did not pay immediately. I was forced to pay him. This is clear extortion. Please investigate this distributor as they are charging above the official retail selling price regularly.";
    }
    if (sub.includes("staff misconduct") || sub.includes("rude")) {
      return "The delivery agent who came to our residence was extremely rude and aggressive. He threw the cylinder on the floor, damaging our tile, and spoke in highly abusive language when we asked him to handle it gently. Please take strict disciplinary action against this delivery person.";
    }
    if (sub.includes("top floors")) {
      return "The delivery staff flatly refused to carry the cylinder up to my second-floor flat, stating they only deliver to the ground floor. They left the cylinder on the street and forced my elderly parents to carry it. This violates the door-to-door delivery commitment of the agency.";
    }
    if (sub.includes("Fake delivery SMS")) {
      return "I received an automated SMS stating that my LPG cylinder Booking ID BK-77412 has been 'Successfully Delivered' and invoiced. However, no physical cylinder has been delivered to my house, and my stove is empty. The distributor seems to have diverted the cylinder to black market. Please investigate.";
    }
    if (sub.includes("blue-book") || sub.includes("Refill card")) {
      return "The delivery boy delivered the refill cylinder but refused to stamp or enter the booking details in our physical LPG Blue Book (Refill Card), saying they no longer maintain manual logs. This makes it difficult to track our yearly domestic quota. Please direct the agency to make proper entries.";
    }
    return `Issue with refill delivery: ${sub}. The customer is complaining about service standards and requests speedy resolution from the district office.`;
  }

  // 3. Distributor Service Quality
  if (category === "Distributor Service Quality") {
    if (sub.includes("insurance") || sub.includes("stoves")) {
      return "The distributor office staff is holding up my booking and refusing to issue the cylinder unless I also purchase a premium gas stove and a costly personal insurance policy directly from their showroom. This tie-in sale is illegal and a violation of public sector marketing guidelines.";
    }
    if (sub.includes("uncooperative") || sub.includes("rude") || sub.includes("Rude behaviour")) {
      return "I visited the distributor office to request a regulator replacement because the valve ring was loose. The counter manager (named Vikas) was extremely rude, refused to look at my booking ledger, and shouted at me to wait in the sun for 3 hours, mockingly saying 'regulator is of no concern to us, go buy a new cylinder'. Safety and customer dignity is zero at this agency. Please log regular disciplinary actions against them.";
    }
    if (sub.includes("Refusal to book")) {
      return "The distributor office is flatly refusing to book my LPG cylinder refill over the counter or accept physical cash, claiming that all bookings must only be done through the online mobile app. Many senior citizens in our locality do not have smartphones. This refusal is unacceptable.";
    }
    if (sub.includes("deposit refund") || sub.includes("cancellation")) {
      return "I cancelled my gas connection and surrendered my cylinder and pressure regulator along with the original SV card 45 days ago. The distributor promised a full deposit refund of INR 1,450 within 10 days, but they keep delaying, saying their accounts department is waiting for head office clearance.";
    }
    if (sub.includes("busy") || sub.includes("unreachable")) {
      return "The official contact phone numbers listed on the web portal for Balaji Indane agency are permanently switched off, busy, or unreachable. There is no way for customers to query status or register emergencies. Please direct them to establish a functional hotline.";
    }
    if (sub.includes("Unscheduled closure")) {
      return "The distributor showroom and godown were closed during official working hours on consecutive weekdays without any public notice or scheduled holiday. Customers who had traveled from far areas were left stranded outside locked gates. This is a severe breach of dealership rules.";
    }
    return `Distributor service quality complaint regarding ${sub}. The customer wants executive monitoring of the dealer's retail service standards.`;
  }

  // 4. Subsidy & Billing Issues
  if (category === "Subsidy & Billing Issues") {
    if (sub.includes("subsidy") || sub.includes("credited")) {
      return "My booking for LPG refill was successfully delivered and invoiced on May 28th. However, my bank account (Aadhaar linked with state bank) has still not received the Direct Benefit Transfer (PAHAL DBTL) subsidy amount. Previously I used to receive the credit within 3 banking days. I checked my Aadhaar-LPG seed status online and it shows active under the distributor ledger. Please verify if my seed registry has been un-linked or if there is some portal mismatch from the Oil Marketing Company's end.";
    }
    if (sub.includes("Double bill") || sub.includes("transaction")) {
      return "During my recent online refill booking payment, my bank account was debited twice (INR 1,025 x 2) due to a payment gateway timeout error on the OMC portal. Only one booking order was generated. I have raised this with my bank, but they say the money has been successfully captured by the oil company. Please refund the duplicate payment.";
    }
    if (sub.includes("incorrect bank")) {
      return "The LPG portal shows that my subsidy for the last three cylinders has been successfully disbursed, but the money is going into an incorrect bank account that does not belong to me. My Aadhaar database mapping has some error from your end. Please rectify my bank routing immediately.";
    }
    if (sub.includes("incorrect tariff") || sub.includes("Commercial")) {
      return "My domestic 14.2kg LPG booking was incorrectly billed under the Commercial high-tariff rate, charging me INR 1,850 instead of the standard domestic rate of INR 1,025. I have an active domestic connection and do not run any business. Please correct the billing ledger and refund the difference.";
    }
    return `Billing or subsidy discrepancy reported: ${sub}. The customer requires database reconciliation and account correction.`;
  }

  // 5. New Connection & Equipment Transfer
  if (category === "New Connection & Equipment Transfer") {
    if (sub.includes("delay") || sub.includes("releasing")) {
      return "I submitted my KYC documents and paid the security deposit for a new double-bottle domestic connection (DBC) over 3 weeks ago. The showroom staff keeps telling me that the pressure regulators or cylinders are out of stock. Please expedite the connection release.";
    }
    if (sub.includes("forced") || sub.includes("premium") || sub.includes("accessory")) {
      return "The distributor showroom staff is refusing to release my newly approved connection unless I purchase an expensive premium lighter, gas stove, and specialized safety stand directly from them for INR 3,500. These accessories are optional, but they are forcing customers to buy them.";
    }
    if (sub.includes("deposit")) {
      return "The distributor is demanding an unfair and inflated security deposit value of INR 2,200 for the 14.2kg cylinder steel body, whereas the official OMC website states the standard rate is INR 1,450. Please check if this dealer is illegally charging higher deposits.";
    }
    if (sub.includes("transfer") || sub.includes("inter-distributor")) {
      return "I have submitted all the necessary documents including my original Subscription Voucher (SV) and Proof of Address to transfer my domestic connection from Malleswaram, Bangalore to Indiranagar territory 10 days ago. The current distributor says they haven't received confirmation from the Bangalore Regional Office. My request remains unallocated. I need a gas connection urgently at my new house. Please process my transfer voucher (TV) and release the e-SV.";
    }
    return `Issue during connection release or transfer: ${sub}. The customer requests OMC intervention to complete the process.`;
  }

  // 6. Transporter & Bulk Issues
  if (category === "Transporter & Bulk Issues") {
    if (sub.includes("valve integrity") || sub.includes("tanker")) {
      return "CRITICAL SAFETY CONCERN: The bulk bullet LPG tanker (Registration No. MH-12-PQ-9981) parked at our terminal bay is showing minor gas weeping around the primary bypass valve stem. There is a frost ring forming. Emergency isolation is needed.";
    }
    if (sub.includes("Logistical delays")) {
      return "There are persistent logistical delays in commercial storage tanks turnaround at our distribution hub, leading to commercial cylinder filling shortages. The transport contractor is violating the agreed schedule. Please intervene.";
    }
    if (sub.includes("Price discrepancy")) {
      return "There is a severe invoice price discrepancy on our high-volume bulk commercial invoices for this quarter. The volume-discount credit has not been applied to our billing ledger. Please reconcile our bulk account.";
    }
    return `Bulk transporter logistical or safety issue reported: ${sub}. High priority resolution is required.`;
  }

  return `Customer is raising a complaint under ${category} - ${sub}. Please investigate and provide an appropriate resolution.`;
}

export default function ComplaintForm({
  formData,
  setFormData,
  masterConfig,
  onSubmit,
  isLoading,
  onEmergencyTrigger,
}: Props) {
  
  // Real-time synchronization of Categories and dynamic Subcategories dropdown
  useEffect(() => {
    if (formData.category) {
      const allowedSubs = masterConfig.categories[formData.category] || [];
      if (formData.subCategory && !allowedSubs.includes(formData.subCategory)) {
        setFormData((prev) => ({ ...prev, subCategory: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, subCategory: "" }));
    }
  }, [formData.category, masterConfig.categories, setFormData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cat = e.target.value;
    if (!cat) {
      setFormData((prev) => ({
        ...prev,
        category: "",
        subCategory: "",
        complaintDescription: "",
      }));
      return;
    }
    const allowedSubs = masterConfig.categories[cat] || [];
    const firstSub = allowedSubs[0] || "";
    const desc = getSampleDescription(cat, firstSub);
    setFormData((prev) => ({
      ...prev,
      category: cat,
      subCategory: firstSub,
      complaintDescription: desc,
    }));
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sub = e.target.value;
    const desc = getSampleDescription(formData.category, sub);
    setFormData((prev) => ({
      ...prev,
      subCategory: sub,
      complaintDescription: desc,
    }));
  };

  const handleClearForm = () => {
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
  };

  const handleSelectScenario = (sc: typeof CRM_SCENARIOS[0]) => {
    setFormData(sc.data);
  };

  const categoriesList = Object.keys(masterConfig.categories);
  const subCategoriesList = formData.category
    ? masterConfig.categories[formData.category] || []
    : [];

  return (
    <div id="complaint-form-root" className="space-y-4">
      
      {/* 13. Visual Scenario Quick Injectors Grid Panel */}
      <div className="bg-white border border-[#D9E2EC] p-4 rounded-[6px] shadow-xs">
        <div className="flex items-center space-x-2 mb-3">
          <Layers className="h-4 w-4 text-[#003366] shrink-0" />
          <span className="text-xs font-bold text-slate-800 font-sans block uppercase tracking-wider">
            Executive Demo Scenarios:
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
          Click any preset scenario card below to instantly inject a standard customer record. Perfect for swift live audience-led validation.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {CRM_SCENARIOS.map((sc, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectScenario(sc)}
              className={`border p-2.5 rounded-[4px] text-left transition-all text-xs font-sans flex items-start space-x-2 cursor-pointer ${sc.color} hover:scale-[1.01] active:scale-[0.99] group`}
            >
              <span className="text-[14px] leading-none select-none">{sc.icon}</span>
              <div className="min-w-0">
                <span className="block font-bold truncate text-[11px] uppercase tracking-tight text-slate-400 group-hover:text-slate-500">
                  {sc.label.split(":")[0]}
                </span>
                <span className="block font-semibold truncate leading-tight mt-0.5 text-slate-800">
                  {sc.shortLabel}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        
        {/* GROUP 1: CUSTOMER INFORMATION */}
        <div className="bg-white border border-[#D9E2EC] rounded-[6px] p-4 shadow-none">
          <h3 className="text-[16px] font-bold text-[#003366] font-sans mb-3 pb-1 border-b border-slate-100 flex items-center justify-between">
            <span>Customer Information</span>
            <span className="text-[11px] text-slate-400 font-mono tracking-wide">SEC: INF_A</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="customerId" className="block text-[13px] font-semibold text-slate-600 font-sans mb-1">
                Customer ID
              </label>
              <input
                type="text"
                id="customerId"
                name="customerId"
                value={formData.customerId}
                onChange={handleInputChange}
                placeholder="e.g. CID88921"
                className="w-full text-xs border border-[#D9E2EC] rounded-[4px] px-2.5 py-1.5 focus:border-[#003366] focus:outline-hidden text-slate-900 font-mono transition-colors"
              />
            </div>

            <div>
              <label htmlFor="consumerName" className="block text-[13px] font-semibold text-slate-600 font-sans mb-1">
                Consumer Name *
              </label>
              <input
                type="text"
                id="consumerName"
                name="consumerName"
                value={formData.consumerName}
                onChange={handleInputChange}
                required
                placeholder="e.g. Ramesh Kumar"
                className="w-full text-xs border border-[#D9E2EC] rounded-[4px] px-2.5 py-1.5 focus:border-[#003366] focus:outline-hidden text-slate-900 font-sans transition-colors"
              />
            </div>

            <div>
              <label htmlFor="consumerNumber" className="block text-[13px] font-semibold text-slate-600 font-sans mb-1">
                Consumer Number
              </label>
              <input
                type="text"
                id="consumerNumber"
                name="consumerNumber"
                value={formData.consumerNumber}
                onChange={handleInputChange}
                placeholder="e.g. 556781223"
                className="w-full text-xs border border-[#D9E2EC] rounded-[4px] px-2.5 py-1.5 focus:border-[#003366] focus:outline-hidden text-slate-900 font-mono transition-colors"
              />
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-[13px] font-semibold text-slate-600 font-sans mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                placeholder="e.g. 9876543210"
                className="w-full text-xs border border-[#D9E2EC] rounded-[4px] px-2.5 py-1.5 focus:border-[#003366] focus:outline-hidden text-slate-900 font-mono transition-colors"
              />
            </div>
          </div>
        </div>

        {/* GROUP 2: DISTRIBUTOR INFORMATION */}
        <div className="bg-white border border-[#D9E2EC] rounded-[6px] p-4 shadow-none">
          <h3 className="text-[16px] font-bold text-[#003366] font-sans mb-3 pb-1 border-b border-slate-100 flex items-center justify-between">
            <span>Distributor Information</span>
            <span className="text-[11px] text-slate-400 font-mono tracking-wide">SEC: INF_B</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="distributorName" className="block text-[13px] font-semibold text-slate-600 font-sans mb-1">
                Distributor Name
              </label>
              <input
                type="text"
                id="distributorName"
                name="distributorName"
                value={formData.distributorName}
                onChange={handleInputChange}
                placeholder="e.g. Shree Balaji Gas Agency"
                className="w-full text-xs border border-[#D9E2EC] rounded-[4px] px-2.5 py-1.5 focus:border-[#003366] focus:outline-hidden text-slate-900 font-sans transition-colors"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="assignedTo" className="block text-[13px] font-semibold text-slate-600 font-sans mb-1">
                Assigned Officer
              </label>
              <input
                type="text"
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                placeholder="e.g. Sales Officer Name"
                className="w-full text-xs border border-[#D9E2EC] rounded-[4px] px-2.5 py-1.5 focus:border-[#003366] focus:outline-hidden text-slate-900 font-sans transition-colors"
              />
            </div>
          </div>
        </div>

        {/* GROUP 3: COMPLAINT INFORMATION */}
        <div className="bg-white border border-[#D9E2EC] rounded-[6px] p-4 shadow-none">
          <h3 className="text-[16px] font-bold text-[#003366] font-sans mb-3 pb-1 border-b border-slate-100 flex items-center justify-between">
            <span>Complaint Information</span>
            <span className="text-[11px] text-slate-400 font-mono tracking-wide">SEC: INF_C</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="srNumber" className="block text-[13px] font-semibold text-slate-600 font-sans mb-1">
                SR Number *
              </label>
              <input
                type="text"
                id="srNumber"
                name="srNumber"
                value={formData.srNumber}
                onChange={handleInputChange}
                required
                placeholder="e.g. SR-55412"
                className="w-full text-xs border border-[#D9E2EC] rounded-[4px] px-2.5 py-1.5 focus:border-[#003366] focus:outline-hidden text-slate-900 font-mono transition-colors"
              />
            </div>

            <div>
              <label htmlFor="dateOpened" className="block text-[13px] font-semibold text-slate-600 font-sans mb-1">
                Date Opened
              </label>
              <input
                type="date"
                id="dateOpened"
                name="dateOpened"
                value={formData.dateOpened}
                onChange={handleInputChange}
                className="w-full text-xs border border-[#D9E2EC] rounded-[4px] px-2.5 py-1.5 focus:border-[#003366] focus:outline-hidden text-slate-900 font-mono transition-colors"
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-[13px] font-semibold text-slate-600 font-sans mb-1 flex items-center justify-between">
                <span>Priority</span>
                {formData.priority && (
                  <span className={`inline-block w-4 h-1.5 rounded-[2px] ${
                    formData.priority.includes("ASAP") 
                      ? "bg-[#D32F2F]" 
                      : formData.priority.includes("High") 
                      ? "bg-[#ED6C02]" 
                      : "bg-[#005B96]"
                  }`}></span>
                )}
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full text-xs border border-[#D9E2EC] rounded-[4px] px-2.5 py-1.5 bg-white focus:border-[#003366] focus:outline-hidden text-slate-900 font-sans transition-colors"
              >
                <option value="">-- Select Priority --</option>
                {masterConfig.priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="srStatus" className="block text-[13px] font-semibold text-slate-600 font-sans mb-1">
                SR Status
              </label>
              <select
                id="srStatus"
                name="srStatus"
                value={formData.srStatus}
                onChange={handleInputChange}
                className="w-full text-xs border border-[#D9E2EC] rounded-[4px] px-2.5 py-1.5 bg-white focus:border-[#003366] focus:outline-hidden text-slate-900 font-sans transition-colors"
              >
                <option value="">-- Select Status --</option>
                {masterConfig.statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* GROUP 4: COMPLAINT CLASSIFICATION */}
        <div className="bg-white border border-[#D9E2EC] rounded-[6px] p-4 shadow-none">
          <h3 className="text-[16px] font-bold text-[#003366] font-sans mb-3 pb-1 border-b border-slate-100 flex items-center justify-between">
            <span>Complaint Classification</span>
            <span className="text-[11px] text-slate-400 font-mono tracking-wide">SEC: INF_D</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label htmlFor="category" className="block text-[13px] font-semibold text-slate-600 font-sans mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full text-xs border border-[#D9E2EC] rounded-[4px] px-2.5 py-1.5 bg-white focus:border-[#003366] focus:outline-hidden text-slate-900 font-sans transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
              >
                <option value="">-- Select Category --</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="subCategory" className="block text-[13px] font-semibold text-slate-600 font-sans mb-1">
                Subcategory
              </label>
              <select
                id="subCategory"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleSubCategoryChange}
                disabled={!formData.category}
                className="w-full text-xs border border-[#D9E2EC] rounded-[4px] px-2.5 py-1.5 bg-white focus:border-[#003366] focus:outline-hidden text-slate-900 font-sans disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                <option value="">
                  {formData.category ? "-- Select Sub-category --" : "Select Category first"}
                </option>
                {subCategoriesList.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* GROUP 5: COMPLAINT DESCRIPTION (VISUAL FOCUS OF LEFT PANEL - min-h: 250px) */}
        <div className="bg-white border border-[#D9E2EC] rounded-[6px] p-4 shadow-none">
          <h3 className="text-[16px] font-bold text-[#003366] font-sans mb-2 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <span>Complaint Description</span>
              <span className="text-[#D32F2F] text-[12px] font-bold">*</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono tracking-wide">SEC: DESC</span>
          </h3>

          <textarea
            id="complaintDescription"
            name="complaintDescription"
            required
            value={formData.complaintDescription}
            onChange={handleInputChange}
            placeholder="Type or paste the complete complaint description exactly as received from field logs or email..."
            className="w-full border border-[#D9E2EC] rounded-[4px] p-3 text-xs focus:border-[#003366] focus:outline-hidden text-slate-900 font-mono leading-relaxed min-h-[250px] resize-y bg-[#F5F7FA]/30 focus:bg-white transition-all"
          />
          <p className="text-[11px] text-slate-500 font-sans leading-relaxed mt-1">
            * The recommendation engine parses and analyzes this complete description box to extract probable causes.
          </p>
        </div>

        {/* BUTTON ACTION ZONE (RECTANGULAR, 4-6px BOUNDARIES ONLY) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            type="button"
            onClick={handleClearForm}
            className="w-full py-2.5 px-4 font-semibold text-xs border border-[#D9E2EC] text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-[4px] transition-colors cursor-pointer text-center"
          >
            Clear Form
          </button>
          
          <button
            type="submit"
            disabled={isLoading || !formData.complaintDescription}
            className={`w-full py-2.5 px-4 font-semibold text-xs text-white rounded-[4px] transition-colors cursor-pointer text-center flex items-center justify-center space-x-1.5 ${
              isLoading || !formData.complaintDescription
                ? "bg-slate-300 border border-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-[#003366] hover:bg-[#002244] border border-[#003366]"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                <span>Running Engine...</span>
              </>
            ) : (
              <span>Generate Resolution</span>
            )}
          </button>

          <button
            type="button"
            onClick={onEmergencyTrigger}
            className="w-full py-2.5 px-3 font-semibold text-xs text-white bg-red-700 hover:bg-red-800 border border-red-700 rounded-[4px] shadow-[0_0_12px_rgba(185,28,28,0.5)] hover:shadow-[0_0_22px_rgba(185,28,28,0.8)] animate-pulse transition-all cursor-pointer text-center flex items-center justify-center space-x-1"
          >
            <span>🚨 Emergency Leak Demo</span>
          </button>
        </div>

      </form>
    </div>
  );
}
