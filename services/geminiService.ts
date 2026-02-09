
import { GoogleGenAI, Type } from "@google/genai";
import { ConstructionDetails, AiEstimateOption } from "../types";

export const getAiEstimateOptions = async (details: ConstructionDetails): Promise<AiEstimateOption[]> => {
  // Use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const floorBreakdown = details.floorConfigs.map(f => 
    `Floor ${f.floorNumber}: ${f.rooms} Rooms, ${f.bathrooms} Bathrooms, Kitchen: ${f.kitchenType}`
  ).join('\n');

  const prompt = `Provide 6 distinct construction cost estimate tiers for a house in India with the following specs:
    - Plot Area: ${details.plotArea} sq ft
    - Total Floors: ${details.floors}
    - Floor Breakdown:
${floorBreakdown}
    - Parking: ${details.parking ? "Required" : "Not Required"}
    - Additional Notes: ${details.notes || "None"}
    
    The 6 tiers should be:
    1. Economy (Basic finishes, minimal costs)
    2. Budget-Friendly (Decent materials, cost-conscious)
    3. Standard (Market average quality)
    4. Premium (High-quality finishes, branded fittings)
    5. Luxury (Premium marble, designer woodwork)
    6. Ultra-Luxury (Smart home, top-tier imported materials, architectural excellence)

    Calculate realistic material and labor costs in Indian Rupees (INR) for each. 
    Explain briefly (1 sentence) what defines that tier.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of 6 estimate options",
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING, description: "Tier name (Economy, Standard, etc.)" },
              material: { type: Type.NUMBER, description: "Estimated material cost in INR" },
              labor: { type: Type.NUMBER, description: "Estimated labor cost in INR" },
              explanation: { type: Type.STRING, description: "Brief description of material quality" },
            },
            required: ["label", "material", "labor", "explanation"],
            propertyOrdering: ["label", "material", "labor", "explanation"],
          }
        },
      },
    });

    // Directly access the text property as per guidelines
    const jsonStr = response.text?.trim() || "[]";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Dynamic fallback
    const roomsCount = details.floorConfigs.reduce((sum, f) => sum + f.rooms, 0);
    const baseMaterial = (details.plotArea * 1200) + (roomsCount * 40000);
    const baseLabor = (details.plotArea * 800) + (roomsCount * 25000);

    const multipliers = [
      { label: 'Economy', m: 0.8, l: 0.85 },
      { label: 'Standard', m: 1.0, l: 1.0 },
      { label: 'Premium', m: 1.4, l: 1.2 },
      { label: 'Luxury', m: 1.8, l: 1.4 },
      { label: 'Ultra-Luxury', m: 2.5, l: 1.8 },
      { label: 'Eco-Friendly', m: 1.6, l: 1.5 },
    ];

    return multipliers.map(tier => ({
      label: tier.label,
      material: Math.round(baseMaterial * tier.m),
      labor: Math.round(baseLabor * tier.l),
      explanation: `Estimated costs for ${tier.label} grade construction based on general market trends.`
    }));
  }
};
