import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://aotxxkzjbbqnkuhatpjf.supabase.co';
// TODO: Replace with your service_role key from Supabase Dashboard → Settings → API
// Service role key starts with "eyJ..." and bypasses RLS
const supabaseKey =
	'sb_secret_AeQqGRJ9KL1_lkfmZuj_og_PEsGot-l'; // Replace with service_role key

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixTags() {
	console.log('Fetching all articles...');

	// Fetch all articles
	const { data: articles, error: fetchError } = await supabase
		.from('articles')
		.select('id, tags');

	if (fetchError) {
		console.error('Error fetching articles:', fetchError);
		return;
	}

	console.log(`Found ${articles.length} articles`);

	let updatedCount = 0;
	let errorCount = 0;

	// Process each article
	for (const article of articles) {
		if (!article.tags || !Array.isArray(article.tags)) {
			console.log(`Skipping article ${article.id} - no tags or invalid format`);
			continue;
		}

		// Clean up tags by removing escaped quotes
		const cleanedTags = article.tags.map((tag) => {
			// Remove leading/trailing quotes and escaped quotes
			return tag.replace(/^["\\]+|["\\]+$/g, '').replace(/\\"/g, '');
		});

		// Check if tags actually changed
		const tagsChanged = JSON.stringify(article.tags) !== JSON.stringify(cleanedTags);

		if (!tagsChanged) {
			console.log(`Article ${article.id} - tags already clean`);
			continue;
		}

		console.log(`Article ${article.id}:`);
		console.log(`  Before: ${JSON.stringify(article.tags)}`);
		console.log(`  After:  ${JSON.stringify(cleanedTags)}`);

		// Update the article with cleaned tags
		const { error: updateError } = await supabase
			.from('articles')
			.update({ tags: cleanedTags })
			.eq('id', article.id);

		if (updateError) {
			console.error(`  ❌ Error updating article ${article.id}:`, updateError);
			errorCount++;
		} else {
			console.log(`  ✓ Updated successfully`);
			updatedCount++;
		}
	}

	console.log('\n=== Summary ===');
	console.log(`Total articles: ${articles.length}`);
	console.log(`Updated: ${updatedCount}`);
	console.log(`Errors: ${errorCount}`);
	console.log(`Skipped: ${articles.length - updatedCount - errorCount}`);
}

// Run the script
fixTags()
	.then(() => {
		console.log('\n✓ Script completed');
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n❌ Script failed:', error);
		process.exit(1);
	});
