import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { message, article, conversationHistory } = await request.json();

		if (!message || typeof message !== 'string') {
			return json({ error: 'Message is required' }, { status: 400 });
		}

		// TODO: Integrate with actual AI/LLM service (OpenAI, Anthropic, etc.)
		// For now, return a simple response based on the article context
		let response = '';

		if (article) {
			response = `Based on the article "${article.title}", I can help you understand more about this topic. `;
			response += `The article discusses: ${article.article.substring(0, 200)}... `;
			response += `Regarding your question "${message}", I would need to analyze the full article content to provide a detailed answer. `;
			response +=
				'In a production environment, this would be connected to an AI service that can analyze the article and answer your questions.';
		} else {
			response = `You asked: "${message}". `;
			response +=
				'I can help you discuss articles from the news feed. Click the "Discuss" button on any article card to start a conversation about that specific article.';
		}

		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		return json({ response });
	} catch (error) {
		console.error('Chat API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}

