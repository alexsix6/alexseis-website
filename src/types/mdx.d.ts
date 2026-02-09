declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const MDXComponent: ComponentType;
  export default MDXComponent;
  export const frontmatter: {
    title: string;
    date: string;
    description: string;
    slug: string;
    tags?: string[];
    author?: string;
    image?: string;
  };
}
