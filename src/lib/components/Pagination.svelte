<script>
	let { currentPage, totalPages } = $props();

	// Generate page numbers with ellipsis (Google-style)
	function getPageNumbers(current, total) {
		const pages = [];
		const delta = 2; // Show 2 pages on each side of current

		if (total <= 7) {
			// Show all pages if total is small
			for (let i = 1; i <= total; i++) {
				pages.push(i);
			}
			return pages;
		}

		// Always show page 1
		pages.push(1);

		// Calculate range around current page
		const rangeStart = Math.max(2, current - delta);
		const rangeEnd = Math.min(total - 1, current + delta);

		// Add ellipsis if gap after page 1
		if (rangeStart > 2) pages.push('...');

		// Add pages around current
		for (let i = rangeStart; i <= rangeEnd; i++) {
			pages.push(i);
		}

		// Add ellipsis if gap before last page
		if (rangeEnd < total - 1) pages.push('...');

		// Always show last page
		if (total > 1) pages.push(total);

		return pages;
	}

	let pageNumbers = $derived(getPageNumbers(currentPage, totalPages));
</script>

<nav class="flex justify-center items-center gap-2" aria-label="Pagination">
	<!-- Previous button -->
	{#if currentPage > 1}
		<a
			href="/?page={currentPage - 1}"
			class="px-4 py-2 bg-white text-black border-2 border-[#123524] rounded-lg hover:bg-[#123524] hover:text-white transition-colors"
		>
			Előző
		</a>
	{:else}
		<span class="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed border-2 border-gray-300">Előző</span>
	{/if}

	<!-- Page numbers -->
	<div class="flex gap-2">
		{#each pageNumbers as page}
			{#if page === '...'}
				<span class="px-3 py-2 text-gray-600">...</span>
			{:else if page === currentPage}
				<span
					class="px-3 py-2 bg-[#123524] text-white rounded-lg font-semibold"
					aria-current="page"
				>
					{page}
				</span>
			{:else}
				<a
					href="/?page={page}"
					class="px-3 py-2 bg-white text-black border-2 border-[#123524] rounded-lg hover:bg-[#123524] hover:text-white transition-colors"
				>
					{page}
				</a>
			{/if}
		{/each}
	</div>

	<!-- Next button -->
	{#if currentPage < totalPages}
		<a
			href="/?page={currentPage + 1}"
			class="px-4 py-2 bg-white text-black border-2 border-[#123524] rounded-lg hover:bg-[#123524] hover:text-white transition-colors"
		>
			Következő
		</a>
	{:else}
		<span class="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed border-2 border-gray-300"
			>Következő</span
		>
	{/if}
</nav>
