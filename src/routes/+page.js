import { supabase } from '$lib/supabase';

export async function load({ url }) {
	// Pagination constants
	const ITEMS_PER_PAGE = 12;
	const page = parseInt(url.searchParams.get('page') || '1');
	const offset = (page - 1) * ITEMS_PER_PAGE;

	// Fetch articles with pagination (no date filter - show all articles)
	const { data: articles, error: fetchError } = await supabase
		.from('articles')
		.select('*')
		.order('created_at', { ascending: false })
		.range(offset, offset + ITEMS_PER_PAGE - 1);

	// Get total count for pagination
	const { count, error: countError } = await supabase
		.from('articles')
		.select('*', { count: 'exact', head: true });

	if (fetchError) {
		console.error('Error fetching articles:', fetchError);
	}

	if (countError) {
		console.error('Error fetching count:', countError);
	}

	const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

	return {
		articles: articles || [],
		totalCount: count || 0,
		currentPage: page,
		totalPages
	};
}
