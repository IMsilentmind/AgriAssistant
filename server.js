import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function offlineDiagnosis(category, symptoms) {
  return {
    diagnosis_name: "Offline Diagnosis",
    confidence: "low",
    severity: "unknown",
    explanation: `Based on offline analysis: ${symptoms}`,
    organic_treatment: "Inspect plant, remove affected parts, improve hygiene.",
    chemical_treatment: "Use appropriate local agricultural treatment if needed.",
    prevention_tips: "Monitor crops regularly and avoid overwatering."
  };
}

app.post("/api/diagnose", async (req, res) => {
  const { category, symptoms } = req.body || {};

  if (!category || !symptoms) {
    return res.status(400).json({
      diagnosis_name: "Invalid Request",
      confidence: "low",
      severity: "unknown",
      explanation: "Missing category or symptoms.",
      organic_treatment: "",
      chemical_treatment: "",
      prevention_tips: ""
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    const offline = offlineDiagnosis(category, symptoms);
    return res.json(offline);
  }

  const prompt = `
You are an expert agricultural pathologist.

Category: ${category}
Symptoms: ${symptoms}

Return ONLY valid JSON in this format:
{
  "diagnosis_name": "",
  "confidence": "low|medium|high",
  "severity": "mild|moderate|severe",
  "explanation": "",
  "organic_treatment": "",
  "chemical_treatment": "",
  "prevention_tips": ""
}
`;

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    let text = response.output_text;

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      result = {
        diagnosis_name: "AI Diagnosis",
        confidence: "medium",
        severity: "moderate",
        explanation: text,
        organic_treatment: "Follow best agricultural practices.",
        chemical_treatment: "Consult local supplier.",
        prevention_tips: "Monitor regularly."
      };
    }

    return res.json(result);
  } catch (error) {
    const offline = offlineDiagnosis(category, symptoms);
    return res.json(offline);
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});