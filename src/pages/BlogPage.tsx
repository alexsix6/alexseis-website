/**
 * BlogPage - Blog listing page
 */
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { getAllPosts } from '@/content/blog';
import BlogCard from '@/components/blog/BlogCard';

const BlogPage: React.FC = () => {
  const posts = getAllPosts();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12 md:py-20"
    >
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-accent" />
            <h1
              className="text-3xl md:text-4xl font-extrabold"
              style={{ color: 'var(--current-text)' }}
            >
              Blog — IA Enterprise
            </h1>
          </div>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--current-text-muted)' }}
          >
            Insights técnicos sobre RAG, arquitecturas serverless, y transformación digital
            con inteligencia artificial.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p style={{ color: 'var(--current-text-muted)' }}>
              No hay posts publicados aún. ¡Vuelve pronto!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BlogPage;
