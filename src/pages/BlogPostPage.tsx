/**
 * BlogPostPage - Individual blog post view
 * Reads slug from URL params and renders the matching MDX post
 */
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getPostBySlug } from '@/content/blog';
import BlogPostLayout from '@/components/blog/BlogPostLayout';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/blog" replace />;
  }

  const post = getPostBySlug(slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return <BlogPostLayout post={post} />;
};

export default BlogPostPage;
