import { ComplaintData } from "../types";

export interface CallSession {
  id: string;
  provider: "Simulation" | "Exotel" | "Knowlarity" | "Twilio" | "BSNL" | "Asterisk" | "Cisco";
  status: "idle" | "connecting" | "calling" | "connected" | "speaking" | "completed" | "failed";
  timestamp: string;
  duration: number;
  recipientName: string;
  recipientPhone: string;
  meta: {
    consumerName: string;
    consumerNumber: string;
    mobileNumber: string;
    distributorName: string;
    distributorContact: string;
    category: string;
    subCategory: string;
  };
}

// ConsumerCallService – responsible for automated customer safety notifications
export interface ConsumerCallService {
  initiateConsumerCall(complaint: ComplaintData): Promise<CallSession>;
  getCallStatus(sessionId: string): Promise<CallSession>;
  disconnectCall(sessionId: string): Promise<void>;
}

// DistributorCallService – responsible for distributor escalation and technician dispatch
export interface DistributorCallService {
  initiateDistributorCall(complaint: ComplaintData): Promise<CallSession>;
  getCallStatus(sessionId: string): Promise<CallSession>;
  disconnectCall(sessionId: string): Promise<void>;
}

export class SimulatedConsumerCallService implements ConsumerCallService {
  private activeSession: CallSession | null = null;

  async initiateConsumerCall(complaint: ComplaintData): Promise<CallSession> {
    const mobileNumber = complaint.mobileNumber || "9876543210";
    this.activeSession = {
      id: `CNS-${Math.floor(100000 + Math.random() * 900000)}`,
      provider: "Simulation",
      status: "connecting",
      timestamp: new Date().toLocaleTimeString(),
      duration: 0,
      recipientName: complaint.consumerName || "Rajeev Kumar Prasad",
      recipientPhone: mobileNumber,
      meta: {
        consumerName: complaint.consumerName || "Rajeev Kumar Prasad",
        consumerNumber: complaint.consumerNumber || "558902123",
        mobileNumber: mobileNumber,
        distributorName: complaint.distributorName || "Shree Krishna Indane Gas Agency",
        distributorContact: "+91 94440 12345", // dummy default
        category: complaint.category || "Cylinder Leakage & Safety",
        subCategory: complaint.subCategory || "Valve leakage from cylinder head",
      }
    };
    return this.activeSession;
  }

  async getCallStatus(sessionId: string): Promise<CallSession> {
    if (!this.activeSession || this.activeSession.id !== sessionId) {
      throw new Error("Consumer call session not found");
    }
    return { ...this.activeSession };
  }

  async disconnectCall(sessionId: string): Promise<void> {
    if (this.activeSession && this.activeSession.id === sessionId) {
      this.activeSession.status = "completed";
    }
  }
}

export class SimulatedDistributorCallService implements DistributorCallService {
  private activeSession: CallSession | null = null;

  async initiateDistributorCall(complaint: ComplaintData): Promise<CallSession> {
    const distributorContact = this.generateDistributorContact(complaint.distributorName || "");
    this.activeSession = {
      id: `DST-${Math.floor(100000 + Math.random() * 900000)}`,
      provider: "Simulation",
      status: "connecting",
      timestamp: new Date().toLocaleTimeString(),
      duration: 0,
      recipientName: complaint.distributorName || "Shree Krishna Indane Gas Agency",
      recipientPhone: distributorContact,
      meta: {
        consumerName: complaint.consumerName || "Rajeev Kumar Prasad",
        consumerNumber: complaint.consumerNumber || "558902123",
        mobileNumber: complaint.mobileNumber || "9876543210",
        distributorName: complaint.distributorName || "Shree Krishna Indane Gas Agency",
        distributorContact,
        category: complaint.category || "Cylinder Leakage & Safety",
        subCategory: complaint.subCategory || "Valve leakage from cylinder head",
      }
    };
    return this.activeSession;
  }

  async getCallStatus(sessionId: string): Promise<CallSession> {
    if (!this.activeSession || this.activeSession.id !== sessionId) {
      throw new Error("Distributor call session not found");
    }
    return { ...this.activeSession };
  }

  async disconnectCall(sessionId: string): Promise<void> {
    if (this.activeSession && this.activeSession.id === sessionId) {
      this.activeSession.status = "completed";
    }
  }

  private generateDistributorContact(name: string): string {
    if (!name) return "+91 94440 12345";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const suffix = Math.abs(hash % 90000) + 10000;
    return `+91 98310 ${suffix}`;
  }
}

export const consumerCallService: ConsumerCallService = new SimulatedConsumerCallService();
export const distributorCallService: DistributorCallService = new SimulatedDistributorCallService();
