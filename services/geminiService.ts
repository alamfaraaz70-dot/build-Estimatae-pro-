
import { GoogleGenAI, Type } from "@google/genai";
import { ConstructionDetails, AiEstimateOption } from "../types";

export const getAiEstimateOptions = async (details: ConstructionDetails): Promise<AiEstimateOption[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const floorBreakdown = details.floorConfigs.map(f => 
    `Floor ${f.floorNumber}: ${f.rooms} Rooms, ${f.bathrooms} Bathrooms, Kitchen: ${f.kitchenType}`
  ).join('\n');

  const dimensionString = details.length && details.breadth 
    ? `Plot Dimensions: ${details.length}ft (Length) x ${details.breadth}ft (Breadth)`
    : `Total Area: ${details.plotArea} sq ft`;

  const prompt = `Provide 6 distinct construction cost estimate tiers for a house in India with the following specs:
    - Build Location: ${details.location || "General India"}
    - ${dimensionString}
    - Total Floors: ${details.floors}
    - Requested Timeline: ${details.timelineMonths} months
    - Floor Breakdown:
${floorBreakdown}
    - Parking: ${details.parking ? "Required" : "Not Required"}
    - Additional Notes: ${details.notes || "None"}
    
    The 6 tiers should be:
    1. Economy, 2. Budget-Friendly, 3. Standard, 4. Premium, 5. Luxury, 6. Ultra-Luxury.
    Calculate realistic material and labor costs in INR, taking the specific location's logistics and market into account if provided. Explain briefly what defines each tier.`;

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
  
  const floorDescriptions = details.floorConfigs.map(f => 
    `Level ${f.floorNumber}: ${f.rooms} rooms, ${f.bathrooms} bathrooms, and a kitchen (${f.kitchenType}).`
  ).join(' ');

  const dimensionContext = details.length && details.breadth 
    ? `The plot is a RECTANGLE of ${details.length}ft by ${details.breadth}ft. The floor plan footprint MUST exactly match this rectangular proportion.`
    : `The plot area is ${details.plotArea} sq ft. Imagine a standard rectangular or square layout.`;

  const prompt = `URGENT ARCHITECTURAL SPEC: Create a 2D technical floor plan for a building with EXACTLY ${details.floors} FLOORS.
    
    Location: ${details.location || "Not specified"}
    ${dimensionContext}
    Design Style: ${style} architectural technical blueprint.
    Floor Plan Breakdown: ${floorDescriptions}
    ${details.parking ? "Must show Ground Floor parking area." : ""}
    
    STRUCTURAL MANDATE:
    - You MUST include a clear STAIRCASE layout on EVERY floor plan.
    - The stairs should be positioned to provide internal access between all floors.
    
    VISUAL REQUIREMENTS: 
    - For ${details.floors} floors, display ALL levels side-by-side or stacked in one sheet.
    - Label each section clearly: "Ground Floor", "1st Floor", etc.
    - Black and white technical line drawing. High precision.
    - Show door swings, window positions, and structural columns.
    - IMPORTANT: Ensure the external boundary reflects the ${details.length}x${details.breadth} proportions if specified.`;

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

  return results.filter(r => r.url !== r.style && r.url !== '');
};
