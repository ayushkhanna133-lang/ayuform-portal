import React from 'react';
import { categories } from '../data';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

export function Categories() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto relative z-10 -mt-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {categories.map((category, index) => {
          const Icon = Icons[category.icon as keyof typeof Icons] as React.ElementType;
          return (
            <motion.a
              href="#"
              onClick={(e) => { e.preventDefault(); alert(`Filtering by ${category.name} coming soon!`); }}
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group flex flex-col items-center p-6 bg-white/70 backdrop-blur-md border border-white/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.1)] hover:bg-white/90 transition-all text-center"
            >
              <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                <Icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-blue-950 mb-1">{category.name}</h3>
              <span className="text-xs font-medium text-blue-600/70 bg-blue-50 px-2 py-0.5 rounded-full">
                {category.count} Updates
              </span>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
