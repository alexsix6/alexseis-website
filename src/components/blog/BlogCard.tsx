/**
 * BlogCard - Card for blog listing page
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import type { BlogPost } from '@/content/blog';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const { frontmatter } = post;
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
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group rounded-xl border overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: 'var(--current-surface)',
        borderColor: 'var(--current-border)',
      }}
    >
      <NavLink to={`/blog/${frontmatter.slug}`} className="block p-6">
        {/* Tags */}
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {frontmatter.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
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

        {/* Title */}
        <h2
          className="text-xl font-bold mb-2 group-hover:text-accent transition-colors"
          style={{ color: 'var(--current-text)' }}
        >
          {localizedTitle}
        </h2>

        {/* Description */}
        <p
          className="text-sm mb-4 line-clamp-3"
          style={{ color: 'var(--current-text-muted)' }}
        >
          {localizedDescription}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--current-text-muted)' }}>
            <Calendar className="h-3.5 w-3.5" />
            <time dateTime={frontmatter.date}>{formattedDate}</time>
            {frontmatter.author && (
              <>
                <span>·</span>
                <span>{frontmatter.author}</span>
              </>
            )}
          </div>
          <span className="text-accent text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            {t('blog.read')} <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </NavLink>
    </motion.article>
  );
};

export default BlogCard;
