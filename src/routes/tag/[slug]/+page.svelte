<script>
	import ArticleCard from '$lib/components/ArticleCard.svelte';

	let { data } = $props();

	// Group articles by date
	let groupedArticles = $derived.by(() => {
		const groups = {};
		data.articles.forEach((article) => {
			const date = new Date(article.created_at).toLocaleDateString('hu-HU', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
			if (!groups[date]) groups[date] = [];
			groups[date].push(article);
		});
		return groups;
	});

	// Tag display names
	const tagNames = {
		Fidesz: 'Fidesz',
		Tisza: 'Tisza',
		oktatas: 'Oktatás',
		gazdasag: 'Gazdaság',
		gyermekvedelem: 'Gyermekvédelem',
		kampany: 'Kampány',
		kulpolitika: 'Külpolitika',
		egeszsegugy: 'Egészségügy',
		kozlekedes: 'Közlekedés',
		egyeb: 'Egyéb'
	};
</script>

<div class="text-[#7b3f00]">
	<div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
		<header class="mb-8">
			<a href="/" class="text-[#7b3f00] hover:underline mb-4 inline-block">&larr; Vissza a főoldalra</a>
			<h1 class="text-3xl font-bold text-[#7b3f00] mb-2">{tagNames[data.tag]}</h1>
			<p class="text-lg text-[#7b3f00]">
				{data.articles.length} cikk ebben a kategóriában
			</p>
		</header>

		{#if data.articles.length === 0}
			<div class="text-center py-20">
				<p class="text-[#7b3f00] text-lg">Nincsenek cikkek ebben a kategóriában.</p>
			</div>
		{:else}
			{#each Object.entries(groupedArticles) as [date, articles]}
				<h2 class="text-2xl font-bold text-[#7b3f00] mb-4 mt-8 first:mt-0">
					{date}
				</h2>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each articles as article (article.id)}
						<ArticleCard {article} />
					{/each}
				</div>
			{/each}
		{/if}
	</div>
</div>
