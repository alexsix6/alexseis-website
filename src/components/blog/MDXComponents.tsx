/**
 * MDX component overrides for consistent blog styling
 */
import React from 'react';

const MDXComponents: Record<string, React.ComponentType<Record<string, unknown>>> = {
  h1: (props) => (
    <h1
      className="text-3xl md:text-4xl font-extrabold mt-10 mb-6"
      style={{ color: 'var(--current-text)' }}
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-2xl md:text-3xl font-bold mt-8 mb-4 border-b pb-2"
      style={{ color: 'var(--current-text)', borderBottomColor: 'var(--current-border)' }}
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-xl md:text-2xl font-semibold mt-6 mb-3"
      style={{ color: 'var(--current-text)' }}
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="text-lg font-semibold mt-4 mb-2"
      style={{ color: 'var(--current-text)' }}
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="text-base leading-relaxed mb-4"
      style={{ color: 'var(--current-text-secondary)' }}
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="text-accent underline underline-offset-2 hover:text-primary transition-colors"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="list-disc list-inside mb-4 space-y-1"
      style={{ color: 'var(--current-text-secondary)' }}
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="list-decimal list-inside mb-4 space-y-1"
      style={{ color: 'var(--current-text-secondary)' }}
      {...props}
    />
  ),
  li: (props) => (
    <li className="text-base leading-relaxed" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-4 pl-4 my-4 italic"
      style={{
        borderLeftColor: 'var(--accent)',
        color: 'var(--current-text-muted)',
      }}
      {...props}
    />
  ),
  code: (props) => {
    // Inline code (not inside a pre block)
    const isInline = typeof props.children === 'string';
    if (isInline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded text-sm font-mono"
          style={{
            backgroundColor: 'var(--current-surface)',
            color: 'var(--accent)',
          }}
          {...props}
        />
      );
    }
    return <code {...props} />;
  },
  pre: (props) => (
    <pre
      className="rounded-xl p-4 mb-6 overflow-x-auto text-sm leading-relaxed border"
      style={{
        backgroundColor: 'var(--current-surface)',
        borderColor: 'var(--current-border)',
      }}
      {...props}
    />
  ),
  table: (props) => (
    <div className="overflow-x-auto mb-6">
      <table
        className="w-full text-sm border-collapse border rounded-lg"
        style={{ borderColor: 'var(--current-border)' }}
        {...props}
      />
    </div>
  ),
  th: (props) => (
    <th
      className="text-left px-4 py-2 font-semibold border-b"
      style={{
        backgroundColor: 'var(--current-surface)',
        borderBottomColor: 'var(--current-border)',
        color: 'var(--current-text)',
      }}
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="px-4 py-2 border-b"
      style={{
        borderBottomColor: 'var(--current-border)',
        color: 'var(--current-text-secondary)',
      }}
      {...props}
    />
  ),
  hr: () => (
    <hr
      className="my-8 border-t"
      style={{ borderTopColor: 'var(--current-border)' }}
    />
  ),
  strong: (props) => (
    <strong style={{ color: 'var(--current-text)' }} {...props} />
  ),
  em: (props) => (
    <em style={{ color: 'var(--current-text-muted)' }} {...props} />
  ),
};

export default MDXComponents;
