/**
 * Blog post registry
 * Uses import.meta.glob to eagerly load all MDX posts
 */

interface BlogFrontmatter {
  title: string;
  date: string;
  description: string;
  slug: string;
  tags?: string[];
  author?: string;
  image?: string;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  Component: React.ComponentType;
}

// Eagerly import all MDX files in this directory
const modules = import.meta.glob<{
  default: React.ComponentType;
  frontmatter: BlogFrontmatter;
}>('./*.mdx', { eager: true });

// Build array of posts from glob results
const posts: BlogPost[] = Object.values(modules).map((mod) => ({
  slug: mod.frontmatter.slug,
  frontmatter: mod.frontmatter,
  Component: mod.default,
}));

/**
 * Get all posts sorted by date (newest first)
 */
export function getAllPosts(): BlogPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}
