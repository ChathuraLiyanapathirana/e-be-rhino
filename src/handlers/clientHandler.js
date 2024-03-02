const { Router } = require("express");
const OpenAI = require("openai");
require('dotenv').config();

const router = Router();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

router.post("/gpt-call", async (req, res, next) => {
    try {
        console.error("gpt-call init");
        const prompt = req.body.prompt;
        const useId = req.body.useId;
        const maxTokens = Number(process.env.MAX_TOKENS);
        const temperature = Number(process.env.TEMPERATURE);
        const modal = process.env.MODEL;

        if (!prompt) {
            res.status(400).send("Please provide 'prompt' in the request body.");
            return;
        }

        try {
            const response = await openai.chat.completions.create({
                model: modal,
                messages: [{ role: "user", content: prompt }],
                max_tokens: maxTokens,
                temperature: temperature,
            });

            console.log("openai Response: ", JSON.stringify(response));

            const generatedContent = response.choices[0].message.content;
            const fingerprint = response.system_fingerprint;
            const id = response.id;

            if (generatedContent) {
                res.status(200).json({
                    data: {
                        content: generatedContent,
                        fingerprint,
                        id
                    }
                });
            } else {
                res.status(500).json({ error: "No proper response from OpenAI" });
            }

        } catch (error) {
            console.error("openai Error: ", error);
            res.status(500).json({ error: error });
        }
    } catch (error) {
        console.error("gpt-call error" + error);
        res.status(500).send(error);
    }
});

module.exports = router;
