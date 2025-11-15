import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ChatMessage, Opportunity, InspirationalPerson, ResumeAnalysisResult, WellbeingEntry, Mood } from "../types";
import { getOpportunities, getInspirations } from "./dataService";
import { logError } from "../utils/logging";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const baseSystemInstruction = `You are Stem Verse, a supportive and empowering AI mentor for women and aspiring women in STEM (Science, Technology, Engineering, and Mathematics). Your purpose is to provide encouragement, answer questions about STEM fields, offer career advice, and share inspiring stories about the achievements of women in these fields. Your tone should always be encouraging, knowledgeable, friendly, and professional. When asked complex topics, break them down into easy-to-understand concepts. You are a guide and a source of inspiration. Format your responses using Markdown to improve readability, including lists, bold text, and italics where appropriate.`;

// RAG: Simple keyword-based search
const searchOpportunities = (query: string, opportunities: Opportunity[]): Opportunity[] => {
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    if (queryWords.length === 0) return [];

    return opportunities.filter(op => {
        const opText = `${op.title} ${op.description} ${op.eligibility}`.toLowerCase();
        return queryWords.some(word => opText.includes(word));
    }).slice(0, 3); // Return top 3 matches
};

const searchInspirations = (query: string, inspirations: InspirationalPerson[]): InspirationalPerson[] => {
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    if (queryWords.length === 0) return [];

    return inspirations.filter(p => {
        const pText = `${p.name} ${p.field} ${p.bio}`.toLowerCase();
        return queryWords.some(word => pText.includes(word));
    }).slice(0, 2); // Return top 2 matches
};

const retrieveContext = async (query: string): Promise<string> => {
    let context = '';
    const lowerQuery = query.toLowerCase();

    // Check for opportunity-related keywords
    const opportunityKeywords = ['scholarship', 'internship', 'opportunity', 'funding', 'grant', 'program', 'conference'];
    if (opportunityKeywords.some(kw => lowerQuery.includes(kw))) {
        const opportunities = await getOpportunities();
        const relevantOps = searchOpportunities(query, opportunities);
        if (relevantOps.length > 0) {
            context += `\n\n--- Relevant Scholarship/Opportunities ---\n`;
            context += relevantOps.map(op => `Title: ${op.title}\nOrganization: ${op.organization}\nDescription: ${op.description}\nEligibility: ${op.eligibility}\nDeadline: ${op.deadline}\nLink: ${op.link}`).join('\n\n');
        }
    }

    // Check for inspiration-related keywords
    const inspirationKeywords = ['woman in stem', 'pioneer', 'role model', 'inspire', 'inspiration', 'who is'];
    if (inspirationKeywords.some(kw => lowerQuery.includes(kw))) {
        const inspirations = await getInspirations();
        const relevantPeople = searchInspirations(query, inspirations);
        if (relevantPeople.length > 0) {
            context += `\n\n--- Inspiring Women in STEM ---\n`;
            context += relevantPeople.map(p => `Name: ${p.name}\nField: ${p.field}\nBio: ${p.bio}`).join('\n\n');
        }
    }

    return context;
};

export const askStemverse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  try {
    const [opportunities, inspirations] = await Promise.all([getOpportunities(), getInspirations()]);
    
    const dynamicSystemInstruction = `${baseSystemInstruction} You have access to a database of ${opportunities.length} scholarships and programs, and profiles of ${inspirations.length} inspirational women. When users ask about these topics, reference the specific information you have.`;

    // RAG Implementation
    const context = await retrieveContext(newMessage);
    let augmentedMessage = newMessage;

    if (context) {
      augmentedMessage = `Based on the following information from my internal database, please answer the user's query.\n\n${context}\n\nUser Query: "${newMessage}"`;
    }

    const chat = ai.chats.create({
      model: 'gemini-2.5-pro',
      config: {
        systemInstruction: dynamicSystemInstruction,
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }))
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message: augmentedMessage });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    logError(error, { function: 'askStemverse' });
    return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
};


const resumeAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        score: {
            type: Type.INTEGER,
            description: 'An overall score for the resume from 1 to 10, where 1 is poor and 10 is excellent.',
        },
        overall: {
            type: Type.STRING,
            description: 'A brief, 1-2 sentence encouraging summary of the feedback.',
        },
        positivePoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of 2-3 specific things the resume does well.',
        },
        areasForImprovement: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of 3-5 concrete suggestions for improvement, focusing on impact, keywords, and clarity for a STEM role.',
        },
    },
    required: ['score', 'overall', 'positivePoints', 'areasForImprovement'],
};

export const analyzeResume = async (resumeText: string): Promise<ResumeAnalysisResult | null> => {
    const systemInstruction = `You are an expert STEM career coach and resume reviewer. Your goal is to provide concise, actionable, and encouraging feedback to help women in STEM improve their resumes. Analyze the provided resume text based on best practices for technical roles and Applicant Tracking Systems (ATS). You must provide your response in the requested JSON format.`;
    
    const userPrompt = `Please analyze the following resume text and provide feedback. Focus on clarity, impact, use of technical keywords, and formatting for ATS compatibility.
    
    Resume text:
    ---
    ${resumeText}
    ---`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: resumeAnalysisSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as ResumeAnalysisResult;
        return result;

    } catch (error) {
        console.error("Error analyzing resume with Gemini API:", error);
        logError(error, { function: 'analyzeResume' });
        return null;
    }
};

