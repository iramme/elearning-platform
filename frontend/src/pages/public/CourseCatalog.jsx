import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { courseService } from '../../services/courseService';
import CourseCard from '../../components/ui/CourseCard';
import PageHero from '../../components/layout/PageHero';

export default function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  useEffect(() => {
    courseService.getCategories().then(({ data }) => {
      setCategories(data.results || data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedLevel) params.level = selectedLevel;

    const timeout = setTimeout(() => {
      courseService.getCourses(params).then(({ data }) => {
        setCourses(data.results || data);
        setLoading(false);
      });
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [search, selectedCategory, selectedLevel]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <PageHero
        title="Apprends de nouvelles compétences"
        subtitle="Des cours créés par des experts, à ton rythme"
        icon="🚀"
      >
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-0 bg-white/30 blur-xl rounded-2xl" />
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un cours (Python, Design, Marketing...)"
              className="w-full pl-12 pr-4 py-4 rounded-2xl shadow-xl outline-none text-dark"
            />
          </div>
        </div>
      </PageHero>

      {/* Filtres + résultats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mr-2">
            <SlidersHorizontal className="w-4 h-4" /> Filtrer :
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-primary-50 border-0 rounded-full px-5 py-2.5 text-sm font-medium text-primary-700 outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-gray-100 border-0 rounded-full px-5 py-2.5 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer"
          >
            <option value="">Tous les niveaux</option>
            <option value="BEGINNER">Débutant</option>
            <option value="INTERMEDIATE">Intermédiaire</option>
            <option value="ADVANCED">Avancé</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Aucun cours ne correspond à ta recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}