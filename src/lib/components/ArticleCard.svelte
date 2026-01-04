<script>
	let { article } = $props();
</script>

<article class="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors duration-200 shadow-lg">
	<h2 class="text-xl font-semibold mb-3 text-white sm:text-2xl">
		{article.title}
	</h2>
	
	<div class="text-gray-300 mb-4 line-clamp-3">
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
</article>

