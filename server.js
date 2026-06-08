import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function offlineDiagnosis(category, symptoms) {
  return {
    diagnosis_name: "Offline Diagnosis",
    confidence: "medium",
    severity: "moderate",
    explanation: `Offline analysis for ${category}: ${symptoms}`,
    organic_treatment: "Inspect affected area, remove damaged parts.",
    chemical_treatment: "Use local treatment if needed.",
    prevention_tips: "Monitor regularly and maintain hygiene.",
  };
}

app.post("/api/diagnose", async (req, res) => {
  const { category, symptoms, imageUrl } = req.body || {};

  if (!category || !symptoms) {
    return res.json({
      diagnosis_name: "Invalid Input",
      confidence: "low",
      severity: "low",
      explanation: "Missing category or symptoms.",
      organic_treatment: "",
      chemical_treatment: "",
      prevention_tips: "",
    });
  }

  const prompt = `
You are an expert agricultural assistant.

Category: ${category}

Symptoms:
${symptoms}

If an image is provided, analyse the visible crop or animal condition carefully.

Return ONLY valid JSON:
{
  "diagnosis_name": "",
  "confidence": "",
  "severity": "",
  "explanation": "",
  "organic_treatment": "",
  "chemical_treatment": "",
  "prevention_tips": ""
}
`;

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.json(offlineDiagnosis(category, symptoms));
    }

    const input = imageUrl
      ? [
          {
            role: "user",
            content: [
              { type: "input_text", text: prompt },
              { type: "input_image", image_url: imageUrl },
            ],
          },
        ]
      : prompt;

    const response = await client.responses.create({
      model: imageUrl ? "gpt-4.1" : "gpt-4.1-mini",
      input,
    });

    const text = response.output_text;

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      result = {
        diagnosis_name: "AI Response",
        confidence: "medium",
        severity: "moderate",
        explanation: text,
        organic_treatment: "See explanation.",
        chemical_treatment: "Consult supplier.",
        prevention_tips: "Monitor regularly.",
      };
    }

    return res.json(result);
  } catch (error) {
    console.log("AI failed, switching to offline mode:", error.message);
    return res.json(offlineDiagnosis(category, symptoms));
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});