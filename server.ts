import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Lazy initialization of Gemini client
  let ai: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("[Warning] GEMINI_API_KEY is not configured in the environment.");
        throw new Error("GEMINI_API_KEY is missing. Please set it in Settings > Secrets inside Google AI Studio.");
      }
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });
    }
    return ai;
  }

  // API endpoint for complaint analysis and reply generation
  app.post("/api/generate-reply", async (req, res) => {
    try {
      const client = getGeminiClient();
      const {
        customerId,
        distributorName,
        consumerName,
        consumerNumber,
        mobileNumber,
        srNumber,
        dateOpened,
        assignedTo,
        category,
        subCategory,
        priority,
        srStatus,
        complaintDescription,
      } = req.body;

      if (!complaintDescription || complaintDescription.trim() === "") {
        return res.status(400).json({ error: "Complete Complaint Description is required." });
      }

      // Build structured model query enforcing OMC policies
      const prompt = `
You are the advanced Resolution Recommendation Engine designed for LPG Sales Officers of a PSU / Oil Marketing Company (e.g., IndianOil).
Analyze the following details of an LPG-related complaint:

### Customer & Complaint Metadata:
- Customer ID: ${customerId || "N/A"}
- Distributor Name: ${distributorName || "N/A"}
- Consumer Name: ${consumerName || "N/A"}
- Consumer Number: ${consumerNumber || "N/A"}
- Mobile Number: ${mobileNumber || "N/A"}
- SR Number: ${srNumber || "N/A"}
- Date Opened: ${dateOpened || "N/A"}
- Assigned To: ${assignedTo || "N/A"}

### Classification Metadata:
- Complaint Category Selection: ${category || "N/A"}
- Complaint Sub-Category Selection: ${subCategory || "N/A"}
- Current Priority: ${priority || "N/A"}
- Current SR Status: ${srStatus || "N/A"}

### Complete Complaint Description (HIGHEST PRIORITY SOURCE OF TRUTH):
"""
${complaintDescription}
"""

---
### Your Goals & Core Logic:
1. **Analyze the Complaint Text First**: Read and dissect the Complete Complaint Description thoroughly. The Category and Sub-category are assistive guidelines; if the actual complaint text suggests a different or more urgent issue (e.g. fire hazard, cylinder leakage), ignore the dropdown dropdowns in favor of the text.
2. **Determine Severity & Sentiment**:
   - **Severity Assessment**: "Low" (e.g., subsidy queries, simple transfer/document queries), "Medium" (e.g., delay of 1-2 days, overcharging argument), "High" (e.g., persistent distributor rude behavior, prolonged delivery delays), or "Critical" (e.g., gas cylinder leakage, fire hazard, emergency).
   - **Sentiment**: "Positive", "Neutral", "Frustrated", or "Critical".
   - **Sentiment Confidence & Cause Confidence**: Provide professional estimates of confidence as percentage strings (e.g., "94%" or "88%").
3. **Formulate Two-Language Customer Responses (English & Hindi)**:
   - **English Response**: Write an exceptional, elegant, humanly but passionately crafted response in English that is ready for copy-paste by the Sales Officer. Avoid generic templates (e.g. "We received your complaint"). Instead, write a reassuring response with a touch of dramatic emphasis on safety, quality, and our uncompromising commitment to customer care (perfect to show to higher authorities). It must feel deeply empathetic and executive-level. Mention the Consumer Name ("${consumerName}") and the SR Number ("${srNumber}") if provided. Do not use placeholders. Keep it UNDER 130 words.
   - **Hindi Response**: Write an equally professional, polite, and reassuring response translated into high-quality, fluent Hindi, possessing a grand, respectful, and appropriately dramatic PSU brand tone (e.g. "भारतीय ऑयल कॉर्पोरेशन सदैव आपकी सुरक्षा और संतुष्टि के लिए पूर्णतः समर्पित है...", using words like "त्वरित संज्ञान", "अत्यंत खेद"). Avoid dry translation. It should sound like an elegant administrative letter acknowledging the customer's inconvenience and safety. Mention the Consumer Name and SR Number. Keep it UNDER 130 words.
4. **Draft AI Complaint Summary**: Provide a 2-3 line concise summary of what the customer is reporting, the likely sentiment, and the operational pain point.
5. **Establish Root Cause Analysis**:
   - **Primary Cause**: e.g., "Distributor Delivery Delay", "LPG Cylinder Valve Leak", "Subsidy Processing System Interruption", "Overcharging by Delivery Agent".
   - **Secondary Cause**: e.g., "High Booking Volume", "Mechanical Wear and Tear", "Aadhar Linkage Failure on OMC Portal", "Lack of Local Distributor Oversight".
6. **Suggest Top 3 Recommended Actions**: Provide an array of exactly 3 concrete, step-by-step actions for the Sales Officer (e.g., "1. Contact distributor immediate for priority delivery", "2. Instruct delivery manager to refund excess overcharged amount", etc.).
7. **Formulate Internal Note**:
   - **Probable Cause**: Identify the realistic operational, logistical, or equipment cause of the complaint (e.g. O-ring wear, transporter backlog, distributor delay).
   - **Suggested Action**: Provide concise, actionable instructions for the Sales Officer or Distributor to resolve this specific issue.
   - **Escalation Required**: Set to "Yes" or "No". High safety hazards (like leaks) or prolonged delays require escalation ("Yes").
8. **Estimate Confidence Level**:
   - "High": The complaint contains clear facts allowing standard operating resolutions.
   - "Medium": If resolver/distributor physical verification is required or coordinates/dates must be checked.
   - "Low": Extremely vague description, insufficient coordinate data, or contradictory category.

### Output JSON Format:
Provide your output matching this JSON-schema only:
{
  "customerResponse": "Drafted copy-paste customer response in English",
  "customerResponseHindi": "Drafted copy-paste customer response in Hindi (polite, respectful Hindi typography/words)",
  "customerSummary": "2-3 Line AI Summary",
  "sentiment": "Positive" | "Neutral" | "Frustrated" | "Critical",
  "sentimentConfidence": "percentage string, e.g. 94%",
  "severity": "Low" | "Medium" | "High" | "Critical",
  "primaryCause": "Primary cause short statement",
  "secondaryCause": "Secondary cause short statement",
  "causeConfidence": "percentage string, e.g. 88%",
  "recommendedActions": ["Action 1", "Action 2", "Action 3"],
  "probableCause": "Operational root-cause description for internal note",
  "suggestedAction": "Actionable next steps for the Sales Officer/Distributor for internal note",
  "escalationRequired": "Yes" or "No",
  "priority": "Proposed priority (e.g., '1-ASAP', '2-High', '3-Medium')",
  "srStatus": "Proposed SR Status (e.g., 'Open', 'In Progress', 'Closed')",
  "confidenceLevel": "High" | "Medium" | "Low",
  "confidenceReason": "Brief explanation of the Confidence Level assessment"
}
`;

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              customerResponse: { type: Type.STRING },
              customerResponseHindi: { type: Type.STRING },
              customerSummary: { type: Type.STRING },
              sentiment: { type: Type.STRING, description: "Must be 'Positive' or 'Neutral' or 'Frustrated' or 'Critical'" },
              sentimentConfidence: { type: Type.STRING },
              severity: { type: Type.STRING, description: "Must be 'Low' or 'Medium' or 'High' or 'Critical'" },
              primaryCause: { type: Type.STRING },
              secondaryCause: { type: Type.STRING },
              causeConfidence: { type: Type.STRING },
              recommendedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Must be exactly 3 recommended action steps"
              },
              probableCause: { type: Type.STRING },
              suggestedAction: { type: Type.STRING },
              escalationRequired: { type: Type.STRING, description: "Must be 'Yes' or 'No'" },
              priority: { type: Type.STRING },
              srStatus: { type: Type.STRING },
              confidenceLevel: { type: Type.STRING, description: "Must be 'High' or 'Medium' or 'Low'" },
              confidenceReason: { type: Type.STRING },
            },
            required: [
              "customerResponse",
              "customerResponseHindi",
              "customerSummary",
              "sentiment",
              "sentimentConfidence",
              "severity",
              "primaryCause",
              "secondaryCause",
              "causeConfidence",
              "recommendedActions",
              "probableCause",
              "suggestedAction",
              "escalationRequired",
              "priority",
              "srStatus",
              "confidenceLevel",
              "confidenceReason"
            ]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response generated from the Gemini model.");
      }

      const parsed = JSON.parse(responseText.trim());
      res.json(parsed);
    } catch (err: any) {
      console.error("Gemini route error:", err);
      res.status(500).json({ error: err.message || "Internal server error during resolution generation." });
    }
  });

  // Serve static UI assets or bind Vite dev-server mid-tier
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully operational on http://0.0.0.0:${PORT}`);
  });
}

startServer();
