
import React, { forwardRef } from 'react';

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const Section = forwardRef<HTMLElement, SectionProps>(({ id, title, subtitle, children, className = '' }, ref) => {
  return (
    <section ref={ref} id={id} className={`mb-16 pt-8 -mt-8 ${className}`}>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-2">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
});

export default Section;
