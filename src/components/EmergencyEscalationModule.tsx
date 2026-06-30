import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldAlert, 
  PhoneCall, 
  PhoneOff, 
  CheckCircle, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Clock, 
  AlertOctagon, 
  Activity, 
  ChevronRight, 
  ShieldCheck, 
  Loader2, 
  Wifi, 
  Languages, 
  FileText, 
  Users, 
  Building, 
  Wrench, 
  MapPin, 
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { ComplaintData } from "../types";
import { consumerCallService, distributorCallService, CallSession } from "../utils/emergencyCallService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formData: ComplaintData;
}

const LANGUAGES = [
  { 
    code: "hi", 
    name: "Hindi (हिन्दी)", 
    locale: "hi-IN", 
    consumerText: (name: string) => `ध्यान दें, ${name} जी। हमें आपकी गैस रिसाव की शिकायत प्राप्त हुई है। कृपया शांत रहें। यदि सुरक्षित हो, तो एलपीजी रेगुलेटर तुरंत बंद कर दें। बिजली के स्विच का उपयोग न करें, माचिस या आग न जलाएं, हवा के लिए सभी दरवाजे और खिड़कियां खोल दें, और सभी को सुरक्षित स्थान पर ले जाएं। हमारे वितरक के आपातकालीन तकनीशियन को सूचित कर दिया गया है और वे रास्ते में हैं।`,
    distributorText: (name: string) => `ध्यान दें। ग्राहक ${name} द्वारा एक गंभीर एलपीजी गैस रिसाव की शिकायत दर्ज की गई है। तत्काल कार्रवाई की आवश्यकता है। कृपया बिना किसी देरी के ग्राहक से संपर्क करें और निकटतम तकनीशियन को भेजें। तकनीशियन को आवश्यक सुरक्षा उपकरण साथ ले जाने की सलाह दें और तुरंत पावती दें।`
  }
];

