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
    confidence: "low",
    confidence_score: 20,
    severity: "unknown",
    explanation: `Offline analysis for ${category}: ${symptoms}`,
    organic_treatment: "Inspect affected area, remove damaged parts.",
    chemical_treatment: "Use local treatment if needed.",
    prevention_tips: "Monitor regularly and maintain hygiene.",
    top_matches: [],
  };
}

function normaliseText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSearchWords(category, symptoms) {
  return normaliseText(`${category} ${symptoms}`)
    .split(" ")
    .filter((word) => word.length > 3);
}

function findPlantMatches(category, symptoms) {
  const plants = plantDatabase.plants || {};
  const searchText = normaliseText(`${category} ${symptoms}`);

  const matches = Object.entries(plants)
    .filter(([plantKey, plant]) => {
      const plantText = normaliseText(
        [
          plantKey,
          plant.common_name,
          ...(plant.crop_aliases || []),
          plant.family,
          plant.description,
          ...(plant.diseases || []).map((disease) => disease.name),
          ...(plant.diseases || []).map((disease) => disease.description),
          ...(plant.diseases || []).flatMap((disease) => disease.symptoms || []),
        ]
          .filter(Boolean)
          .join(" ")
      );

      return searchText
        .split(" ")
        .some((word) => word.length > 3 && plantText.includes(word));
    })
    .slice(0, 5)
    .map(([plantKey, plant]) => ({
      plant_key: plantKey,
      common_name: plant.common_name,
      crop_aliases: plant.crop_aliases || [],
      family: plant.family,
      description: plant.description,
      diseases: plant.diseases || [],
    }));

  return matches;
}

function scoreDiseaseMatch(plantKey, plant, disease, searchWords) {
  const plantWords = normaliseText(
    [
      plantKey,
      plant.common_name,
      ...(plant.crop_aliases || []),
      plant.family,
      plant.description,
    ]
      .filter(Boolean)
      .join(" ")
  );

  const diseaseName = normaliseText(disease.name);
  const diseaseDescription = normaliseText(disease.description);
  const diseaseSymptoms = (disease.symptoms || []).map((symptom) =>
    normaliseText(symptom)
  );

  const plantNameMatched = searchWords.some((word) => plantWords.includes(word));

  const matchedSymptoms = diseaseSymptoms.filter((symptom) =>
    searchWords.some((word) => symptom.includes(word))
  );

  const matchedDiseaseWords = searchWords.filter(
    (word) => diseaseName.includes(word) || diseaseDescription.includes(word)
  );

  let score = 0;

  if (plantNameMatched) {
    score += 30;
  }

  score += matchedSymptoms.length * 25;
  score += matchedDiseaseWords.length * 10;

  const uniqueMatchedWords = [
    ...new Set([
      ...matchedDiseaseWords,
      ...matchedSymptoms.flatMap((symptom) => symptom.split(" ")),
    ]),
  ].filter((word) => searchWords.includes(word));

  if (uniqueMatchedWords.length >= 3) {
    score += 10;
  }

  const confidenceScore = Math.min(95, score);

  if (confidenceScore <= 0) {
    return null;
  }

  return {
    plant_key: plantKey,
    plant_common_name: plant.common_name,
    crop_aliases: plant.crop_aliases || [],
    diagnosis_name: disease.name,
    confidence_score: confidenceScore,
    confidence:
      confidenceScore >= 75
        ? "high"
        : confidenceScore >= 45
        ? "medium"
        : "low",
    severity: disease.severity || "moderate",
    explanation: `Based on the crop and symptoms provided, this matches ${disease.name}. ${disease.description}`,
    organic_treatment:
      disease.organic_treatment ||
      "Remove badly affected parts and improve crop hygiene.",
    chemical_treatment:
      disease.chemical_treatment ||
      "Consult a local agricultural supplier for approved treatment.",
    prevention_tips:
      disease.prevention_tips ||
      "Monitor regularly and use healthy planting material.",
    matched_symptoms: matchedSymptoms,
    matched_words: uniqueMatchedWords,
  };
}

