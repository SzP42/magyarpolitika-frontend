<script>
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import Politik from '$lib/assets/Politik.png';
	import { getContext } from 'svelte';

	let { data } = $props();

	const chatContext = getContext('chatContext');
	let searchQuery = $state('');

	let contextArticles = $derived(chatContext?.contextArticles?.() || []);

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
		{ slug: 'kozlekedes', name: 'Közlekedés (MÁV)' },
		{ slug: 'egyeb', name: 'Egyéb' }
	];

	function handleSearch(event) {
		event.preventDefault();
		if (searchQuery.trim()) {
			chatContext.openChatWithMessage(searchQuery.trim());
			searchQuery = '';
		}
	}

	function handleKeyPress(event) {
		if (event.key === 'Enter') {
			handleSearch(event);
		}
	}
</script>

<div class="text-[#7b3f00]">
	<div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
		<header class="mb-8 text-center">
			<img src={Politik} alt="Magyar Politika 2026" class="mb-4 w-32 mx-auto" />
			<h3 class="text-xl text-[#7b3f00]">Ai hírösszefoglalók a magyar politika történéseiről</h3>
			<h3 class="text-lg text-[#7b3f00]">Made by Patrik Szabó</h3>
		</header>

		<!-- Search Box -->
		<div class="mb-6 max-w-2xl mx-auto">
			<form onsubmit={handleSearch} class="relative">
				<input
					type="text"
					bind:value={searchQuery}
					onkeydown={handleKeyPress}
					placeholder="Kérdezz bármit a magyar politikáról"
					class="w-full px-4 py-3 pr-12 border-2 border-[#7b3f00] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7b3f00] focus:border-transparent bg-white text-[#7b3f00] placeholder-[#7b3f00] placeholder-opacity-50"
				/>
				<button
					type="submit"
					class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#7b3f00] hover:text-[#5a2f00] transition-colors"
					aria-label="Küldés"
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
							d="M13 7l5 5m0 0l-5 5m5-5H6"
						/>
					</svg>
				</button>
			</form>

			<!-- Context Display -->
			{#if contextArticles.length > 0}
				<div class="mt-3 text-sm text-[#123524]">
					<span class="font-semibold">Context:</span>
					{#each contextArticles as article, index}
						<span>
							{article.title.split(' ').slice(0, 3).join(' ')}...{#if index < contextArticles.length - 1},{/if}
						</span>
					{/each}
				</div>
			{/if}
		</div>

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