import { json } from '@sveltejs/kit';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { OPENAI_API_KEY } from '$env/static/private';

// Ensure you have MISTRAL_API_KEY in your .env file

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    try {
        // Extract data sent from ChatPanel.svelte
        const { message, article, contextArticles, conversationHistory } = await request.json();

        if (!message || typeof message !== 'string') {
            return json({ error: 'Message is required' }, { status: 400 });
        }

        // 1. Initialize OpenAI
        const chat = new ChatOpenAI({
            apiKey: OPENAI_API_KEY, // Make sure this is set in your .env
            model: "gpt-5-mini",
        });

        // 2. Build the Message History
        // Start with a system prompt to define the bot's behavior
        const messages = [
            new SystemMessage("Egy szakértő vagy a magyar politikában. Válaszolj érthetően lényegretörően, és röviden a kérdésre az adott kontextus alapján"),
        ];

        // If an article is selected, add it as context
        if (article) {
             messages.push(new SystemMessage(
                 `Context article title: "${article.title}".\n` +
                 `Content: ${article.article}`
             ));
        }

        // Add context articles if provided
        if (contextArticles && Array.isArray(contextArticles) && contextArticles.length > 0) {
            const contextContent = contextArticles.map(art =>
                `Title: "${art.title}"\nContent: ${art.article}`
            ).join('\n\n---\n\n');

            messages.push(new SystemMessage(
                `Additional context articles:\n\n${contextContent}`
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