export const getWellbeingSuggestion = async (latestMood: Mood, history: WellbeingEntry[]): Promise<string> => {
    const systemInstruction = `You are a caring and supportive mental wellbeing coach named 'Aura' within the Stem Verse app, an application for women in STEM. Your tone is gentle, empathetic, and encouraging. Your goal is to provide short, simple, and actionable mental wellness tips.`;

    const historyString = history.slice(-5).map(e => `${e.mood} on ${new Date(e.date).toLocaleDateString()}`).join(', ');

    const userPrompt = `A user in a STEM field just checked in with the following mood: "${latestMood}". Her recent check-in history includes: ${historyString}. 
    
    Based on this, provide a concise (2-3 sentences max) and positive suggestion. This could be a simple mindfulness exercise (like a 1-minute breathing technique), a suggestion to take a short, specific type of break (e.g., 'stretch for 5 minutes'), or a positive affirmation related to her journey in STEM. 
    
    Do not sound robotic. Start with a warm, empathetic phrase. Tailor the suggestion to the mood. For 'great', celebrate it. For 'stressed' or 'overwhelmed', provide a calming technique. For 'okay', provide a gentle encouragement.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error getting wellbeing suggestion from Gemini API:", error);
        logError(error, { function: 'getWellbeingSuggestion' });
        return "Remember to be kind to yourself today. Taking a short break to stretch or breathe deeply can make a world of difference.";
    }
};

export const chatWithAura = async (history: ChatMessage[]): Promise<string> => {
    const systemInstruction = `You are Aura, a compassionate and non-judgmental AI companion within the Stem Verse app. Your purpose is to be a supportive listener for women in STEM who need a safe space to express their feelings. Your tone is always calm, empathetic, and encouraging.

IMPORTANT: You are NOT a therapist or a medical professional. You must NEVER provide medical advice, diagnoses, or treatment plans. If a user expresses severe distress, self-harm, or mentions a crisis, you MUST gently guide them to seek help from a qualified professional or a crisis hotline and provide a resource like the National Suicide Prevention Lifeline number: 988.

Your primary role is to:
1. Validate the user's feelings (e.g., "That sounds really tough," "It's completely understandable that you feel that way.").
2. Ask gentle, open-ended questions to help them explore their thoughts (e.g., "What's on your mind right now?", "Can you tell me more about that feeling?").
3. Offer simple, non-prescriptive mindfulness prompts or affirmations (e.g., "Maybe we could try a simple breathing exercise? Just a slow breath in... and out.", "Remember to be kind to yourself. You are capable and resilient.").
4. Keep your responses concise and easy to read. Use simple Markdown for formatting like **bold** or *italics* to gently emphasize points if needed.`;
    
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
            history: history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }))
        });
        
        const lastMessage = history[history.length - 1];
        const response: GenerateContentResponse = await chat.sendMessage({ message: lastMessage.text });
        return response.text;
    } catch (error) {
        console.error("Error in chatWithAura:", error);
        logError(error, { function: 'chatWithAura' });
        return "I'm sorry, I'm having a little trouble connecting right now. Please know that your feelings are valid.";
    }
};


export const getRealtimeInspiration = async (query: string): Promise<InspirationalPerson | null> => {
    const systemInstruction = `You are an expert researcher specializing in the history and contributions of women in STEM. Your goal is to provide accurate, detailed, and inspiring profiles of notable women based on real-world information. Use your search capabilities to find up-to-date information.`;
    
    const userPrompt = `Find an inspirational woman in STEM related to the query: "${query}".

    Provide her profile as a JSON object string. The JSON object must have the following keys:
    - "id": a unique string identifier in "kebab-case" (e.g., "grace-hopper").
    - "name": a string with her full name.
    - "field": a string describing her primary field(s) (e.g., "Computer Science, Physics").
    - "bio": a string containing a detailed biography of 3-4 sentences.
    - "majorAchievements": an array of strings listing her key accomplishments.
    - "awards": an array of strings listing notable awards. Can be an empty array if none are prominent.
    - "quote": an inspiring and verified quote from her.
    - "links": an object with optional "wikipedia", "website", "twitter" string properties (full URLs).
    - "category": a string, which must be one of: "Historical Pioneers", "Modern Innovators", "Rising Stars", "Nobel Laureates".

    Ensure the entire response is ONLY the JSON object string, without any surrounding text, comments, or markdown formatting like \`\`\`json.`;

    try {
        const response = await ai.models.generateContent({
           model: "gemini-2.5-flash",
           contents: userPrompt,
           config: {
             systemInstruction,
             tools: [{googleSearch: {}}],
           },
        });
        
        const jsonText = response.text.trim();
        // Sometimes the model might wrap the JSON in ```json ... ```, so let's strip that.
        const cleanedJsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        
        const result = JSON.parse(cleanedJsonText) as Omit<InspirationalPerson, 'photoUrl' | 'videoUrl'>;
        return { ...result, photoUrl: '', videoUrl: undefined }; // Add dummy photoUrl

    } catch (error) {
        console.error("Error getting realtime inspiration with Gemini API:", error);
        logError(error, { function: 'getRealtimeInspiration', query });
        return null;
    }
};
