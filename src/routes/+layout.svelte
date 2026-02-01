<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import ChatPanel from '$lib/components/ChatPanel.svelte';
	import { setContext } from 'svelte';

	let { children } = $props();

	let chatPanelOpen = $state(false);
	let currentArticle = $state(null);
	let initialMessage = $state(null);
	let contextArticles = $state([]);
	let viewMode = $state('articles'); // 'articles' or 'chat' for mobile

	function openChatWithArticle(article) {
		currentArticle = article;
		initialMessage = null;
		chatPanelOpen = true;
		viewMode = 'chat';
	}

	function openChatWithMessage(message) {
		currentArticle = null;
		initialMessage = message;
		chatPanelOpen = true;
		viewMode = 'chat';
	}

	function addToContext(article) {
		// Limit to 3 articles
		if (contextArticles.length >= 3) {
			alert('Maximum 3 cikk lehet a kontextusban!');
			return;
		}
		if (!contextArticles.find(a => a.id === article.id)) {
			contextArticles = [...contextArticles, article];
		}
	}

	function removeFromContext(articleId) {
		contextArticles = contextArticles.filter(a => a.id !== articleId);
	}

	function toggleChat() {
		if (chatPanelOpen) {
			chatPanelOpen = false;
			viewMode = 'articles';
		} else {
			chatPanelOpen = true;
			viewMode = 'chat';
		}
	}

	function handleChatClose() {
		chatPanelOpen = false;
		viewMode = 'articles';
	}

	// Provide context for child components
	setContext('chatContext', {
		openChatWithArticle,
		openChatWithMessage,
		addToContext,
		removeFromContext,
		contextArticles: () => contextArticles
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="color-scheme" content="light" />
</svelte:head>

<div class="min-h-screen flex flex-col lg:flex-row" style="background-color: #f0eee7;">
	<!-- Mobile Toggle Button -->
	<!-- <div class="lg:hidden fixed bottom-4 right-4 z-50">
		<button
			onclick={toggleChat}
			class="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
			title={chatPanelOpen ? 'Show articles' : 'Show chat'}
			aria-label={chatPanelOpen ? 'Show articles' : 'Show chat'}
		>
			{#if chatPanelOpen}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
					/>
				</svg>
			{/if}
		</button>
	</div> -->

	<!-- Main Content Area -->
	<div
		class="flex-1 transition-all duration-300 {viewMode === 'chat' ? 'hidden lg:block' : ''}"
	>
		{@render children()}
	</div>

	<!-- Chat Panel -->
	<div
		class="fixed lg:sticky lg:top-0 lg:h-screen inset-0 lg:inset-auto z-50 lg:z-auto {viewMode === 'chat' ?
		'block' : 'hidden'} lg:block {chatPanelOpen ? 'lg:w-96' : 'lg:w-0'} lg:overflow-hidden transition-all duration-300"
	>
		<div class="h-full w-full lg:w-96">
			<ChatPanel
				bind:isOpen={chatPanelOpen}
				bind:currentArticle={currentArticle}
				bind:initialMessage={initialMessage}
				bind:contextArticles={contextArticles}
				onRemoveContext={removeFromContext}
				onClose={handleChatClose}
			/>
		</div>
	</div>
</div>
