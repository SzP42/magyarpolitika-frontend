<script>
    import { marked } from 'marked'; // You can remove this if you only use it for this specific card
    let { article, onDiscuss } = $props();

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

<a
	href="/article/{article.id}"
	class="bg-white rounded-lg p-6 hover:bg-gray-100 transition-colors duration-200 shadow-lg flex flex-col block h-full text-left group no-underline border border-gray-200"
>
    <h2 class="text-xl font-semibold mb-2 text-black sm:text-2xl">
        {article.title}
    </h2>

    <div class="text-gray-600 text-sm mb-3">
        {formattedDate}
    </div>

    <div class="text-gray-800 mb-2 flex-1 text-sm max-w-none line-clamp-3">
        {stripMarkdown(article.article)}
    </div>

</a>