# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit web application for consuming and discussing Hungarian political news articles with AI assistance. Articles are stored in Supabase and users can ask questions about them using Mistral AI through a chat interface.

## Development Commands

```bash
# Start development server
npm run dev

# Start dev server and open in browser
npm run dev -- --open

# Build for production
npm run build

# Preview production build
npm run preview

# Format code
npm run format

# Lint code
npm run lint
```

## Architecture

### Tech Stack
- **Framework:** SvelteKit 2 with Svelte 5
- **Styling:** Tailwind CSS 4 with typography plugin
- **Database:** Supabase (direct client-side queries for articles)
- **AI:** Mistral AI via LangChain
- **Deployment:** Vercel (configured with @sveltejs/adapter-vercel)

### Key Integrations

**Supabase Configuration** (`src/lib/supabase.js`):
- Exports a singleton `supabase` client
- Uses hardcoded public credentials (safe for client-side)
- Articles table schema: `id`, `title`, `article` (markdown), `created_at`, `sources` (array)
- Direct queries from client components for read-only article data

**AI Chat API** (`src/routes/api/chat/+server.js`):
- Server-side endpoint to protect Mistral API key
- Uses LangChain's `ChatMistralAI` with model `mistral-large-2512`
- Accepts: `message`, `article` (context), `conversationHistory`
- System prompt is in Hungarian for Hungarian politics expertise
- Returns AI responses as JSON

### Application Flow

**Layout-Level Context** (`src/routes/+layout.svelte`):
- Manages global chat panel visibility
- Provides `openChatWithArticle()` function via Svelte context
- Child routes use `getContext('chat')` to access chat functionality

**Routes:**
- `/` - Homepage with article grid (fetches from Supabase)
- `/article/[id]` - Article detail page with markdown rendering
- `/how-it-works` - Information page
- `/api/chat` - Server-side chat endpoint

**Components:**
- `ArticleCard.svelte` - Displays article preview card
- `ChatPanel.svelte` - Chat interface with conversation history (client-side state only)

### Responsive Design
- Desktop: Main content (left) + collapsible chat panel (right, sticky, w-96)
- Mobile: Toggle between 'articles' and 'chat' views
- Uses `lg:` breakpoints for conditional rendering

## Important Patterns

### Markdown Handling
- Articles stored as markdown in Supabase
- Rendered using `marked` library
- Used in: ArticleCard (stripping), article detail page, ChatPanel messages

### State Management
- Chat history: Maintained in ChatPanel component state (not persistent)
- Article data: Loaded via SvelteKit's `+page.js` load functions
- Global chat state: Layout context + bind directives

### Environment Variables
- `MISTRAL_API_KEY` - Required in `.env` for server-side chat API
- Supabase credentials hardcoded in `src/lib/supabase.js` (public key)

## Code Quality
- ESLint configured with Svelte plugin
- Prettier with Tailwind plugin for formatting
- Config: tabs, single quotes, trailing commas (see `.prettierrc`)
