import { json } from '@sveltejs/kit';
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { MISTRAL_API_KEY } from '$env/static/private';

// Ensure you have MISTRAL_API_KEY in your .env file

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    try {
        // Extract data sent from ChatPanel.svelte
        const { message, article, conversationHistory } = await request.json();

        if (!message || typeof message !== 'string') {
            return json({ error: 'Message is required' }, { status: 400 });
        }

        // 1. Initialize Mistral
        const chat = new ChatMistralAI({
            apiKey: MISTRAL_API_KEY, // Make sure this is set in your .env
            model: "mistral-large-2512",
            temperature: 0.5,
        });

        // 2. Build the Message History
        // Start with a system prompt to define the bot's behavior
        const messages = [
            new SystemMessage("Egy szakértő vagy a magyar politikában. Válaszolj érthetően és lényegretörően a kérdésre az adott kontextus alapján, de amikor szükséges, fejtsd ki a válaszod."),
        ];

        // If an article is selected, add it as context
        if (article) {
             messages.push(new SystemMessage(
                 `Context article title: "${article.title}".\n` +
                 `Content: ${article.article}`
             ));
        }

        // Add previous conversation history (mapping 'user'/'assistant' roles to LangChain classes)
        if (conversationHistory && Array.isArray(conversationHistory)) {
            conversationHistory.forEach(msg => {
                if (msg.role === 'user') {
                    messages.push(new HumanMessage(msg.content));
                } else if (msg.role === 'assistant') {
                    messages.push(new AIMessage(msg.content));
                }
            });
        }

        // Add the current user message
        messages.push(new HumanMessage(message));

        // 3. Call Mistral
        const response = await chat.invoke(messages);

        // 4. Return the response content
        return json({ response: response.content });

    } catch (error) {
        console.error('Chat API error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
}