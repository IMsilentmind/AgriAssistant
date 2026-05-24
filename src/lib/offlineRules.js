/**
 * Offline diagnosis rules — expanded knowledge base for common crop diseases and livestock issues.
 * Scoring: Each rule has keywords AND crop-type affinity for higher precision without AI.
 *
 * Score = keyword_matches * 2  +  crop_affinity_match * 3  +  symptom_combo_bonus
 */

const cropDiseaseRules = [
  // ── FUNGAL ──────────────────────────────────────────────────────────────────
  {
    id: "rice_blast",
    diagnosis_name: "Rice Blast (Magnaporthe oryzae)",
    crop_affinity: ["rice"],
    keywords: ["diamond", "lesion", "grey", "gray", "blast", "spindle", "diamond shaped", "neck rot", "panicle"],
    symptom_keywords: ["yellow", "spots", "leaves", "spreading"],
    confidence: "medium",
    severity: "severe",
    explanation: "Rice Blast is one of the most destructive rice diseases worldwide. Look for diamond or spindle-shaped lesions with grey centers and brown borders. In severe cases the neck of the panicle rots, causing 'neck blast'.",
    organic_treatment: "Remove and burn infected plant material immediately. Apply silicon-based soil amendments to strengthen cell walls. Use trichoderma bio-fungicide drench.",
    chemical_treatment: "Spray tricyclazole (0.1%) or isoprothiolane at first sign. Apply twice at 10-day intervals. Do not use during heading stage.",
    prevention_tips: "Use blast-resistant varieties. Avoid excessive nitrogen. Maintain field drainage. Do not keep water too shallow during vegetative stage.",
    urgency: "Act within 48 hours to prevent spread."
  },
  {
    id: "powdery_mildew",
    diagnosis_name: "Powdery Mildew (Erysiphe spp.)",
    crop_affinity: ["wheat", "tomato", "cucumber", "pea", "grape", "mango"],
    keywords: ["white", "powder", "powdery", "mildew", "flour", "dusty", "coating"],
    symptom_keywords: ["leaves", "stem", "upper surface"],
    confidence: "high",
    severity: "moderate",
    explanation: "White powdery fungal growth on leaf surfaces is a classic sign of powdery mildew. It thrives in warm days (20–25°C) with cool nights and low humidity. Unlike most fungi it does NOT need wet leaves to spread.",
    organic_treatment: "Spray baking soda solution (1 tbsp + 1 tsp dish soap per litre). Apply neem oil (5ml/litre) weekly. Remove severely infected leaves and dispose of them away from the field.",
    chemical_treatment: "Sulphur-based fungicide (Thiovit Jet) or triadimefon (Bayleton) spray. Alternate chemicals to prevent resistance. Apply in cooler parts of the day.",
    prevention_tips: "Ensure adequate plant spacing for air flow. Avoid high nitrogen fertiliser. Water at the base, never overhead. Choose resistant varieties where available.",
    urgency: "Treat within 1 week. Spreads rapidly in dry, warm weather."
  },
  {
    id: "late_blight",
    diagnosis_name: "Late Blight (Phytophthora infestans)",
    crop_affinity: ["tomato", "potato"],
    keywords: ["brown", "black", "water soaked", "watersoaked", "dark", "greasy", "blight", "mushy", "wet rot"],
    symptom_keywords: ["leaves", "stem", "fruit", "tuber", "spreading fast"],
    confidence: "high",
    severity: "severe",
    explanation: "Late blight spreads explosively in cool, wet weather. Leaves show water-soaked brown patches that enlarge quickly. White mould appears on the underside in humid conditions. Can destroy an entire crop in 1–2 weeks.",
    organic_treatment: "Remove and bury or burn all infected material. Apply copper-based spray (Bordeaux mixture 1%). Avoid overhead irrigation. Improve drainage.",
    chemical_treatment: "Mancozeb (Dithane M-45) or chlorothalonil spray. For active infection use metalaxyl+mancozeb (Ridomil Gold). Apply every 7 days in wet weather.",
    prevention_tips: "Plant certified disease-free seed potatoes. Space plants well. Hill up potatoes to protect tubers. Destroy all volunteer plants and crop debris.",
    urgency: "URGENT — can wipe out a field in days. Act immediately."
  },
  {
    id: "early_blight",
    diagnosis_name: "Early Blight (Alternaria solani)",
    crop_affinity: ["tomato", "potato"],
    keywords: ["concentric", "rings", "target", "bull's eye", "alternaria", "lower leaves", "early blight"],
    symptom_keywords: ["brown spots", "yellowing around", "older leaves first"],
    confidence: "medium",
    severity: "moderate",
    explanation: "Early blight causes dark brown spots with concentric rings (like a target/bull's eye) on older, lower leaves first. Yellowing around spots is common. It progresses upward as the season continues.",
    organic_treatment: "Remove and destroy lower infected leaves. Apply neem oil spray (5ml/litre) weekly. Mulch around base to prevent soil splash.",
    chemical_treatment: "Mancozeb or chlorothalonil spray every 7–10 days. Start at first sign and continue preventively.",
    prevention_tips: "Rotate crops — do not plant tomato/potato in same spot for 2+ years. Stake plants to improve airflow. Water at soil level in the morning.",
    urgency: "Treat within 1–2 weeks. Manageable if caught early."
  },
  {
    id: "fusarium_wilt",
    diagnosis_name: "Fusarium Wilt (Fusarium oxysporum)",
    crop_affinity: ["tomato", "banana", "cotton", "chickpea", "watermelon"],
    keywords: ["wilt", "wilting", "one side", "yellowing leaves", "brown inside stem", "vascular"],
    symptom_keywords: ["despite watering", "sudden collapse", "yellow", "brown streaks"],
    confidence: "medium",
    severity: "severe",
    explanation: "Fusarium wilt is a soil-borne disease. It blocks the plant's water-conducting vessels. A key diagnostic sign: cut the stem near the base — you will see a brown discolouration inside (vascular browning). Wilting often starts on one side of the plant.",
    organic_treatment: "Remove and destroy affected plants — do NOT compost them. Solarize soil with clear plastic for 4–6 weeks. Add trichoderma granules to soil when replanting.",
    chemical_treatment: "No curative chemical treatment. Preventive soil drench with carbendazim before planting in affected areas.",
    prevention_tips: "Use Fusarium-resistant varieties (look for 'F' on seed packets). Practice 3–4 year crop rotation. Raise soil pH slightly (above 6.5). Avoid injuring roots.",
    urgency: "No cure once infected. Remove plants immediately to prevent soil contamination."
  },
  {
    id: "downy_mildew",
    diagnosis_name: "Downy Mildew (Peronospora / Plasmopara spp.)",
    crop_affinity: ["cucumber", "grape", "onion", "lettuce", "spinach", "maize"],
    keywords: ["downy", "purple", "purple fuzz", "grey fuzz", "angular spots", "yellow patches", "mould underside"],
    symptom_keywords: ["underside of leaf", "pale yellow", "angular"],
    confidence: "medium",
    severity: "moderate",
    explanation: "Downy mildew causes pale yellow or greenish angular patches on top of leaves, with a grey or purple fuzzy mould growth on the underside. Unlike powdery mildew, it needs moisture and cool temperatures to spread.",
    organic_treatment: "Improve air circulation immediately. Apply copper-based spray (Bordeaux mixture). Remove badly infected leaves.",
    chemical_treatment: "Metalaxyl+mancozeb (Ridomil) or fosetyl-aluminium spray. Alternate with copper-based products.",
    prevention_tips: "Avoid overhead irrigation. Water in morning so plants dry before night. Space plants adequately. Use resistant varieties.",
    urgency: "Treat within 1 week. Spreads rapidly in cool, wet weather."
  },
  {
    id: "anthracnose",
    diagnosis_name: "Anthracnose (Colletotrichum spp.)",
    crop_affinity: ["mango", "banana", "avocado", "pepper", "bean", "sorghum"],
    keywords: ["sunken", "dark spots", "fruit rot", "black spots", "orange spores", "acervuli", "anthracnose"],
    symptom_keywords: ["fruit", "pod", "ripe", "dark lesion", "crater"],
    confidence: "medium",
    severity: "moderate",
    explanation: "Anthracnose causes dark, sunken, water-soaked lesions on fruits and pods, often appearing or expanding after harvest. In mango, it can cause blossom blight and fruit rot. In beans, dark red-brown cankers appear on pods and stems.",
    organic_treatment: "Prune and remove infected plant parts. Apply copper-based spray. Post-harvest: hot water treatment of fruits (48°C for 15 min) before storage.",
    chemical_treatment: "Mancozeb or thiophanate-methyl spray. Apply from flowering stage onwards, every 10–14 days.",
    prevention_tips: "Use disease-free seeds/seedlings. Avoid wetting foliage. Harvest fruit in dry weather. Store produce in cool, well-ventilated areas.",
    urgency: "Manage preventively. Losses mainly at harvest/post-harvest."
  },
  {
    id: "leaf_rust",
    diagnosis_name: "Leaf Rust (Puccinia spp.)",
    crop_affinity: ["wheat", "maize", "sorghum", "coffee", "bean"],
    keywords: ["rust", "orange", "rusty", "pustules", "powdery orange", "brown pustules", "uredinia"],
    symptom_keywords: ["leaves", "stem", "orange powder", "yellow rings"],
    confidence: "high",
    severity: "moderate",
    explanation: "Rust diseases produce characteristic orange, yellow, or brown powdery pustules on leaves and stems. Rubbing your finger on infected tissue leaves an orange/rusty powder. Spreads rapidly by wind over long distances.",
    organic_treatment: "Remove infected crop debris after harvest. Spray neem oil or garlic extract as early deterrent. Improve plant nutrition — low potassium increases susceptibility.",
    chemical_treatment: "Propiconazole (Tilt) or tebuconazole triazole fungicide. Apply at first sign and repeat every 14 days. Very effective if applied early.",
    prevention_tips: "Plant rust-resistant varieties. Apply balanced fertiliser — avoid excess nitrogen. Monitor fields regularly during warm, windy weather.",
    urgency: "Treat within 1 week. Can cause 30–70% yield loss if unchecked."
  },
  // ── BACTERIAL ───────────────────────────────────────────────────────────────
  {
    id: "bacterial_wilt",
    diagnosis_name: "Bacterial Wilt (Ralstonia solanacearum)",
    crop_affinity: ["tomato", "potato", "banana", "pepper", "ginger"],
    keywords: ["wilt", "wilting", "overnight", "slime", "bacterial", "ooze", "sudden wilt"],
    symptom_keywords: ["young leaves first", "milky ooze", "vascular", "water test"],
    confidence: "medium",
    severity: "severe",
    explanation: "Bacterial wilt causes sudden, rapid wilting, often of young leaves first. Diagnostic test: cut the stem and place it in a glass of water — if you see milky bacterial ooze streaming out, this confirms bacterial wilt.",
    organic_treatment: "Remove and destroy infected plants — do NOT compost. Flood fields (where possible) to deplete bacteria. Apply lime to soil to raise pH above 7.",
    chemical_treatment: "No effective chemical cure. Preventive copper-based bactericide soil drench before planting in affected areas.",
    prevention_tips: "Use certified disease-free seed/transplants. Rotate with non-solanaceous crops for 3+ years. Avoid injuring roots. Disinfect tools with bleach solution.",
    urgency: "Remove infected plants immediately. Highly contagious via tools and water."
  },
  {
    id: "bacterial_leaf_blight_rice",
    diagnosis_name: "Bacterial Leaf Blight of Rice (Xanthomonas oryzae)",
    crop_affinity: ["rice"],
    keywords: ["water soaked", "straw colour", "straw colored", "leaf blight", "kresek", "wave-like"],
    symptom_keywords: ["leaf margins", "yellowing", "wilting seedlings"],
    confidence: "medium",
    severity: "severe",
    explanation: "Bacterial leaf blight of rice starts as water-soaked stripes along leaf margins that turn yellow then straw-coloured. In seedlings it causes 'kresek' — sudden wilting and death. Most damaging in flooded, warm conditions.",
    organic_treatment: "Drain fields immediately when disease appears. Remove and burn infected plant debris. Do not use flood irrigation from affected areas.",
    chemical_treatment: "Copper-based bactericide spray. Apply streptomycin sulphate if severe. Avoid excessive nitrogen fertiliser.",
    prevention_tips: "Plant resistant varieties. Avoid excessive nitrogen. Ensure good drainage. Use clean, certified seed.",
    urgency: "Drain fields immediately. Can cause up to 75% yield loss in severe cases."
  },
  {
    id: "black_rot",
    diagnosis_name: "Black Rot (Xanthomonas campestris)",
    crop_affinity: ["cabbage", "broccoli", "cauliflower", "kale", "radish"],
    keywords: ["yellow v shape", "v-shaped", "black veins", "leaf margin yellowing", "black rot"],
    symptom_keywords: ["leaf edge", "yellowing", "blackening veins"],
    confidence: "high",
    severity: "moderate",
    explanation: "Black rot causes distinctive V-shaped yellow lesions starting from leaf edges, with blackening of leaf veins. It is the most widespread disease of brassica crops and spreads through contaminated seeds and rain splash.",
    organic_treatment: "Remove infected leaves. Avoid overhead irrigation. Spray copper-based bactericide preventively. Use hot water seed treatment (50°C for 30 min) before planting.",
    chemical_treatment: "Copper hydroxide or copper oxychloride spray. Apply preventively or at very first sign.",
    prevention_tips: "Use certified disease-free seed. Rotate crops — do not plant brassicas in same spot for 2 years. Avoid working in fields when wet.",
    urgency: "Treat within 1 week. Spreads rapidly in wet weather."
  },
  // ── VIRAL ────────────────────────────────────────────────────────────────────
  {
    id: "mosaic_virus",
    diagnosis_name: "Mosaic Virus (TMV / CMV / TYLCV)",
    crop_affinity: ["tomato", "pepper", "cucumber", "bean", "cassava", "maize"],
    keywords: ["mosaic", "mottled", "yellow green patches", "distorted", "curled", "crinkled leaves", "stunted", "virus"],
    symptom_keywords: ["irregular colour", "deformed", "small leaves"],
    confidence: "medium",
    severity: "moderate",
    explanation: "Mosaic viruses cause irregular yellow-green mottling or mosaic patterns on leaves, often with leaf distortion, curling, and stunted growth. There is NO chemical cure for viruses — management focuses on controlling insect vectors (aphids, whiteflies).",
    organic_treatment: "Remove and destroy infected plants to prevent spread. Apply neem oil or reflective mulch to repel aphids and whiteflies. Introduce natural predators (ladybugs, lacewings).",
    chemical_treatment: "No cure for the virus. Control vectors: spray imidacloprid or thiamethoxam (systemic insecticide) to kill aphids/whiteflies. Use yellow sticky traps.",
    prevention_tips: "Use certified virus-free seed/transplants. Plant resistant varieties. Control weed hosts. Wash hands after handling infected plants. Disinfect tools.",
    urgency: "Remove infected plants immediately to protect neighbours."
  },
  {
    id: "maize_streak_virus",
    diagnosis_name: "Maize Streak Virus (MSV)",
    crop_affinity: ["maize", "corn"],
    keywords: ["streak", "yellow streaks", "narrow streaks", "pale stripes", "leafhoppers"],
    symptom_keywords: ["maize", "corn", "leaves", "yellow lines"],
    confidence: "high",
    severity: "severe",
    explanation: "Maize streak virus causes characteristic narrow, pale yellow or cream-coloured streaks running along maize leaves. It is spread by leafhoppers and is the most important viral disease of maize in Africa.",
    organic_treatment: "Remove severely infected plants. Control leafhopper populations with neem oil spray. Use yellow sticky traps to monitor leafhopper levels.",
    chemical_treatment: "Treat seeds with thiamethoxam systemic insecticide before planting to protect against early leafhopper attack. Spray imidacloprid if leafhopper pressure is high.",
    prevention_tips: "Plant MSV-resistant maize varieties (most modern hybrids have resistance). Plant early in the season when leafhopper populations are lower. Avoid planting near grassland.",
    urgency: "Cannot cure infected plants. Focus on protecting healthy plants."
  },
  // ── PEST ─────────────────────────────────────────────────────────────────────
  {
    id: "fall_armyworm",
    diagnosis_name: "Fall Armyworm (Spodoptera frugiperda)",
    crop_affinity: ["maize", "corn", "sorghum", "wheat", "rice"],
    keywords: ["fall armyworm", "armyworm", "eaten", "holes", "frass", "sawdust", "ragged", "whorl", "caterpillar"],
    symptom_keywords: ["leaves eaten", "heart", "centre", "dark droppings", "shredded"],
    confidence: "high",
    severity: "severe",
    explanation: "Fall armyworm caterpillars feed inside the whorl of maize, leaving ragged holes and frass (dark brown droppings). Look for small caterpillars (light brown to dark with stripes) in the heart of the plant. A single caterpillar can destroy a plant in days.",
    organic_treatment: "Spot-apply neem oil (20ml/litre) directly into the whorl. Mix sand+ash+wood ash in 1:1 ratio and pour into whorl — this kills young larvae. Hand-pick larvae in small plots.",
    chemical_treatment: "Emamectin benzoate (Emamectin 5 SG) — very effective. Spinetoram or chlorantraniliprole (Coragen). Apply into whorl using a narrow-nozzle sprayer. 2–3 applications, 7 days apart.",
    prevention_tips: "Monitor fields regularly — check heart leaves twice a week. Plant early to avoid peak armyworm season. Use pheromone traps for monitoring. Encourage natural enemies (parasitic wasps).",
    urgency: "ACT IMMEDIATELY. Can cause 20–100% yield loss if untreated."
  },
  {
    id: "aphids",
    diagnosis_name: "Aphid Infestation",
    crop_affinity: ["wheat", "tomato", "pepper", "bean", "cabbage", "pea", "potato"],
    keywords: ["aphid", "aphids", "sticky", "black flies", "greenfly", "colonies", "ants", "honeydew", "sooty mould"],
    symptom_keywords: ["curled leaves", "yellowing", "small insects", "clustered", "undersides"],
    confidence: "high",
    severity: "moderate",
    explanation: "Aphids are tiny soft-bodied insects (1–3mm) that cluster on growing tips and leaf undersides, sucking plant sap. They excrete honeydew, causing sooty mould. Often attended by ants. They also transmit viruses.",
    organic_treatment: "Spray with strong jet of water to knock off colonies. Apply insecticidal soap (5ml dish soap per litre). Spray neem oil. Introduce ladybirds/lacewings. Plant marigolds as companion plants.",
    chemical_treatment: "Imidacloprid or acetamiprid systemic insecticide. Lambda-cyhalothrin spray. One application usually enough if done early. Avoid broad-spectrum sprays that kill natural enemies.",
    prevention_tips: "Avoid excessive nitrogen fertiliser (lush growth attracts aphids). Use reflective mulch to confuse aphids. Monitor tips of plants twice a week. Encourage natural enemies.",
    urgency: "Act within 1 week. They multiply very rapidly in warm weather."
  },
  {
    id: "stem_borer",
    diagnosis_name: "Stem Borer (Chilo / Busseola spp.)",
    crop_affinity: ["maize", "corn", "rice", "sorghum", "sugarcane"],
    keywords: ["deadheart", "dead heart", "stem borer", "tunnels", "entry hole", "bore hole", "boring", "frass stem"],
    symptom_keywords: ["central shoot dead", "holes stem", "broken stem", "frass"],
    confidence: "high",
    severity: "severe",
    explanation: "Stem borers tunnel into the stem, causing 'dead heart' (central shoot dies while outer leaves stay green) in young plants, and broken stems in older plants. Look for entry holes and frass (sawdust-like droppings) at the base.",
    organic_treatment: "Apply neem oil or B.t. (Bacillus thuringiensis) spray at egg-hatching. Remove and destroy infested plants. Use Trichogramma parasitic wasps where available.",
    chemical_treatment: "Carbofuran granules (1–3 granules per whorl). Emamectin benzoate spray. Apply 2–3 times, 10 days apart, starting at first sign.",
    prevention_tips: "Plough deeply after harvest to destroy pupae. Collect and destroy crop residues. Use early planting to avoid peak borer season. Plant resistant varieties.",
    urgency: "Treat within 3–5 days of first sign. Damage escalates rapidly."
  },
  {
    id: "red_spider_mite",
    diagnosis_name: "Red Spider Mite (Tetranychus urticae)",
    crop_affinity: ["tomato", "bean", "cucumber", "maize", "cassava", "strawberry"],
    keywords: ["spider mite", "mite", "webbing", "stippling", "bronze", "bronzing", "tiny dots", "silvery", "webbed"],
    symptom_keywords: ["dry conditions", "dusty white", "leaf undersides", "tiny moving dots"],
    confidence: "medium",
    severity: "moderate",
    explanation: "Spider mites are barely visible (0.5mm) but cause obvious damage — tiny yellow/white stipple marks on leaves, and fine webbing on the underside. Leaves turn bronze/silver and dry up. They thrive in hot, dry, dusty conditions.",
    organic_treatment: "Spray strong jet of water to physically remove mites. Apply neem oil (5ml/litre) every 5 days. Wettable sulphur spray is very effective. Maintain soil moisture around plants.",
    chemical_treatment: "Abamectin (Dynamec) or bifenazate miticide — do NOT use regular insecticides (they kill natural enemies and make mites worse). Alternate products to prevent resistance.",
    prevention_tips: "Maintain adequate watering. Avoid dusty conditions. Avoid broad-spectrum insecticides. Monitor leaf undersides with a magnifying glass.",
    urgency: "Populations can double every 3–5 days in hot weather. Act within 1 week."
  },
  // ── NUTRITIONAL ─────────────────────────────────────────────────────────────
  {
    id: "nitrogen_deficiency",
    diagnosis_name: "Nitrogen Deficiency",
    crop_affinity: ["maize", "rice", "wheat", "tomato", "potato", "cabbage"],
    keywords: ["pale green", "light green", "yellow starts old leaves", "yellowing lower", "nitrogen", "starved", "pale"],
    symptom_keywords: ["uniform yellowing", "older leaves", "small plant", "slow growth"],
    confidence: "medium",
    severity: "mild",
    explanation: "Nitrogen deficiency causes uniform pale yellowing, starting from older (lower) leaves and moving upward. Plants look generally pale and grow slowly. Different from disease — it affects all lower leaves evenly, not in irregular spots.",
    organic_treatment: "Apply well-composted manure or compost (10 tonnes/ha). Use legume cover crops before planting. Spray diluted liquid manure as foliar feed for quick response.",
    chemical_treatment: "Top-dress with urea (46% N) at recommended rate. Split applications work better than one large dose. Apply in the morning or evening, never in strong sun.",
    prevention_tips: "Conduct soil test before each season. Apply basal fertiliser (NPK) at planting. Use split applications — some at planting, rest at vegetative stage.",
    urgency: "Apply fertiliser within 2 weeks for best recovery."
  },
  {
    id: "iron_deficiency",
    diagnosis_name: "Iron Deficiency (Interveinal Chlorosis)",
    crop_affinity: ["rice", "maize", "tomato", "bean", "soybean"],
    keywords: ["interveinal", "yellow between veins", "young leaves yellow", "green veins", "iron", "chlorosis", "bleaching"],
    symptom_keywords: ["new leaves affected", "veins stay green", "pale new growth"],
    confidence: "medium",
    severity: "mild",
    explanation: "Iron deficiency causes yellowing (chlorosis) between leaf veins while the veins remain green — most visible on young, new leaves. Common in high-pH (alkaline) or waterlogged soils where iron is unavailable to roots.",
    organic_treatment: "Acidify soil with sulphur or compost. Apply iron chelate (Fe-EDTA) foliar spray (0.5%). Add organic matter to improve nutrient availability.",
    chemical_treatment: "Foliar spray with ferrous sulphate (FeSO4, 0.5%) — gives rapid green-up. Soil application of iron chelate granules for longer-term fix.",
    prevention_tips: "Check and adjust soil pH to 5.5–6.5 for most crops. Avoid waterlogging. Use acidifying fertilisers in alkaline soils.",
    urgency: "Apply foliar spray within 2 weeks. Yield impact if not corrected early."
  }
];

