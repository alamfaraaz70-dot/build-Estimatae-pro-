
import { GoogleGenAI, Type } from "@google/genai";
import { ConstructionDetails, AiEstimateOption } from "../types";

export const getAiEstimateOptions = async (details: ConstructionDetails): Promise<AiEstimateOption[]> => {
  // Try multiple possible environment variable names for maximum compatibility
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || 
                 process.env.GEMINI_API_KEY || 
                 process.env.API_KEY;

  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    console.error("Gemini API Key is missing. Ensure VITE_GEMINI_API_KEY or GEMINI_API_KEY is set in Vercel.");
    return [];
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
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
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || 
                 process.env.GEMINI_API_KEY || 
                 process.env.API_KEY;

  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    console.error("CRITICAL: Gemini API Key is missing.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  
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
    // Using gemini-2.5-flash-image for maximum compatibility across all regions and key types
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

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("No content returned from Gemini");
    }

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

  // Run sequentially to avoid rate limits on free API keys
  const results = [];
  for (const style of styles) {
    try {
      const url = await generateHouseLayout(details, style.prompt);
      if (url) {
        results.push({ url, style: style.name });
      }
    } catch (err) {
      console.error(`Failed to generate layout for ${style.name}:`, err);
    }
  }

  return results;
};

export const generateHouseDesigns = async (details: ConstructionDetails, style: string): Promise<{url: string, label: string}[]> => {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || 
                 process.env.GEMINI_API_KEY || 
                 process.env.API_KEY;

  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    console.error("Gemini API Key is missing.");
    return [];
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Create a 2D architectural elevation (exterior view) of a house with the following specs:
    - Style: ${style}
    - Floors: ${details.floors}
    - Total Area: ${details.plotArea} sq ft
    - Location: ${details.location || "India"}
    
    VISUAL REQUIREMENTS:
    - Show the front elevation of the house.
    - Professional architectural rendering style (2D colored or high-quality line art).
    - Include landscaping, windows, doors, and roof details.
    - If ${details.parking} is true, show a visible parking area or garage.
    - The image should look like a professional design proposal for a client.`;

  const labels = ["Front Elevation", "Side Perspective", "Modern Concept"];
  
  try {
    const results = await Promise.all(
      [1, 2, 3].map(async (_, i) => {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: `${prompt} (Variation ${i + 1}: ${labels[i]})` }],
          },
          config: {
            imageConfig: {
              aspectRatio: "16:9"
            },
          },
        });

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return { url: `data:image/png;base64,${part.inlineData.data}`, label: labels[i] };
          }
        }
        return null;
      })
    );

    return results.filter((r): r is {url: string, label: string} => r !== null);
  } catch (error) {
    console.error("Gemini Design Generation Error:", error);
    return [];
  }
};