export default function EmergencyEscalationModule({ isOpen, onClose, formData }: Props) {
  const [currentStep, setCurrentStep] = useState<
    "idle" | "notification" | "popup-init" | "analysis" | "calling" | "connected" | "success"
  >("idle");

  const [consumerSession, setConsumerSession] = useState<CallSession | null>(null);
  const [distributorSession, setDistributorSession] = useState<CallSession | null>(null);

  const [consumerCallState, setConsumerCallState] = useState("Connecting...");
  const [distributorCallState, setDistributorCallState] = useState("Connecting...");

  const [selectedLang, setSelectedLang] = useState<string>("hi");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [speakingChannel, setSpeakingChannel] = useState<"consumer" | "distributor">("consumer");

  // Dynamic values extracted safely
  const consumerName = formData.consumerName || "Rajeev Kumar Prasad";
  const consumerNumber = formData.consumerNumber || "558902123";
  const customerId = formData.customerId || "CID489953";
  const mobileNumber = formData.mobileNumber || "9876543210";
  const category = formData.category || "Cylinder Leakage & Safety";
  const subCategory = formData.subCategory || "Valve leakage from cylinder head";
  const distributorName = formData.distributorName || "Shree Krishna Indane Gas Agency";
  const distributorContact = distributorSession?.recipientPhone || "+91 98310 12345";

  // Animated elements state
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [consumerTranscript, setConsumerTranscript] = useState<string[]>([]);
  const [distributorTranscript, setDistributorTranscript] = useState<string[]>([]);
  const [safetyChecklistStatus, setSafetyChecklistStatus] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [distributorChecklistStatus, setDistributorChecklistStatus] = useState<boolean[]>([false, false, false, false]);
  const [orchestrationProgress, setOrchestrationProgress] = useState(0);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      stopVoice();
    };
  }, []);

  // Modal Step triggers
  useEffect(() => {
    if (isOpen) {
      setCurrentStep("notification");
      const notifyTimer = setTimeout(() => {
        setCurrentStep("popup-init");
      }, 2500);
      return () => clearTimeout(notifyTimer);
    } else {
      stopVoice();
      setCurrentStep("idle");
    }
  }, [isOpen]);

  // Transition to sequential analysis nodes
  useEffect(() => {
    if (currentStep === "popup-init") {
      const popupTimer = setTimeout(() => {
        setCurrentStep("analysis");
      }, 3000);
      return () => clearTimeout(popupTimer);
    }
  }, [currentStep]);

  // Sequential AI analysis animations
  useEffect(() => {
    if (currentStep === "analysis") {
      setAnalysisProgress(0);
      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 8) {
            clearInterval(interval);
            setTimeout(() => {
              setCurrentStep("calling");
            }, 500);
            return 8;
          }
          return prev + 1;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // Dual Telephony Calling Screen simulation
  useEffect(() => {
    if (currentStep === "calling") {
      setConsumerCallState("Connecting...");
      setDistributorCallState("Connecting...");

      // Fire parallel simulation API routes
      Promise.all([
        consumerCallService.initiateConsumerCall(formData),
        distributorCallService.initiateDistributorCall(formData)
      ]).then(([cSession, dSession]) => {
        setConsumerSession(cSession);
        setDistributorSession(dSession);
      });

      const timer1 = setTimeout(() => {
        setConsumerCallState("Calling Customer...");
        setDistributorCallState("Calling Distributor...");
      }, 1000);

      const timer2 = setTimeout(() => {
        setCurrentStep("connected");
      }, 3000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [currentStep]);

  // Step 6 & 7 Orchestrated Parallel Workflow Active
  useEffect(() => {
    if (currentStep === "connected") {
      setOrchestrationProgress(0);
      setConsumerTranscript([]);
      setDistributorTranscript([]);
      setSafetyChecklistStatus([false, false, false, false, false, false, false]);
      setDistributorChecklistStatus([false, false, false, false]);

      // Progressively light up orchestration steps (nodes)
      const orchInterval = setInterval(() => {
        setOrchestrationProgress((prev) => {
          if (prev >= 10) {
            clearInterval(orchInterval);
            return 10;
          }
          return prev + 1;
        });
      }, 1200);

      // Trigger checklist animations one by one
      const safetyInterval = setInterval(() => {
        setSafetyChecklistStatus((prev) => {
          const next = [...prev];
          const idx = next.indexOf(false);
          if (idx !== -1) {
            next[idx] = true;
          } else {
            clearInterval(safetyInterval);
          }
          return next;
        });
      }, 800);

      const distributorInterval = setInterval(() => {
        setDistributorChecklistStatus((prev) => {
          const next = [...prev];
          const idx = next.indexOf(false);
          if (idx !== -1) {
            next[idx] = true;
          } else {
            clearInterval(distributorInterval);
          }
          return next;
        });
      }, 1500);

      // Trigger parallel speech sequencing exactly once
      speakSequence("consumer");

      return () => {
        clearInterval(orchInterval);
        clearInterval(safetyInterval);
        clearInterval(distributorInterval);
      };
    }
  }, [currentStep]);

  // Live Gradual Transcripts Simulator (independent left/right panels)
  useEffect(() => {
    if (currentStep === "connected") {
      const cLines = [
        "AI: Complainant line connected securely.",
        `AI: Verified consumer: ${consumerName}.`,
        "AI: Critical gas safety instructions broadcasted.",
        "AI: Customer confirmed they are outside the kitchen.",
        "AI: Advised family to wait in safe zone for responder."
      ];

      const dLines = [
        "AI: Distributor emergency hotline established.",
        `AI: Alert dispatched to ${distributorName}.`,
        "AI: Digital priority flag raised to CRITICAL.",
        "AI: Qualified emergency technician assigned.",
        "AI: Vehicle tracker shows responder dispatched (ETA: 15 mins)."
      ];

      let cIdx = 0;
      const cInterval = setInterval(() => {
        if (cIdx < cLines.length) {
          setConsumerTranscript((prev) => [...prev, cLines[cIdx]]);
          cIdx++;
        } else {
          clearInterval(cInterval);
        }
      }, 1500);

      let dIdx = 0;
      const dInterval = setInterval(() => {
        if (dIdx < dLines.length) {
          setDistributorTranscript((prev) => [...prev, dLines[dIdx]]);
          dIdx++;
        } else {
          clearInterval(dInterval);
        }
      }, 1800);

      return () => {
        clearInterval(cInterval);
        clearInterval(dInterval);
      };
    }
  }, [currentStep, consumerName, distributorName]);

  const speakSequence = (channel: "consumer" | "distributor") => {
    const currentLangCode = "hi";
    setSpeakingChannel(channel);
    setSelectedLang(currentLangCode);

    speakLanguage(currentLangCode, channel, () => {
      if (channel === "consumer") {
        speakSequence("distributor");
      } else {
        setCurrentStep("success");
      }
    });
  };

  const speakLanguage = (langCode: string, channel: "consumer" | "distributor", onEndCallback?: () => void) => {
    stopVoice();

    const langInfo = LANGUAGES.find((l) => l.code === langCode);
    if (!langInfo) return;

    setSelectedLang(langCode);
    setSpeakingChannel(channel);
    setIsPlaying(true);

    if (!synthRef.current) {
      // Simulative backup if SpeechSynthesis not loaded
      const duration = channel === "consumer" ? 5000 : 4000;
      const timeout = setTimeout(() => {
        setIsPlaying(false);
        if (onEndCallback) {
          onEndCallback();
        }
      }, duration);
      return;
    }

    const textToSpeak = channel === "consumer" 
      ? langInfo.consumerText(consumerName) 
      : langInfo.distributorText(consumerName);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    const voices = synthRef.current.getVoices();
    const voice = voices.find((v) => v.lang.startsWith(langCode)) || 
                  voices.find((v) => v.lang.startsWith("en"));
    if (voice) {
      utterance.voice = voice;
    }

    utterance.lang = langInfo.locale;
    utterance.volume = isMuted ? 0 : volume;
    utterance.rate = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
      if (onEndCallback) {
        onEndCallback();
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      if (onEndCallback) onEndCallback();
    };

    synthRef.current.speak(utterance);
  };

  const stopVoice = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
  };

  const togglePause = () => {
    if (!synthRef.current) return;
    if (synthRef.current.speaking) {
      if (synthRef.current.paused) {
        synthRef.current.resume();
        setIsPlaying(true);
      } else {
        synthRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      speakLanguage(selectedLang, speakingChannel);
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (synthRef.current) {
      synthRef.current.cancel();
      const textToSpeak = speakingChannel === "consumer"
        ? LANGUAGES.find((l) => l.code === selectedLang)?.consumerText(consumerName) || ""
        : LANGUAGES.find((l) => l.code === selectedLang)?.distributorText(consumerName) || "";
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = selectedLang;
      utterance.volume = nextMute ? 0 : volume;
      synthRef.current.speak(utterance);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (utteranceRef.current) {
      utteranceRef.current.volume = val;
    }
  };

  const handleReset = () => {
    stopVoice();
    if (consumerSession) consumerCallService.disconnectCall(consumerSession.id);
    if (distributorSession) distributorCallService.disconnectCall(distributorSession.id);
    setConsumerSession(null);
    setDistributorSession(null);
    setCurrentStep("idle");
    onClose();
  };

  const handleForceComplete = () => {
    stopVoice();
    setCurrentStep("success");
  };

  if (!isOpen) return null;

  const analysisNodes = [
    { title: "Complaint Received", icon: "📬" },
    { title: "Complaint Classification", icon: "🏷️" },
    { title: "AI Safety Verification", icon: "🛡️" },
    { title: "Risk Assessment", icon: "📊" },
    { title: "Critical Priority Assigned", icon: "🚨" },
    { title: "Distributor Lookup", icon: "🔍" },
    { title: "Nearest Distributor Verified", icon: "📍" },
    { title: "Emergency Call Initiated", icon: "📞" },
  ];

  const safetyChecklist = [
    "Close LPG regulator",
    "Do not switch ON/OFF any electrical appliance",
    "Do not light matchsticks",
    "Open doors and windows",
    "Move family members outside",
    "Wait for technician",
    "Keep mobile phone available"
  ];

  const distributorChecklist = [
    "Complaint Received",
    "Technician Assigned",
    "Technician Contacted",
    "Vehicle Dispatched"
  ];

  const orchestrationNodes = [
    { label: "Complaint Received", step: 0 },
    { label: "AI Risk Assessment", step: 1 },
    { label: "Critical Classification", step: 2 },
    { label: "Emergency Workflow Started", step: 3 },
    { label: "Consumer Safety Call", step: 4 },
    { label: "Customer Guided", step: 5 },
    { label: "Distributor Emergency Call", step: 6 },
    { label: "Technician Assigned", step: 7 },
    { label: "Technician Dispatched", step: 8 },
    { label: "Customer Protected", step: 9 },
    { label: "Emergency Escalation Completed", step: 10 }
  ];

  return (
    <div id="escalation-root" className="fixed inset-0 z-[9999] flex flex-col items-center justify-center font-sans">
      
      {/* Step 1 Slide down notification banner */}
      <AnimatePresence>
        {currentStep === "notification" && (
          <motion.div 
            id="emergency-notify-banner"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-[450px] bg-red-950 border-l-8 border-red-500 text-white rounded-[6px] shadow-2xl p-4 z-[10000] flex items-start space-x-3.5"
          >
            <div className="bg-red-900/60 p-2 rounded-full text-red-400 animate-pulse mt-0.5">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex-1 font-sans text-xs">
              <h4 className="font-black text-red-400 uppercase tracking-widest text-[11px] leading-tight">
                Emergency Complaint Detected
              </h4>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-2.5 border-t border-red-900/40 pt-2 text-[11px]">
                <div>
                  <span className="text-red-300 font-bold uppercase text-[9px] block">Complaint Category</span>
                  <span className="font-medium">{category}</span>
                </div>
                <div>
                  <span className="text-red-300 font-bold uppercase text-[9px] block">Complaint Sub Category</span>
                  <span className="font-medium">{subCategory}</span>
                </div>
                <div className="col-span-2 flex items-center justify-between mt-1 bg-red-900/30 p-1.5 rounded">
                  <span className="text-red-300 font-bold uppercase text-[9px]">AI Risk Classification</span>
                  <span className="font-black text-red-400 bg-white px-2 py-0.5 rounded text-[10px] tracking-wider animate-pulse">
                    CRITICAL
                  </span>
                </div>
              </div>
              <p className="text-red-200 mt-2 font-semibold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block"></span>
                <span>Immediate Distributor Escalation Started...</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dim overlay background */}
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs transition-opacity" />

      {/* Main Government Enterprise dynamic dialog portal */}
      <div className="relative bg-slate-900/95 border border-slate-700/60 shadow-2xl rounded-[12px] overflow-hidden w-full max-w-6xl h-[95vh] max-h-[900px] flex flex-col m-4 text-white">
        
        {/* Top Header bar */}
        <div className="bg-slate-950 px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <span className="bg-red-600 text-white rounded-full p-1.5 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-black uppercase tracking-widest text-red-500 leading-none">
                🚨 AI Emergency Multi-Channel Coordinator
              </h2>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                IndianOil Government Enterprise Safety Room • Telephony Simulation Protocol
              </span>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-[4px] font-bold transition-all cursor-pointer uppercase"
          >
            Reset & Cancel
          </button>
        </div>

        {/* Dynamic step-by-step contents */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6">
          
          {/* STEP 3: Initial Popup delay screen */}
          {currentStep === "popup-init" && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center animate-pulse">
                  <PhoneCall className="w-10 h-10 text-red-500 animate-bounce" />
                </div>
                <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping scale-75 opacity-75" />
              </div>
              <div className="max-w-md">
                <h3 className="text-2xl font-black text-red-400 tracking-wide uppercase">
                  🚨 AI Emergency Response Activated
                </h3>
                <p className="text-slate-300 mt-2 text-sm leading-relaxed">
                  Dual-channel calling system is initializing. Connecting consumer lines for immediate safety instructions and distributor hotline for instant technician allocation.
                </p>
                <div className="mt-8 bg-slate-950/60 p-4 rounded-[6px] border border-slate-800 text-xs text-slate-400 font-mono inline-block">
                  <span className="text-slate-500 uppercase block tracking-wider font-bold mb-1">Simulated Hotline Connections</span>
                  <div className="text-lg font-black text-white">
                    Estimated Connection Time: 3 Seconds
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Sequential Analysis Node Grid */}
          {currentStep === "analysis" && (
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-2" />
                <h3 className="text-lg font-black uppercase tracking-wider text-red-400">
                  AI Critical Risk Verification
                </h3>
                <p className="text-xs text-slate-400">Locking geographic boundaries and fetching target registry variables...</p>
              </div>

              <div className="w-full space-y-2 pt-4">
                {analysisNodes.map((node, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: analysisProgress >= idx ? 1 : 0.2, 
                      x: analysisProgress >= idx ? 0 : -10 
                    }}
                    className={`flex items-center justify-between p-3 rounded-[4px] border ${
                      analysisProgress === idx 
                        ? "bg-red-950/40 border-red-500/60 text-white" 
                        : analysisProgress > idx 
                        ? "bg-slate-950/60 border-emerald-500/30 text-emerald-400" 
                        : "bg-slate-950/20 border-slate-800 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center space-x-3 text-xs font-semibold">
                      <span>{node.icon}</span>
                      <span>{node.title}</span>
                    </div>
                    <div>
                      {analysisProgress > idx ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : analysisProgress === idx ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-800" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Dual Calling Screen */}
          {currentStep === "calling" && (
            <div className="h-full flex flex-col justify-center space-y-8">
              <div className="text-center max-w-md mx-auto space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto" />
                <h3 className="text-xl font-black uppercase text-red-500 tracking-wider">
                  AI Dual Line Connection Pool
                </h3>
                <p className="text-xs text-slate-400">
                  Coordinating synchronous telephony hotlines to Complainant and Regional Agency in parallel.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
                
                {/* Consumer Line Panel */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-[8px] p-5 flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="w-16 h-16 rounded-full bg-red-900/40 border border-red-500/40 text-red-400 flex items-center justify-center"
                    >
                      <PhoneCall className="w-6 h-6 animate-pulse" />
                    </motion.div>
                    <div className="absolute inset-0 border border-red-500 rounded-full animate-ping opacity-40 scale-110" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-300">📞 Consumer Safety Call</h4>
                    <span className="text-[10px] text-red-400 font-mono font-bold uppercase tracking-widest block mt-1">
                      {consumerCallState}
                    </span>
                  </div>
                  <div className="w-full text-xs text-left bg-slate-900/60 p-3.5 rounded border border-slate-800 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold uppercase text-[9px]">Complainant</span>
                      <span className="font-bold text-white">{consumerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold uppercase text-[9px]">Consumer ID</span>
                      <span className="font-mono text-slate-300">{consumerNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold uppercase text-[9px]">Mobile Phone</span>
                      <span className="font-mono text-slate-300">{mobileNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Distributor Line Panel */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-[8px] p-5 flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="w-16 h-16 rounded-full bg-red-900/40 border border-red-500/40 text-red-400 flex items-center justify-center"
                    >
                      <PhoneCall className="w-6 h-6 animate-pulse" />
                    </motion.div>
                    <div className="absolute inset-0 border border-red-500 rounded-full animate-ping opacity-40 scale-110" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-300">🚨 Distributor Emergency Call</h4>
                    <span className="text-[10px] text-red-400 font-mono font-bold uppercase tracking-widest block mt-1">
                      {distributorCallState}
                    </span>
                  </div>
                  <div className="w-full text-xs text-left bg-slate-900/60 p-3.5 rounded border border-slate-800 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold uppercase text-[9px]">Agency Name</span>
                      <span className="font-bold text-white">{distributorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold uppercase text-[9px]">Emergency Contact</span>
                      <span className="font-mono text-slate-300">{distributorContact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold uppercase text-[9px]">Complaint Nature</span>
                      <span className="font-semibold text-red-400">{subCategory}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 6 & 7: Connection Active Orchestrator Dashboard */}
          {currentStep === "connected" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full content-start overflow-y-auto">
              
              {/* Left Column: Consumer Call Safety Panel */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Consumer Call Header */}
                <div className="bg-slate-950 border border-emerald-500/30 rounded-[8px] p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-bl text-[8px] font-mono font-bold flex items-center space-x-1 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                    <span>Active</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-emerald-950 p-2.5 rounded-full text-emerald-400 shrink-0">
                      <PhoneCall className="w-5 h-5 text-emerald-400 animate-pulse" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-xs uppercase tracking-wider text-emerald-400 leading-none truncate">
                        📞 Consumer Safety Call
                      </h4>
                      <p className="text-[9px] font-mono text-slate-500 mt-1 truncate">
                        Call ID: {consumerSession?.id || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3.5 border-t border-slate-900 pt-2.5 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold uppercase text-[8px]">Consumer</span>
                      <span className="font-bold text-slate-200 truncate max-w-[150px]">{consumerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold uppercase text-[8px]">Consumer Number</span>
                      <span className="font-mono text-slate-400">{consumerNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold uppercase text-[8px]">Mobile Phone</span>
                      <span className="font-mono text-slate-400">{mobileNumber}</span>
                    </div>
                    <div className="flex justify-between items-center bg-emerald-950/20 p-1 rounded mt-1">
                      <span className="text-emerald-500 font-bold uppercase text-[8px]">Hotline Status</span>
                      <span className="font-bold text-emerald-400 text-[10px]">Call Connected</span>
                    </div>
                  </div>
                </div>

                {/* Customer Safety Checklist with Animated checkmarks */}
                <div className="bg-slate-950 border border-slate-850 rounded-[8px] p-4">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-amber-500 mb-2 border-b border-slate-900 pb-1 flex justify-between items-center">
                    <span>⚠️ MANDATORY CUSTOMER ADVICE</span>
                    <span className="text-[8px] font-mono text-slate-500">Broadcasting...</span>
                  </h4>
                  <div className="space-y-1.5">
                    {safetyChecklist.map((item, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-start space-x-2 p-1.5 rounded transition-all text-xs font-semibold ${
                          safetyChecklistStatus[idx] 
                            ? "bg-emerald-950/20 text-slate-200" 
                            : "opacity-30 text-slate-500"
                        }`}
                      >
                        <span className={`rounded-full p-0.5 mt-0.5 shrink-0 ${
                          safetyChecklistStatus[idx] ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                        }`}>
                          <Check className="w-3 h-3" />
                        </span>
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Center Column: Live AI Orchestration / Mission Control */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Live AI Orchestration Panel */}
                <div className="bg-slate-950 border border-slate-800 rounded-[8px] p-4 flex flex-col h-[400px] overflow-hidden">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-900 pb-1.5 flex justify-between items-center font-mono">
                    <span>🛡️ AI Orchestration Monitor</span>
                    <span className="text-[8px] text-red-500 bg-red-950/40 px-1.5 py-0.5 rounded font-bold animate-pulse">
                      ● SYSTEM ACTIVE
                    </span>
                  </h4>

                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-slate-900">
                    {orchestrationNodes.map((node, idx) => {
                      const isComplete = orchestrationProgress >= node.step;
                      return (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="flex flex-col items-center">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all ${
                              isComplete 
                                ? "bg-emerald-950 border-emerald-500 text-emerald-400" 
                                : "bg-slate-900 border-slate-800 text-slate-600"
                            }`}>
                              {idx + 1}
                            </div>
                            {idx < orchestrationNodes.length - 1 && (
                              <div className={`w-0.5 h-3 ${
                                isComplete ? "bg-emerald-500/50" : "bg-slate-850"
                              }`} />
                            )}
                          </div>
                          <span className={`text-[10.5px] font-semibold transition-all ${
                            isComplete ? "text-emerald-400 font-bold" : "text-slate-600"
                          }`}>
                            {node.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Distributor Call Panel */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Distributor Call Header */}
                <div className="bg-slate-950 border border-red-500/30 rounded-[8px] p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-bl text-[8px] font-mono font-bold flex items-center space-x-1 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                    <span>Connected</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-red-950 p-2.5 rounded-full text-red-400 shrink-0">
                      <PhoneCall className="w-5 h-5 text-red-400 animate-pulse" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-xs uppercase tracking-wider text-red-400 leading-none truncate">
                        🚨 Distributor Emergency Call
                      </h4>
                      <p className="text-[9px] font-mono text-slate-500 mt-1 truncate">
                        Call ID: {distributorSession?.id || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3.5 border-t border-slate-900 pt-2.5 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold uppercase text-[8px]">Distributor</span>
                      <span className="font-bold text-slate-200 truncate max-w-[150px]">{distributorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold uppercase text-[8px]">Emergency Contact</span>
                      <span className="font-mono text-slate-400">{distributorContact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold uppercase text-[8px]">Complainant</span>
                      <span className="font-bold text-slate-400 truncate max-w-[150px]">{consumerName}</span>
                    </div>
                    <div className="flex justify-between items-center bg-emerald-950/20 p-1 rounded mt-1">
                      <span className="text-emerald-500 font-bold uppercase text-[8px]">Priority Code</span>
                      <span className="font-black text-red-400 text-[10px] tracking-wider animate-pulse">CRITICAL</span>
                    </div>
                  </div>
                </div>

                {/* Distributor Response Panel with sequentially checked milestones */}
                <div className="bg-slate-950 border border-slate-850 rounded-[8px] p-4 text-xs">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-red-400 mb-2 border-b border-slate-900 pb-1 flex justify-between items-center">
                    <span>📍 DISTRIBUTOR DISPATCH ROOM</span>
                    <span className="text-[8px] font-mono text-slate-500">Synchronizing...</span>
                  </h4>
                  <div className="space-y-1.5">
                    {distributorChecklist.map((item, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-center justify-between p-2 rounded transition-all font-semibold ${
                          distributorChecklistStatus[idx] 
                            ? "bg-slate-900/60 text-slate-200" 
                            : "opacity-30 text-slate-500"
                        }`}
                      >
                        <span className="truncate">{item}</span>
                        <div>
                          {distributorChecklistStatus[idx] ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-800" />
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="bg-slate-900 p-2 rounded text-center border border-slate-850 mt-1 flex justify-between items-center">
                      <span className="text-slate-500 font-bold uppercase text-[8px]">Estimated Arrival</span>
                      <span className="font-black text-emerald-400 animate-pulse font-mono text-[11px]">15 Minutes</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Connected state bottom console bar: Live Transcripts & Dual Audio Selector */}
          {currentStep === "connected" && (
            <div className="mt-5 space-y-4 border-t border-slate-800 pt-5">
              
              {/* Dual Transcripts section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Consumer Live Transcript Panel */}
                <div className="bg-slate-950 border border-slate-850 rounded-[6px] p-3 flex flex-col h-[150px]">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">
                    🎙️ Consumer Safety Live Transcript
                  </span>
                  <div className="flex-1 overflow-y-auto space-y-1 pr-1 font-mono text-[10.5px]">
                    {consumerTranscript.map((line, idx) => (
                      <div key={idx} className="border-l-2 border-slate-800 pl-2 py-0.5 text-slate-300">
                        {line}
                      </div>
                    ))}
                    {isPlaying && speakingChannel === "consumer" && (
                      <div className="text-[9px] text-emerald-500 animate-pulse font-bold mt-1 uppercase flex items-center space-x-1.5">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Broadcasting safety guidance...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Distributor Live Transcript Panel */}
                <div className="bg-slate-950 border border-slate-850 rounded-[6px] p-3 flex flex-col h-[150px]">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">
                    🎙️ Distributor Emergency Live Transcript
                  </span>
                  <div className="flex-1 overflow-y-auto space-y-1 pr-1 font-mono text-[10.5px]">
                    {distributorTranscript.map((line, idx) => (
                      <div key={idx} className="border-l-2 border-slate-800 pl-2 py-0.5 text-slate-300">
                        {line}
                      </div>
                    ))}
                    {isPlaying && speakingChannel === "distributor" && (
                      <div className="text-[9px] text-red-400 animate-pulse font-bold mt-1 uppercase flex items-center space-x-1.5">
                        <Loader2 className="w-3 h-3 animate-spin text-red-400" />
                        <span>Broadcasting dealer dispatcher order...</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Dashboard KPI cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 bg-slate-950/60 p-3 rounded border border-slate-850">
                <div className="text-center">
                  <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">Response Time</span>
                  <div className="flex items-center justify-center space-x-1.5 mt-0.5">
                    <span className="text-xs font-bold text-slate-400 line-through leading-none">18m</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span className="text-xs font-black text-emerald-400 leading-none">45s</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">Priority Level</span>
                  <span className="text-xs font-black text-red-400 font-mono inline-block mt-0.5">CRITICAL</span>
                </div>
                <div className="text-center">
                  <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">Consumer Hotline</span>
                  <span className="text-xs font-black text-emerald-400 inline-block mt-0.5">CONNECTED</span>
                </div>
                <div className="text-center">
                  <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">Distributor Status</span>
                  <span className="text-xs font-black text-emerald-400 inline-block mt-0.5">YES (Hotline Open)</span>
                </div>
                <div className="text-center col-span-2 md:col-span-1">
                  <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">AI Escalation</span>
                  <span className="text-xs font-black text-emerald-400 inline-block mt-0.5">SUCCESS</span>
                </div>
              </div>

              {/* Bottom Interactive HUD: Media controls & Language switch */}
              <div className="bg-slate-950 border border-slate-800 rounded-[8px] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Language selection dropdown and automated sequencing */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center space-x-2">
                    <Languages className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Voice Broadcast Operator:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedLang}
                      onChange={(e) => {
                        speakLanguage(e.target.value, speakingChannel);
                      }}
                      className="bg-slate-900 border border-slate-800 text-white text-xs rounded px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-sans cursor-pointer font-bold"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2.5 py-1.5 rounded font-mono font-bold uppercase tracking-wider">
                      Hindi Demo Active (Single Playback)
                    </span>
                  </div>
                </div>

                {/* Media Playback bar */}
                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                  
                  {/* Status announcement card */}
                  <div className="text-left md:text-right text-[10.5px] font-mono leading-tight shrink-0 bg-slate-900/40 px-3 py-1.5 rounded border border-slate-850">
                    <span className="text-slate-500 block uppercase font-bold text-[8px]">Now Broadcasting</span>
                    <span className="text-emerald-400 font-black uppercase">
                      {LANGUAGES.find((l) => l.code === selectedLang)?.name || "English"} 
                      <span className="text-slate-400 font-normal"> ({speakingChannel === "consumer" ? "Consumer" : "Distributor"})</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={togglePause}
                      title={isPlaying ? "Pause" : "Play"}
                      className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded p-2 cursor-pointer transition-all flex items-center justify-center"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 text-slate-950" /> : <Play className="w-4 h-4 text-slate-950" />}
                    </button>
                    <button
                      onClick={() => speakLanguage(selectedLang, speakingChannel)}
                      title="Replay"
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 rounded p-2 cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Volume Slider & Mute button */}
                  <div className="flex items-center space-x-2 bg-slate-900/50 p-1.5 rounded border border-slate-850">
                    <button
                      onClick={toggleMute}
                      className="text-slate-400 hover:text-white transition-all cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-16 accent-emerald-500 bg-slate-800 h-1 rounded-full cursor-pointer"
                    />
                  </div>

                  {/* Fast completion zone */}
                  <button
                    onClick={handleForceComplete}
                    className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-[4px] cursor-pointer shadow-md transition-all flex items-center space-x-1 shrink-0"
                  >
                    <span>Complete</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                </div>

              </div>

            </div>
          )}

          {/* STEP 8: Success screen */}
          {currentStep === "success" && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-xl mx-auto">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-emerald-950/40 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center shadow-lg"
              >
                <ShieldCheck className="w-11 h-11 text-emerald-400 animate-pulse" />
              </motion.div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-emerald-400 tracking-wide uppercase font-sans">
                  ✅ Emergency Response Coordinated Successfully
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-semibold">
                  Consumer Safety Instructions Delivered • Distributor Notified • Emergency Technician Dispatched • Customer Awaiting Technician • Incident Escalated Successfully
                </p>
              </div>

              {/* Status details card */}
              <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-[6px] w-full text-xs text-left space-y-3 font-sans text-slate-400">
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span>Consumer Call Status:</span>
                  <span className="font-bold text-emerald-400 uppercase">Guided & Protected (OK)</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span>Distributor Escalation Status:</span>
                  <span className="font-bold text-emerald-400 uppercase font-mono">Acknowledged (ACK-OK)</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span>Emergency Technician Allocation:</span>
                  <span className="font-semibold text-slate-200">Safety Responder Assigned & En Route</span>
                </div>
                <div className="flex justify-between">
                  <span>OMC Central Safety Logging:</span>
                  <span className="font-semibold text-slate-200 font-mono text-[10px]">Logged in IndianOil Central Safety DB</span>
                </div>
              </div>

              {/* Unified confirmation badges */}
              <div className="flex flex-wrap gap-2.5 justify-center w-full pt-1">
                <span className="bg-slate-950 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-[4px] text-[10.5px] font-bold uppercase">
                  🟢 Consumer Contacted
                </span>
                <span className="bg-slate-950 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-[4px] text-[10.5px] font-bold uppercase">
                  🟢 Safety Instructions Delivered
                </span>
                <span className="bg-slate-950 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-[4px] text-[10.5px] font-bold uppercase">
                  🟢 Distributor Contacted
                </span>
                <span className="bg-slate-950 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-[4px] text-[10.5px] font-bold uppercase">
                  🟢 Technician Assigned
                </span>
                <span className="bg-slate-950 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-[4px] text-[10.5px] font-bold uppercase">
                  🟢 Technician Dispatched
                </span>
                <span className="bg-slate-950 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-[4px] text-[10.5px] font-bold uppercase animate-pulse">
                  🟢 AI Monitoring Active
                </span>
              </div>

              {/* Reset button to clear everything and close safely */}
              <button
                onClick={handleReset}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-[4px] cursor-pointer transition-all flex items-center space-x-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Demo</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
