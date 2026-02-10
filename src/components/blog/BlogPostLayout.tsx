/**
 * BlogPostLayout - Shared layout for individual blog posts
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Tag, User } from 'lucide-react';
import { MDXProvider } from '@mdx-js/react';
import MDXComponents from './MDXComponents';
import type { BlogPost } from '@/content/blog';

interface BlogPostLayoutProps {
  post: BlogPost;
}

const BlogPostLayout: React.FC<BlogPostLayoutProps> = ({ post }) => {
  const { frontmatter, Component } = post;
  const { t, i18n } = useTranslation('common');
  const isEn = i18n.language?.startsWith('en');
  const localizedTitle = (isEn && frontmatter.title_en) ? frontmatter.title_en : frontmatter.title;
  const localizedDescription = (isEn && frontmatter.description_en) ? frontmatter.description_en : frontmatter.description;
  const formattedDate = new Date(frontmatter.date).toLocaleDateString(
    isEn ? 'en-US' : 'es-ES',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12 md:py-20"
    >
      <div className="container-max max-w-3xl mx-auto">
        {/* Back link */}
        <NavLink
          to="/blog"
          className="inline-flex items-center gap-2 text-sm mb-8 hover:text-accent transition-colors"
          style={{ color: 'var(--current-text-muted)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('blog.back_to_blog')}
        </NavLink>

        {/* Header */}
        <header className="mb-10">
          {/* Tags */}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(var(--accent-rgb), 0.15)',
                    color: 'var(--accent)',
                  }}
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4"
            style={{ color: 'var(--current-text)' }}
          >
            {localizedTitle}
          </h1>

          <p
            className="text-lg mb-6"
            style={{ color: 'var(--current-text-muted)' }}
          >
            {localizedDescription}
          </p>

          {/* Meta */}
          <div
            className="flex items-center gap-4 text-sm border-b pb-6"
            style={{
              color: 'var(--current-text-muted)',
              borderBottomColor: 'var(--current-border)',
            }}
          >
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={frontmatter.date}>{formattedDate}</time>
            </div>
            {frontmatter.author && (
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{frontmatter.author}</span>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <article className="prose-custom">
          <MDXProvider components={MDXComponents}>
            <Component />
          </MDXProvider>
        </article>

        {/* CTA footer */}
        <div
          className="mt-12 p-6 rounded-xl border text-center"
          style={{
            backgroundColor: 'var(--current-surface)',
            borderColor: 'var(--current-border)',
          }}
        >
          <p
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--current-text)' }}
          >
            {t('blog.cta_title')}
          </p>
          <p
            className="text-sm mb-4"
            style={{ color: 'var(--current-text-muted)' }}
          >
            {t('blog.cta_description')}
          </p>
          <NavLink
            to="/intake"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            }}
          >
            {t('cta.roadmap')}
          </NavLink>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPostLayout;
