import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { data, error: fetchError } = await supabase
		.from('articles')
		.select('*')
		.eq('id', params.id)
		.single();

	if (fetchError || !data) {
		throw error(404, 'Article not found');
	}

	return {
		article: data
	};
}