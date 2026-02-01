<script>
    import { marked } from 'marked'; // You can remove this if you only use it for this specific card
    import { getContext } from 'svelte';

    let { article, onDiscuss } = $props();

    const chatContext = getContext('chatContext');

    function handleAddToContext(e) {
        e.preventDefault();
        chatContext?.addToContext(article);
    }

    // Helper to remove markdown syntax for the preview
    function stripMarkdown(text) {
        if (!text) return '';
        return text
            .replace(/[#*`_~]/g, '')          // Remove formatting chars (#, *, `, _, ~)
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Keep link text, remove URL
            .replace(/!\[(.*?)\]\(.*?\)/g, '')  // Remove images entirely
            .replace(/^\s*-\s+/gm, '')        // Remove list bullets
            .replace(/^\s*\d+\.\s+/gm, '')    // Remove list numbers
            .replace(/^\s*>\s+/gm, '')        // Remove blockquotes
            .replace(/\n+/g, ' ')             // Replace newlines with spaces for the snippet
            .trim();
    }

    // Format date for display
    const formattedDate = new Date(article.created_at).toLocaleString('hu-HU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
</script>

<div class="relative h-full">
	<a
		href="/article/{article.id}"
		class="bg-white rounded-lg p-6 hover:bg-gray-100 transition-colors duration-200 shadow-lg flex flex-col block h-full text-left group no-underline border-2 border-[#123524]"
	>
		<h2 class="text-xl font-semibold mb-2 text-black sm:text-2xl pr-8">
			{article.title}
		</h2>

		<div class="text-gray-600 text-sm mb-3">
			{formattedDate}
		</div>

		<div class="text-gray-800 mb-2 flex-1 text-sm max-w-none line-clamp-3">
			{stripMarkdown(article.article)}
		</div>
	</a>

	<button
		onclick={handleAddToContext}
		class="absolute top-2 right-2 w-8 h-8 bg-[#123524] text-white rounded hover:bg-[#0d2519] transition-colors flex items-center justify-center shadow-md z-10"
		title="Hozzáadás a kontextushoz"
		aria-label="Hozzáadás a kontextushoz"
	>
		<span class="text-lg font-bold leading-none">+</span>
	</button>
</div>