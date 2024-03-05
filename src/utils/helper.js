// Desc: Helper methods for the application

// Method to check if message exceeds the word limit
export const checkMessageExceedsLimit = (message) => {
    return message.split(' ').length > 30;
}

// Method to replace dynamic values in prompt templates
export const formatPrompt = (template, values) => {
    let formattedPrompt = template;

    for (const key in values) {
        formattedPrompt = formattedPrompt.replace(`\${${key}}`, values[key]);
    }

    return formattedPrompt;
}