import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/diagnose", async (req, res) => {
  try {
    const { category, formData, symptoms } = req.body;

    const prompt = `
You are an expert agricultural assistant.

Category: ${category}

Details:
${JSON.stringify(formData, null, 2)}

Symptoms:
${symptoms}

Respond in JSON with:
{
  "diagnosis_name":"",
  "confidence":"",
  "severity":"",
  "explanation":"",
  "organic_treatment":"",
  "chemical_treatment":"",
  "prevention_tips":""
}
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt
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
        organic_treatment: "See explanation above.",
        chemical_treatment: "Consult local supplier.",
        prevention_tips: "Monitor regularly."
      };
    }

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      diagnosis_name: "Error",
      confidence: "low",
      severity: "moderate",
      explanation: "AI diagnosis failed.",
      organic_treatment: "",
      chemical_treatment: "",
      prevention_tips: ""
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});