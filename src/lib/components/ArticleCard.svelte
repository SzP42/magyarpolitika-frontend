<script>
	let { article, onDiscuss } = $props();
</script>

<article class="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors duration-200 shadow-lg flex flex-col">
	<h2 class="text-xl font-semibold mb-3 text-white sm:text-2xl">
		{article.title}
	</h2>
	
	<div class="text-gray-300 mb-4 line-clamp-3 flex-1">
		{article.article}
	</div>

	{#if article.sources && article.sources.length > 0}
		<div class="mt-4 pt-4 border-t border-gray-700">
			<p class="text-sm text-gray-400 mb-2">Sources:</p>
			<ul class="space-y-1">
				{#each article.sources as source (source)}
					<li class="text-sm text-gray-300">
						• {source}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div class="mt-4 pt-4 border-t border-gray-700">
		<button
			onclick={() => onDiscuss?.(article)}
			class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
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
					d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
				/>
			</svg>
			Discuss
		</button>
	</div>
</article>

