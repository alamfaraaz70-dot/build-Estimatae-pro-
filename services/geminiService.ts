
import { GoogleGenAI, Type } from "@google/genai";
import { ConstructionDetails, AiEstimateOption } from "../types";

export const getAiEstimateOptions = async (details: ConstructionDetails): Promise<AiEstimateOption[]> => {
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
    1. Economy, 2. Budget-Friendly, 3. Standard, 4. Premium, 5. Luxury, 6. Ultra-Luxury.
    Calculate realistic material and labor costs in INR. Explain briefly what defines each tier.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              material: { type: Type.NUMBER },
              labor: { type: Type.NUMBER },
              explanation: { type: Type.STRING },
            },
            required: ["label", "material", "labor", "explanation"],
          }
        },
      },
    });

    return JSON.parse(response.text?.trim() || "[]");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const generateHouseLayout = async (details: ConstructionDetails, style: string = 'Modernist'): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const floor1 = details.floorConfigs[0];
  const prompt = `Professional 2D architectural floor plan for a ${details.plotArea} sq ft site. 
    Style: ${style} architectural drawing.
    Level 1 contains ${floor1.rooms} rooms, ${floor1.bathrooms} bathrooms, and a kitchen (${floor1.kitchenType}). 
    ${details.parking ? "Include a dedicated parking area/garage." : "No parking."}
    Visual: White background, black technical lines, industrial blue and yellow accent colors, clear labels for rooms.
    Perspective: Top-down blueprint perspective. Realistic architectural standards for construction.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error(`Gemini Image Generation Error (${style}):`, error);
    return null;
  }
};

export const generateTripleLayouts = async (details: ConstructionDetails): Promise<{url: string, style: string}[]> => {
  const styles = [
    { name: 'Modernist Edge', prompt: 'Modern minimalist luxury with open-plan concepts' },
    { name: 'Classic Heritage', prompt: 'Traditional solid structure with defined separated rooms' },
    { name: 'Eco Minimal', prompt: 'Compact, efficient space optimization with focus on natural flow' }
  ];

  const results = await Promise.all(
    styles.map(async (style) => {
      const url = await generateHouseLayout(details, style.prompt);
      return { url: url || '', style: style.name };
    })
  );

  return results.filter(r => r.url !== '');
};
