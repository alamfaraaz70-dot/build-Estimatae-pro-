
import { GoogleGenAI, Type } from "@google/genai";
import { ConstructionDetails, AiEstimateOption } from "../types";

export const getAiEstimateOptions = async (details: ConstructionDetails): Promise<AiEstimateOption[]> => {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || 
                 process.env.GEMINI_API_KEY || 
                 process.env.API_KEY;

  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    const msg = "Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in Vercel.";
    console.error(msg);
    throw new Error(msg);
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
  // Robust API key retrieval for Vite environment
  let apiKey = '';
  try {
    apiKey = (process.env.GEMINI_API_KEY as string) || 
             (process.env.API_KEY as string) || 
             (import.meta as any).env?.VITE_GEMINI_API_KEY || 
             '';
  } catch (e) {
    apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  }

  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    console.error("CRITICAL: Gemini API Key is missing for blueprint generation.");
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
    - For ${details.floors} floors, you MUST display ALL levels (Ground Floor, 1st Floor, etc.) side-by-side or stacked in one single image.
    - DO NOT show just one floor. Show ALL ${details.floors} floors clearly labeled.
    
    VISUAL REQUIREMENTS: 
    - Black and white technical line drawing. High precision.
    - Show door swings, window positions, and structural columns.
    - Label each section clearly: "Ground Floor", "1st Floor", etc.
    - IMPORTANT: Ensure the external boundary reflects the ${details.length}x${details.breadth} proportions if specified.`;

  try {
    console.log(`Starting layout generation for style: ${style}...`);
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        },
      },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      console.warn(`No candidates returned for style: ${style}. Finish reason: ${response.candidates?.[0]?.finishReason}`);
      return null;
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        console.log(`Successfully generated layout for style: ${style}`);
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    console.warn(`No inlineData found in response for style: ${style}. Parts:`, response.candidates[0].content.parts);
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

  const results: ({url: string, style: string} | null)[] = [];
  
  console.log("Starting triple layout generation...");
  
  // Run sequentially to avoid rate limits and ensure better reliability
  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    try {
      const url = await generateHouseLayout(details, style.prompt);
      if (url) {
        results.push({ url, style: style.name });
      } else {
        results.push(null);
      }
    } catch (err) {
      console.error(`Failed to generate layout for ${style.name}:`, err);
      results.push(null);
    }
    
    // Small delay between requests even in sequential mode
    if (i < styles.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  const finalResults = results.filter((r): r is {url: string, style: string} => r !== null);
  console.log(`Triple layout generation complete. Success count: ${finalResults.length}`);
  return finalResults;
};

export const generateHouseDesigns = async (details: ConstructionDetails, style: string): Promise<{url: string, label: string}[]> => {
  let apiKey = '';
  try {
    apiKey = (process.env.GEMINI_API_KEY as string) || 
             (process.env.API_KEY as string) || 
             (import.meta as any).env?.VITE_GEMINI_API_KEY || 
             '';
  } catch (e) {
    apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  }

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
  const results: ({url: string, label: string} | null)[] = [];
  
  try {
    console.log("Starting house design generation...");
    for (let i = 0; i < 3; i++) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [{ text: `${prompt} (Variation ${i + 1}: ${labels[i]})` }],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: "1K"
          },
        },
      });

      let found = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            results.push({ url: `data:image/png;base64,${part.inlineData.data}`, label: labels[i] });
            found = true;
            break;
          }
        }
      }
      if (!found) {
        console.warn(`No design generated for variation ${i + 1}`);
        results.push(null);
      }
      
      if (i < 2) await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const finalResults = results.filter((r): r is {url: string, label: string} => r !== null);
    console.log(`House design generation complete. Success count: ${finalResults.length}`);
    return finalResults;
  } catch (error) {
    console.error("Gemini Design Generation Error:", error);
    return [];
  }
};

export const getBudgetOptimizations = async (
  details: ConstructionDetails,
  currentEstimate: AiEstimateOption,
  targetBudget: number
): Promise<any[]> => {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || 
                 process.env.GEMINI_API_KEY || 
                 process.env.API_KEY;

  if (!apiKey || apiKey === 'undefined' || apiKey === '') return [];

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `The user is over budget for their house construction.
    Target Budget: ₹${targetBudget.toLocaleString()}
    Current Estimate: ₹${(currentEstimate.material + currentEstimate.labor).toLocaleString()}
    
    Specs: ${details.floors} floors, ${details.plotArea} sq ft, Location: ${details.location}
    
    Provide 3 distinct optimization strategies to bring the cost closer to the target budget.
    Each strategy should include:
    - A catchy title
    - A brief description
    - 3-4 specific changes/sacrifices
    - The new estimated total cost
    - Total savings
    
    Return as a JSON array.`;

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
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              changes: { type: Type.ARRAY, items: { type: Type.STRING } },
              optimizedCost: { type: Type.NUMBER },
              savings: { type: Type.NUMBER },
            },
            required: ["id", "title", "description", "changes", "optimizedCost", "savings"],
          }
        },
      },
    });

    return JSON.parse(response.text?.trim() || "[]");
  } catch (error) {
    console.error("Budget Optimization Error:", error);
    return [];
  }
};