const livestockRules = [
  {
    id: "appetite_loss",
    diagnosis_name: "Loss of Appetite / Digestive Issue",
    species_affinity: [],
    keywords: ["not eating", "appetite", "refusing food", "off feed", "not drinking"],
    confidence: "low",
    severity: "moderate",
    explanation: "Reduced appetite can indicate digestive problems, fever, internal parasites, or stress. Monitor for other symptoms over 24 hours.",
    organic_treatment: "Provide clean fresh water. Offer easily digestible feed. Add probiotics or apple cider vinegar to water. Isolate from herd.",
    chemical_treatment: "Consult a veterinarian. May need deworming medication or antibiotics if infection is suspected.",
    prevention_tips: "Maintain clean feeding areas. Deworm regularly. Reduce stress factors."
  },
  {
    id: "fever_infection",
    diagnosis_name: "Fever / Systemic Infection",
    species_affinity: [],
    keywords: ["fever", "hot", "temperature", "lethargy", "tired", "weak", "shaking", "shivering"],
    confidence: "low",
    severity: "severe",
    explanation: "Fever with lethargy suggests a bacterial or viral infection. This requires prompt attention.",
    organic_treatment: "Keep the animal cool and hydrated. Isolate from others. Provide electrolytes in drinking water.",
    chemical_treatment: "Seek veterinary care urgently. Antibiotics or anti-inflammatory medications may be needed.",
    prevention_tips: "Keep vaccinations up to date. Maintain clean living conditions. Quarantine new animals."
  },
  {
    id: "skin_disease",
    diagnosis_name: "Skin Disease / External Parasite Infestation",
    species_affinity: [],
    keywords: ["skin", "rash", "lesion", "sore", "wound", "scab", "itch", "itching", "scratching", "hair loss"],
    confidence: "low",
    severity: "moderate",
    explanation: "Skin rashes, lesions, or hair loss can be caused by external parasites (mites, ticks, lice), fungal infections (ringworm), or allergies.",
    organic_treatment: "Clean affected area with mild antiseptic. Apply neem oil or diluted apple cider vinegar. Keep area dry and clean.",
    chemical_treatment: "Apply topical antiparasitic treatment. Use ivermectin for mite infestations. Consult vet for correct dosage.",
    prevention_tips: "Regular grooming and inspection. Maintain clean bedding. Control external parasites with routine treatment."
  },
  {
    id: "respiratory",
    diagnosis_name: "Respiratory Infection (Pneumonia / Bronchitis)",
    species_affinity: [],
    keywords: ["cough", "coughing", "sneeze", "sneezing", "breathing", "respiratory", "nasal discharge", "runny nose", "wheezing"],
    confidence: "low",
    severity: "severe",
    explanation: "Coughing and nasal discharge can indicate pneumonia, infectious bronchitis, or other respiratory infections. Requires prompt veterinary attention.",
    organic_treatment: "Ensure good ventilation. Keep animal warm and dry. Isolate from herd. Offer warm water.",
    chemical_treatment: "Veterinary antibiotics (oxytetracycline, enrofloxacin) are usually needed. Consult a vet immediately for severe cases.",
    prevention_tips: "Ensure proper ventilation in housing. Avoid overcrowding. Vaccinate against common respiratory diseases."
  },
  {
    id: "lameness",
    diagnosis_name: "Lameness / Foot Rot",
    species_affinity: [],
    keywords: ["limp", "limping", "swelling", "leg", "foot", "hoof", "lame", "won't walk", "favoring"],
    confidence: "low",
    severity: "moderate",
    explanation: "Limping or swelling may indicate foot rot (bacterial), injury, or joint infection. Examine the hoof/foot carefully for wounds, foul smell, or swelling between the toes.",
    organic_treatment: "Clean the foot/hoof thoroughly. Soak in warm salt water or zinc sulphate footbath. Apply herbal poultice.",
    chemical_treatment: "Oxytetracycline antibiotic spray on wounds. Anti-inflammatory medication. Consult vet for severe or persistent cases.",
    prevention_tips: "Regular hoof trimming. Keep living areas clean and dry. Provide proper nutrition for strong bones."
  }
];

