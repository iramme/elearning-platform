import { motion } from 'framer-motion';

export default function PageHero({ title, subtitle, icon, children }) {
  return (
    <div className="bg-gradient-hero relative overflow-hidden py-14 px-4">
      {/* Motifs décoratifs en arrière-plan */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-16 -right-10 w-80 h-80 rounded-full bg-white blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3"
        >
          {title}
          {icon && <span className="text-4xl md:text-5xl">{icon}</span>}
        </motion.h1>
        {subtitle && <p className="text-white/90 text-lg mb-8">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}