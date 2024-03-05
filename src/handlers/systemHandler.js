
import { formatPrompt } from "../utils/helper.js";
import { SYSTEM_PROMPT } from "../constants/prompts.js";
import { getOpenAICompletion } from "../utils/openaiHelper.js";

const systemHandler = async (content) => {
    try {
        // Format the prompt
        const formattedPrompt = formatPrompt(SYSTEM_PROMPT, { content: content, wordCount: process.env.SYSTEM_PROMPT_WORD_COUNT });

        // Call OpenAI
        const response = await getOpenAICompletion(formattedPrompt);

        console.log("system-call openai Response: ", JSON.stringify(response));

        // Make a record of the message in the database
        // await createRecordAndAppendMessage(useId, prompt);

        const generatedContent = response.choices[0].message.content;

        if (generatedContent) {
            return generatedContent;
        } else {
            console.log("system-call No proper response from OpenAI")
        }
        return null;
    } catch (error) {
        console.error("system-call openai Error: ", error);
    }

}

export default systemHandler;