<script>
	import { getContext } from 'svelte';
    import { marked } from 'marked';

	let { data } = $props();
	let article = $derived(data.article);

	// Create state for toggling source visibility 
	let showSources = $state(false);

	const chatContext = getContext('chatContext');

	function handleDiscuss() {
		chatContext?.openChatWithArticle(article);
	}
</script>

<style>
	.article-content :global(h2:has(strong):first-child),
	.article-content :global(h3:has(strong):first-child),
	.article-content :global(p:first-of-type) {
		/* Style for TL;DR sections */
	}

	.article-content :global(h2),
	.article-content :global(h3) {
		color: #123524;
		font-weight: bold;
		margin-top: 1.5rem;
		margin-bottom: 1rem;
	}

	.article-content :global(h2) {
		font-size: 1.5rem;
		border-left: 4px solid #123524;
		padding-left: 1rem;
		background: #f5f9f6;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
		border-radius: 0 0.5rem 0.5rem 0;
	}

	.article-content :global(h3) {
		font-size: 1.25rem;
	}

	.article-content :global(ul) {
		list-style-type: disc;
		margin-left: 1.5rem;
		margin-top: 0.5rem;
		margin-bottom: 1rem;
	}

	.article-content :global(ol) {
		list-style-type: decimal;
		margin-left: 1.5rem;
		margin-top: 0.5rem;
		margin-bottom: 1rem;
	}

	.article-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.article-content :global(strong) {
		color: #123524;
		font-weight: 700;
	}

	.article-content :global(a) {
		color: #123524;
		text-decoration: underline;
	}

	.article-content :global(a:hover) {
		color: #0d2519;
	}
</style>

<div class="text-black min-h-full">
	<div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
		<a
			href="/"
			class="inline-flex items-center text-[#123524] hover:text-[#0d2519] mb-6 transition-colors group"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
					clip-rule="evenodd"
				/>
			</svg>
			Vissza a Hírekhez
		</a>

		<article class="bg-white rounded-lg p-6 sm:p-8 shadow-xl border border-gray-200">
			<h1 class="text-3xl sm:text-4xl font-bold mb-6 text-black leading-tight">
				{article.title}
			</h1>

			<div class="article-content text-gray-800 mb-8 whitespace-pre-wrap leading-relaxed text-lg">
				{@html marked.parse(article.article)}
			</div>

			{#if article.sources && article.sources.length > 0}
				<div class="mb-8 pt-6 border-t border-gray-300">
					<div class="flex items-center gap-4 mb-3">
						<button
							onclick={() => (showSources = !showSources)}
							class="text-sm text-[#123524] hover:text-[#0d2519] underline focus:outline-none"
						>
							{showSources ? 'Források elrejtése' : 'Források megjelenítése'}
						</button>
					</div>

					{#if showSources}
						<ul class="space-y-2">
							{#each article.sources as source}
								<li class="text-gray-600 flex items-start break-all">
									<span class="mr-2 text-blue-500">•</span>
									<a
										href={source.link}
										target="_blank"
										rel="noopener noreferrer"
										class="hover:text-black hover:underline transition-colors"
									>
										{source.title}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/if}

			<div class="pt-6 border-t border-gray-300 flex justify-end">
				<button
					onclick={handleDiscuss}
					class="w-full sm:w-auto px-6 py-3 bg-[#123524] text-white rounded-lg hover:bg-[#0d2519] transition-colors duration-200 flex items-center justify-center gap-2 font-medium shadow-md"
				>
					Kérdésem van
				</button>
			</div>
		</article>
	</div>
</div>