function findTopDiseaseMatches(category, symptoms) {
  const plants = plantDatabase.plants || {};
  const searchWords = getSearchWords(category, symptoms);
  const matches = [];

  for (const [plantKey, plant] of Object.entries(plants)) {
    for (const disease of plant.diseases || []) {
      const match = scoreDiseaseMatch(plantKey, plant, disease, searchWords);

      if (match) {
        matches.push(match);
      }
    }
  }

  return matches
    .sort((a, b) => b.confidence_score - a.confidence_score)
    .slice(0, 3);
}

function findBestDiseaseMatch(category, symptoms) {
  const topMatches = findTopDiseaseMatches(category, symptoms);
  return topMatches[0] || null;
}

function databaseDiagnosis(category, symptoms) {
  const topMatches = findTopDiseaseMatches(category, symptoms);
  const bestMatch = topMatches[0];

  if (!bestMatch) {
    return offlineDiagnosis(category, symptoms);
  }

  return {
    diagnosis_name: bestMatch.diagnosis_name,
    confidence: bestMatch.confidence,
    confidence_score: bestMatch.confidence_score,
    severity: bestMatch.severity,
    explanation: bestMatch.explanation,
    organic_treatment: bestMatch.organic_treatment,
    chemical_treatment: bestMatch.chemical_treatment,
    prevention_tips: bestMatch.prevention_tips,
    top_matches: topMatches.map((match) => ({
      diagnosis_name: match.diagnosis_name,
      plant_common_name: match.plant_common_name,
      confidence: match.confidence,
      confidence_score: match.confidence_score,
      severity: match.severity,
      matched_symptoms: match.matched_symptoms,
    })),
  };
}

app.post("/api/diagnose", async (req, res) => {
  const { category, symptoms, imageUrl } = req.body || {};

  if (!category || !symptoms) {
    return res.json({
      diagnosis_name: "Invalid Input",
      confidence: "low",
      confidence_score: 0,
      severity: "low",
      explanation: "Missing category or symptoms.",
      organic_treatment: "",
      chemical_treatment: "",
      prevention_tips: "",
      top_matches: [],
    });
  }

  const databaseMatches = findPlantMatches(category, symptoms);
  const topDatabaseMatches = findTopDiseaseMatches(category, symptoms);
  const bestDatabaseMatch = topDatabaseMatches[0] || null;

  const prompt = `
You are an expert agricultural assistant.

Category: ${category}

Symptoms:
${symptoms}

Best database disease match:
${JSON.stringify(bestDatabaseMatch, null, 2)}

Top database disease matches:
${JSON.stringify(topDatabaseMatches, null, 2)}

Relevant plant database matches:
${JSON.stringify(databaseMatches, null, 2)}

Use the database matches only when they are relevant. If the database does not match the case, rely on the image and symptoms instead.

If an image is provided, analyse the visible crop or animal condition carefully.

Return ONLY valid JSON:
{
  "diagnosis_name": "",
  "confidence": "",
  "confidence_score": 0,
  "severity": "",
  "explanation": "",
  "organic_treatment": "",
  "chemical_treatment": "",
  "prevention_tips": "",
  "top_matches": []
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
        confidence_score: bestDatabaseMatch?.confidence_score || 50,
        severity: "moderate",
        explanation: text,
        organic_treatment: "See explanation.",
        chemical_treatment: "Consult supplier.",
        prevention_tips: "Monitor regularly.",
        top_matches: topDatabaseMatches,
      };
    }

    if (!result.top_matches || result.top_matches.length === 0) {
      result.top_matches = topDatabaseMatches;
    }

    if (!result.confidence_score && bestDatabaseMatch?.confidence_score) {
      result.confidence_score = bestDatabaseMatch.confidence_score;
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