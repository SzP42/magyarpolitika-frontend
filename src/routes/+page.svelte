<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';
	import ArticleCard from '$lib/components/ArticleCard.svelte';

	let articles = $state([]);
	let loading = $state(true);
	let error = $state(null);

	onMount(async () => {
		try {
			const { data, error: fetchError } = await supabase
				.from('articles')
				.select('*')
				.order('created_at', { ascending: false });

			if (fetchError) throw fetchError;

			articles = data || [];
		} catch (e) {
			error = e.message || 'Failed to load articles';
			console.error('Error fetching articles:', e);
		} finally {
			loading = false;
		}
	});
</script>

<div class="text-gray-100">
	<div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
		<header class="mb-8">
			<h1 class="text-4xl font-bold mb-2 sm:text-5xl">News</h1>
			<p class="text-gray-400">Latest articles and updates</p>
		</header>

		{#if loading}
			<div class="flex justify-center items-center py-20">
				<div class="text-gray-400 text-lg">Loading articles...</div>
			</div>
		{:else if error}
			<div class="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
				<p class="text-red-400">Error: {error}</p>
			</div>
		{:else if articles.length === 0}
			<div class="text-center py-20">
				<p class="text-gray-400 text-lg">No articles found.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each articles as article (article.id)}
					<ArticleCard {article} />
				{/each}
			</div>
		{/if}
	</div>
</div>
