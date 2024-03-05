import OpenAI from "openai";
import 'dotenv/config'

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export const getOpenAICompletion = async (prompt) => {
    return await openai.chat.completions.create({
        model: process.env.MODEL,
        messages: [{ role: "assistant", content: prompt }],
        max_tokens: Number(process.env.MAX_TOKENS),
        temperature: Number(process.env.TEMPERATURE),
    });
}