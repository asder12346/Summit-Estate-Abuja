import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY }); // Vercel will have this env var

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { history, message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: `You are a helpful and professional AI real estate advisor for Summit Estate Nigeria. 
        You help users find land in Abuja, explain documentation (C of O, R of O), and provide investment advice.
        Keep answers concise, professional, and persuasive.
        If asked about prices, give realistic estimates (e.g., Lugbe: 15M-30M, Maitama: 100M+).
        Always encourage users to book an inspection.`,
                history: history || [],
            }
        });

        const response = await chat.sendMessage({ message });

        return res.status(200).json({ text: response.text });
    } catch (error) {
        console.error("Chat API Error:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
