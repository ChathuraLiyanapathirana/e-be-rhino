import { Router } from "express";

import { createRecordAndAppendMessage } from "../utils/dbHelper.js";
import { formatPrompt } from "../utils/helper.js";
import { CLIENT_REQUEST_PROMPT } from "../constants/prompts.js";
import { getOpenAICompletion } from "../utils/openaiHelper.js";

const router = Router();


router.post("/gpt-call", async (req, res) => {
    try {
        console.error("gpt-call init");
        const prompt = req.body.prompt;
        const area = req.body.area;
        const clientId = req.body.clientId;

        if (!prompt || !area || !clientId) {
            res.status(400).send("Please provide required params in the request body.");
            return;
        }

        try {
            // Format the prompt
            const formattedPrompt = formatPrompt(CLIENT_REQUEST_PROMPT, { content: prompt, area: area });

            // Call OpenAI
            const response = await getOpenAICompletion(formattedPrompt);

            console.log("openai Response: ", JSON.stringify(response));

            // Make a record of the message in the database
            await createRecordAndAppendMessage(clientId, prompt);

            const generatedContent = response.choices[0].message.content;

            if (generatedContent) {
                res.status(200).json({
                    data: {
                        content: generatedContent,
                    }
                });
            } else {
                res.status(500).json({ error: "No proper response from OpenAI" });
            }

        } catch (error) {
            console.error("openai Error: ", error);
            res.status(500).json({ error: response.error });
        }
    } catch (error) {
        console.error("gpt-call error" + error);
        res.status(500).send(error);
    }
});

export default router;