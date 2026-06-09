import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

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

const plantsFolderPath = path.join(process.cwd(), "src", "data", "plants");

let plantDatabase = {
  plants: {},
};

try {
  const plantFiles = fs
    .readdirSync(plantsFolderPath)
    .filter((file) => file.endsWith(".json"));

  for (const file of plantFiles) {
    const filePath = path.join(plantsFolderPath, file);
    const rawPlantData = fs.readFileSync(filePath, "utf-8");
    const plantData = JSON.parse(rawPlantData);

    const plantKey = path.basename(file, ".json");

    plantDatabase.plants[plantKey] = plantData;
  }

  console.log(`Plant database loaded from ${plantFiles.length} files`);
} catch (error) {
  console.log("Plant database folder not loaded:", error.message);
}

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

function findPlantMatches(category, symptoms) {
  const plants = plantDatabase.plants || {};
  const searchText = `${category} ${symptoms}`.toLowerCase();

  const matches = Object.entries(plants)
    .filter(([plantKey, plant]) => {
      const plantText = [
        plantKey,
        plant.common_name,
        plant.family,
        plant.description,
        ...(plant.diseases || []).map((disease) => disease.name),
        ...(plant.diseases || []).map((disease) => disease.description),
        ...(plant.diseases || []).flatMap((disease) => disease.symptoms || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchText
        .split(/\s+/)
        .some((word) => word.length > 3 && plantText.includes(word));
    })
    .slice(0, 5)
    .map(([plantKey, plant]) => ({
      plant_key: plantKey,
      common_name: plant.common_name,
      family: plant.family,
      description: plant.description,
      diseases: plant.diseases || [],
    }));

  return matches;
}

function findBestDiseaseMatch(category, symptoms) {
  const plants = plantDatabase.plants || {};
  const searchWords = `${category} ${symptoms}`
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3);

  let bestMatch = null;

  for (const [plantKey, plant] of Object.entries(plants)) {
    const plantWords = [
      plantKey,
      plant.common_name,
      plant.family,
      plant.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const plantNameMatched = searchWords.some((word) =>
      plantWords.includes(word)
    );

    for (const disease of plant.diseases || []) {
      const diseaseText = [
        disease.name,
        disease.description,
        ...(disease.symptoms || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchedWords = searchWords.filter((word) =>
        diseaseText.includes(word)
      );

      let score = matchedWords.length;

      if (plantNameMatched) {
        score += 2;
      }

      if (score > 0) {
        const confidenceScore = Math.min(95, Math.round((score / 6) * 100));

        const match = {
          plant_key: plantKey,
          plant_common_name: plant.common_name,
          diagnosis_name: disease.name,
          confidence_score: confidenceScore,
          confidence:
            confidenceScore >= 70
              ? "high"
              : confidenceScore >= 40
              ? "medium"
              : "low",
          severity: disease.severity || "moderate",
          explanation: `Based on your crop and symptoms, this matches ${disease.name} in the plant database. ${disease.description}`,
          organic_treatment:
            disease.organic_treatment ||
            "Remove badly affected parts and improve crop hygiene.",
          chemical_treatment:
            disease.chemical_treatment ||
            "Consult a local agricultural supplier for approved treatment.",
          prevention_tips:
            disease.prevention_tips ||
            "Monitor regularly and use healthy planting material.",
          matched_symptoms: matchedWords,
        };

        if (!bestMatch || match.confidence_score > bestMatch.confidence_score) {
          bestMatch = match;
        }
      }
    }
  }

  return bestMatch;
}

function databaseDiagnosis(category, symptoms) {
  const bestMatch = findBestDiseaseMatch(category, symptoms);

  if (!bestMatch) {
    return offlineDiagnosis(category, symptoms);
  }

  return {
    diagnosis_name: bestMatch.diagnosis_name,
    confidence: bestMatch.confidence,
    severity: bestMatch.severity,
    explanation: bestMatch.explanation,
    organic_treatment: bestMatch.organic_treatment,
    chemical_treatment: bestMatch.chemical_treatment,
    prevention_tips: bestMatch.prevention_tips,
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

  const databaseMatches = findPlantMatches(category, symptoms);
  const bestDatabaseMatch = findBestDiseaseMatch(category, symptoms);

  const prompt = `
You are an expert agricultural assistant.

Category: ${category}

Symptoms:
${symptoms}

Best database disease match:
${JSON.stringify(bestDatabaseMatch, null, 2)}

Relevant plant database matches:
${JSON.stringify(databaseMatches, null, 2)}

Use the database matches only when they are relevant. If the database does not match the case, rely on the image and symptoms instead.

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
      return res.json(databaseDiagnosis(category, symptoms));
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
    console.error("AI ERROR FULL:", error.message);

    return res.json(databaseDiagnosis(category, symptoms));
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});