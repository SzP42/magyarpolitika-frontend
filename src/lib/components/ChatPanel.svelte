<script>
	import { onMount } from 'svelte';

	let { isOpen = $bindable(false), currentArticle = $bindable(null), onClose } = $props();

	let messages = $state([]);
	let inputMessage = $state('');
	let isLoading = $state(false);
	let chatContainer;

	onMount(() => {
		if (currentArticle) {
			initializeChatWithArticle();
		}
	});

	function initializeChatWithArticle() {
		messages = [
			{
				role: 'assistant',
				content: `I can help you discuss the article: "${currentArticle.title}". What would you like to know about it?`
			}
		];
	}

	async function sendMessage() {
		if (!inputMessage.trim() || isLoading) return;

		const userMessage = inputMessage.trim();
		inputMessage = '';
		messages = [...messages, { role: 'user', content: userMessage }];
		isLoading = true;

		// Scroll to bottom
		setTimeout(() => {
			if (chatContainer) {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}
		}, 100);

		try {
			// Call API endpoint for chatbot
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: userMessage,
					article: currentArticle,
					conversationHistory: messages.slice(0, -1)
				})
			});

			if (!response.ok) {
				throw new Error('Failed to get response');
			}

			const data = await response.json();
			messages = [...messages, { role: 'assistant', content: data.response }];
		} catch (error) {
			console.error('Chat error:', error);
			messages = [
				...messages,
				{
					role: 'assistant',
					content: 'Sorry, I encountered an error. Please try again later.'
				}
			];
		} finally {
			isLoading = false;
			setTimeout(() => {
				if (chatContainer) {
					chatContainer.scrollTop = chatContainer.scrollHeight;
				}
			}, 100);
		}
	}

	function handleKeyPress(event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	function clearChat() {
		messages = [];
		if (currentArticle) {
			initializeChatWithArticle();
		}
	}

	$effect(() => {
		if (currentArticle && messages.length === 0) {
			initializeChatWithArticle();
		}
	});
</script>

<div class="flex flex-col h-full bg-gray-800 border-l border-gray-700">
	<!-- Header -->
	<div class="flex items-center justify-between p-4 border-b border-gray-700">
		<h2 class="text-lg font-semibold text-white">Chat about Articles</h2>
		<div class="flex gap-2">
			<button
				onclick={clearChat}
				class="p-2 text-gray-400 hover:text-white transition-colors"
				title="Clear chat"
				aria-label="Clear chat"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
					/>
				</svg>
			</button>
			<button
				onclick={() => {
					isOpen = false;
					onClose?.();
				}}
				class="p-2 text-gray-400 hover:text-white transition-colors lg:hidden"
				title="Close chat"
				aria-label="Close chat"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	</div>

	<!-- Chat Messages -->
	<div
		bind:this={chatContainer}
		class="flex-1 overflow-y-auto p-4 space-y-4"
	>
		{#if messages.length === 0}
			<div class="flex items-center justify-center h-full">
				<p class="text-gray-400 text-center">
					{#if currentArticle}
						Start a conversation about "{currentArticle.title}"
					{:else}
						Select an article to discuss or ask me anything about the news!
					{/if}
				</p>
			</div>
		{:else}
			{#each messages as message (message)}
				<div
					class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}"
				>
					<div
						class="max-w-[80%] rounded-lg p-3 {message.role === 'user'
							? 'bg-blue-600 text-white'
							: 'bg-gray-700 text-gray-100'}"
					>
						<p class="text-sm whitespace-pre-wrap">{message.content}</p>
					</div>
				</div>
			{/each}
			{#if isLoading}
				<div class="flex justify-start">
					<div class="bg-gray-700 rounded-lg p-3">
						<div class="flex gap-1">
							<div
								class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
								style="animation-delay: 0s"
							></div>
							<div
								class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
								style="animation-delay: 0.2s"
							></div>
							<div
								class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
								style="animation-delay: 0.4s"
							></div>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>

	<!-- Input Area -->
	<div class="p-4 border-t border-gray-700">
		<div class="flex gap-2">
			<textarea
				bind:value={inputMessage}
				onkeydown={handleKeyPress}
				placeholder="Ask about the article..."
				class="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
				rows="2"
				disabled={isLoading}
			></textarea>
			<button
				onclick={sendMessage}
				disabled={!inputMessage.trim() || isLoading}
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				aria-label="Send message"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
					/>
				</svg>
			</button>
		</div>
	</div>
</div>

