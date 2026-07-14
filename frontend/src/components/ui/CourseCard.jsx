import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Code, Palette, Megaphone, Camera, Briefcase, BookOpen } from 'lucide-react';

const levelLabels = { BEGINNER: 'Débutant', INTERMEDIATE: 'Intermédiaire', ADVANCED: 'Avancé' };

// Icône + gradient selon la catégorie (matche visuellement le type de contenu)
const categoryStyles = {
  'Développement Web': { icon: Code, gradient: 'from-primary-500 to-primary-700' },
  'Design': { icon: Palette, gradient: 'from-pink-500 to-secondary-500' },
  'Marketing': { icon: Megaphone, gradient: 'from-secondary-400 to-secondary-600' },
  'Photographie': { icon: Camera, gradient: 'from-indigo-500 to-primary-600' },
  'Business': { icon: Briefcase, gradient: 'from-success-500 to-primary-600' },
};

function getCategoryStyle(name) {
  return categoryStyles[name] || { icon: BookOpen, gradient: 'from-primary-500 to-secondary-500' };
}

export default function CourseCard({ course }) {
  const { icon: CategoryIcon, gradient } = getCategoryStyle(course.category_name);

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
      <Link to={`/courses/${course.slug}`} className="card block h-full flex flex-col p-0 overflow-hidden group">
        <div className={`h-40 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <>
              {/* Motif décoratif */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute -left-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
              <CategoryIcon className="w-14 h-14 text-white/90 relative z-10 group-hover:scale-110 transition-transform" />
            </>
          )}
          <span className="absolute top-3 left-3 text-xs font-bold px-3 py-1.5 rounded-full bg-white text-success-600 shadow-sm">
            {levelLabels[course.level]}
          </span>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <p className="text-xs text-primary-600 font-semibold mb-1">{course.category_name}</p>
          <h3 className="font-bold text-dark mb-2 line-clamp-2 flex-1">{course.title}</h3>
          <p className="text-sm text-gray-500 mb-3">Par {course.instructor_name}</p>

          <div className="flex items-center justify-between text-sm mb-3">
            <div className="flex items-center gap-1 text-secondary-500 font-semibold">
              <Star className="w-4 h-4 fill-secondary-400 text-secondary-400" />
              {course.average_rating || 0}
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Users className="w-4 h-4" />
              {course.total_students} étudiants
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xl font-bold text-primary-700">
              {Number(course.price) === 0 ? 'Gratuit' : `${course.price} €`}
            </span>
            <span className="text-sm font-semibold text-primary-600 group-hover:translate-x-1 transition-transform">
              Voir le cours →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}