/**
 * Score a rule against the given crop type and symptom text.
 * Returns a numeric score — higher = better match.
 */
function scoreRule(rule, cropType, symptomText) {
  const lower = symptomText.toLowerCase();
  const cropLower = (cropType || "").toLowerCase();

  let score = 0;

  // Keyword match (core symptoms)
  for (const kw of rule.keywords) {
    if (lower.includes(kw)) score += 2;
  }

  // Secondary symptom match (bonus)
  if (rule.symptom_keywords) {
    for (const kw of rule.symptom_keywords) {
      if (lower.includes(kw)) score += 1;
    }
  }

  // Crop/species affinity bonus — big boost for correct crop match
  const affinity = rule.crop_affinity || rule.species_affinity || [];
  if (affinity.length > 0) {
    for (const crop of affinity) {
      if (cropLower.includes(crop) || crop.includes(cropLower)) {
        score += 3;
        break;
      }
    }
  }

  return score;
}

/**
 * Returns an array of top-N offline diagnoses, sorted by score descending.
 * Each entry includes the score for transparency.
 */
export function getOfflineDiagnosis(category, symptomText, cropType = "", topN = 3) {
  if (!symptomText && !cropType) return null;

  const rules = category === "crops" ? cropDiseaseRules : livestockRules;
  const text = `${symptomText || ""} ${cropType || ""}`;

  const scored = rules
    .map((rule) => ({ ...rule, _score: scoreRule(rule, cropType, text) }))
    .filter((r) => r._score > 0)
    .sort((a, b) => b._score - a._score);

  if (scored.length === 0) return null;

  // Return top match for single-result use
  const top = scored[0];

  // Boost confidence if score is high enough
  let confidence = top.confidence;
  if (top._score >= 8) confidence = "medium";
  if (top._score >= 12) confidence = "high";

  return { ...top, confidence, alternatives: scored.slice(1, topN).map(r => r.diagnosis_name) };
}

/**
 * Returns all possible matches sorted by score — used for displaying alternatives.
 */
export function getOfflineDifferentials(category, symptomText, cropType = "") {
  const rules = category === "crops" ? cropDiseaseRules : livestockRules;
  const text = `${symptomText || ""} ${cropType || ""}`;

  return rules
    .map((rule) => ({ ...rule, _score: scoreRule(rule, cropType, text) }))
    .filter((r) => r._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, 5);
}

export default { cropDiseaseRules, livestockRules };