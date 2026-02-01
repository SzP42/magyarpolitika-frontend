<script>
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import Politik from '$lib/assets/Politik.png';

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

	// Tags configuration
	const tags = [
		{ slug: 'Fidesz', name: 'Fidesz' },
		{ slug: 'Tisza', name: 'Tisza' },
		{ slug: 'oktatas', name: 'Oktatás' },
		{ slug: 'gazdasag', name: 'Gazdaság' },
		{ slug: 'gyermekvedelem', name: 'Gyermekvédelem' },
		{ slug: 'kampany', name: 'Kampány' },
		{ slug: 'kulpolitika', name: 'Külpolitika' },
		{ slug: 'egeszsegugy', name: 'Egészségügy' },
		{ slug: 'kozlekedes', name: 'Közlekedés' },
		{ slug: 'egyeb', name: 'Egyéb' }
	];
</script>

<div class="text-[#7b3f00]">
	<div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
		<header class="mb-8 text-center">
			<img src={Politik} alt="Magyar Politika 2026" class="mb-4 w-32 mx-auto" />
			<h3 class="text-xl text-[#7b3f00]">Ai hírösszefoglalók a magyar politika történéseiről</h3>
			<h3 class="text-lg text-[#7b3f00]">Made by Patrik Szabó</h3>
			<h3 class="text-lg text-[#7b3f00] underline"><a href="/how-it-works">Hogy működik?</a></h3>
		</header>

		<!-- Tags Navigation -->
		<nav class="mb-8 border-b border-[#7b3f00] pb-4">
			<div class="flex flex-wrap gap-4 justify-center">
				{#each tags as tag}
					<a
						href="/tag/{tag.slug}"
						class="text-[#7b3f00] hover:text-[#5a2f00] transition-colors font-medium"
					>
						{tag.name}
					</a>
				{/each}
			</div>
		</nav>

		{#if data.articles.length === 0}
			<div class="text-center py-20">
				<p class="text-[#7b3f00] text-lg">Nincsenek cikkek.</p>
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

			{#if data.totalPages > 1}
				<div class="mt-12">
					<Pagination currentPage={data.currentPage} totalPages={data.totalPages} />
				</div>
			{/if}
		{/if}
	</div>
</div>