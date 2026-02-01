import { supabase } from '$lib/supabase.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { slug } = params;

	// Valid tags
	const validTags = [
		'Fidesz',
		'Tisza',
		'oktatas',
		'gazdasag',
		'gyermekvedelem',
		'kampany',
		'kulpolitika',
		'egeszsegugy',
		'kozlekedes',
		'egyeb'
	];

	if (!validTags.includes(slug)) {
		throw error(404, 'Tag not found');
	}

	console.log(`Fetching articles for tag: ${slug}`);

	// Fetch articles that contain this tag
	const { data: articles, error: fetchError } = await supabase
		.from('articles')
		.select('*')
		.contains('tags', [slug])
		.order('created_at', { ascending: false });



	if (fetchError) {
		console.error('Error fetching articles:', fetchError);
		console.error('Query details:', { slug, error: fetchError.message });
		throw error(500, `Failed to load articles: ${fetchError.message}`);
	}

	return {
		tag: slug,
		articles: articles || []
	};
}
