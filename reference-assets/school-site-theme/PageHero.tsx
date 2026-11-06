import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

/** Banner shown at the top of every inner page — same look across the whole site. */
const PageHero: React.FC<PageHeroProps> = ({ eyebrow, title, description, children }) => (
  <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-brand-cream to-gold-50 border-b border-primary-100">
    <div className="absolute inset-0 bg-heritage-pattern [background-size:22px_22px] opacity-70" aria-hidden />
    <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gold-200/40 blur-3xl" aria-hidden />
    <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-primary-200/40 blur-3xl" aria-hidden />

    <div className="container-custom relative py-12 md:py-16 text-center">
      <nav className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="inline-flex items-center gap-1 hover:text-primary-700">
          <Home size={13} /> Home
        </Link>
        <ChevronRight size={13} />
        <span className="text-primary-700 font-semibold">{title}</span>
      </nav>
      <span className="eyebrow mb-3">{eyebrow}</span>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary-900 leading-tight max-w-3xl mx-auto">
        {title}
      </h1>
      <div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary-600 to-gold-400 mx-auto mt-5" />
      {description && (
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mt-5">{description}</p>
      )}
      {children}
    </div>
  </section>
);

export default PageHero;
