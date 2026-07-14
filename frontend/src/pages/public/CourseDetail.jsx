import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, Users, Clock, PlayCircle, Lock, CheckCircle2,
  Signal, Loader2, MessageSquare
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import { paymentService } from '../../services/paymentService';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../hooks/useAuth';

const levelLabels = { BEGINNER: 'Débutant', INTERMEDIATE: 'Intermédiaire', ADVANCED: 'Avancé' };

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  return `${m} min`;
}

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isStudent } = useAuth();

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await courseService.getCourseBySlug(slug);
        setCourse(data);
        const reviewsRes = await reviewService.getReviewsByCourse(data.id);
        setReviews(reviewsRes.data.results || reviewsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const handleBuy = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setError('');
    setBuying(true);
    try {
      const { data } = await paymentService.createCheckout(course.id);
      window.location.href = data.checkout_url;
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue lors du paiement.");
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
      </div>
    );
  }

  if (!course) {
    return <div className="text-center py-32 text-gray-500">Cours introuvable.</div>;
  }

  const hasAnyUnlockedLesson = course.lessons.some((l) => l.video_url);
  const isFullyUnlocked = course.lessons.length > 0 && course.lessons.every((l) => l.video_url);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-hero py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/80 text-sm font-semibold mb-2">{course.category?.name}</p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl"
          >
            {course.title}
          </motion.h1>
          <p className="text-white/90 max-w-2xl mb-4">{course.description}</p>

          <div className="flex flex-wrap items-center gap-5 text-white/90 text-sm">
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-secondary-300 text-secondary-300" />
              {course.average_rating || 0} ({reviews.length} avis)
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" /> {course.total_students} étudiants
            </span>
            <span className="flex items-center gap-1.5">
              <Signal className="w-4 h-4" /> {levelLabels[course.level]}
            </span>
            <span>Par <strong>{course.instructor_name}</strong></span>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-8">
          {/* Programme */}
          <div>
            <h2 className="text-xl font-bold text-dark mb-4">Programme du cours</h2>
            <div className="card p-0 divide-y divide-gray-100">
              {course.lessons.map((lesson, idx) => (
                <div key={lesson.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {lesson.video_url ? (
                      <PlayCircle className="w-5 h-5 text-primary-600 shrink-0" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-300 shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-sm text-dark">
                        {idx + 1}. {lesson.title}
                      </p>
                      {lesson.is_free_preview && (
                        <span className="text-xs text-success-600 font-semibold">Aperçu gratuit</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3.5 h-3.5" /> {formatDuration(lesson.duration_seconds)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Avis */}
          <div>
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Avis des étudiants
            </h2>
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">Aucun avis pour l'instant.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-dark">{review.student_name}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'fill-secondary-400 text-secondary-400' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar achat */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card sticky top-24"
          >
            <div className="h-40 bg-gradient-card rounded-xl mb-5 flex items-center justify-center overflow-hidden">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-4xl font-bold opacity-50">{course.title.charAt(0)}</span>
              )}
            </div>

            <p className="text-3xl font-bold text-primary-700 mb-4">
              {Number(course.price) === 0 ? 'Gratuit' : `${course.price} €`}
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-xl mb-3">
                {error}
              </div>
            )}

            {isFullyUnlocked ? (
              <button
                onClick={() => navigate(`/learn/${course.slug}`)}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" /> Accéder au cours
              </button>
            ) : (
              <button
                onClick={handleBuy}
                disabled={buying || (isAuthenticated && !isStudent)}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {buying ? <Loader2 className="w-5 h-5 animate-spin" /> : "S'inscrire au cours"}
              </button>
            )}

            {isAuthenticated && !isStudent && !isFullyUnlocked && (
              <p className="text-xs text-gray-400 text-center mt-2">
                Seuls les étudiants peuvent acheter un cours.
              </p>
            )}

            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success-500" /> Accès à vie
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success-500" /> Certificat de réussite
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success-500" /> {course.lessons.length} leçons vidéo
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}