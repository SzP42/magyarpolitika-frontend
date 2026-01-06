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
</script>

<a 
	href="/article/{article.id}"
	class="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors duration-200 shadow-lg flex flex-col block h-full text-left group no-underline"
>
    <h2 class="text-xl font-semibold mb-3 text-white sm:text-2xl">
        {article.title}
    </h2>
    
    <div class="text-gray-300 mb-2 flex-1 text-sm max-w-none line-clamp-3">
        {stripMarkdown(article.article)}
    </div>

</a>