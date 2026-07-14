import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, Star, Plus } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../hooks/useAuth';
import StatCard from '../../components/ui/StatCard';
import PageHero from '../../components/layout/PageHero';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const { data } = await courseService.getCourses();
        const results = data.results || data;
        setCourses(results.filter((c) => c.instructor_name === user.username));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [user.username]);

  const totalStudents = courses.reduce((sum, c) => sum + (c.total_students || 0), 0);
  const avgRating = courses.length
    ? (courses.reduce((sum, c) => sum + (c.average_rating || 0), 0) / courses.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHero
        title="Espace Instructeur"
        subtitle="Gère tes cours et suis tes performances"
        icon="🎯"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-6">
          <Link to="/instructor/courses/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Nouveau cours
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard icon={BookOpen} label="Cours créés" value={courses.length} color="primary" />
          <StatCard icon={Users} label="Étudiants totaux" value={totalStudents} color="secondary" />
          <StatCard icon={Star} label="Note moyenne" value={avgRating} color="success" />
        </div>

        <h2 className="text-xl font-bold text-dark mb-4">Mes cours</h2>
        {courses.length === 0 ? (
          <div className="card text-center py-10">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Tu n'as pas encore créé de cours.</p>
            <Link to="/instructor/courses/new" className="btn-primary inline-block mt-4">
              Créer mon premier cours
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <motion.div key={course.id} whileHover={{ y: -4 }} className="card">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-dark">{course.title}</h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    course.is_published ? 'bg-success-100 text-success-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {course.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{course.category_name}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-primary-600">{course.price} €</span>
                  <span className="text-gray-500">⭐ {course.average_rating || 0} · {course.total_students} étudiants</span>
                </div>
                <Link
                  to={`/instructor/courses/${course.slug}/edit`}
                  className="btn-outline w-full text-center mt-4 text-sm py-2"
                >
                  Gérer
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}