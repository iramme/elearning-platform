import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlayCircle, CheckCircle2, Lock, ChevronLeft,
  Download, Award, Loader2, Circle
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import { progressService } from '../../services/progressService';
import { certificateService } from '../../services/certificateService';
import { extractResults } from '../../utils/extractResults';

export default function CoursePlayer() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const videoRef = useRef(null);
  const lastSentRef = useRef(0);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const { data } = await courseService.getCourseBySlug(slug);
        setCourse(data);
        // Sélectionne la 1ère leçon accessible par défaut
        const firstUnlocked = data.lessons.find((l) => l.video_url);
        setActiveLesson(firstUnlocked || data.lessons[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [slug]);

  // Sauvegarde la progression toutes les 10 secondes de lecture
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !activeLesson) return;

    const current = Math.floor(video.currentTime);
    if (current - lastSentRef.current >= 10) {
      lastSentRef.current = current;
      sendProgress(current);
    }
  }, [activeLesson]);

  const handleVideoEnded = () => {
    if (!activeLesson) return;
    sendProgress(activeLesson.duration_seconds); // force 100% à la fin
  };

  async function sendProgress(watchedSeconds) {
    try {
      const { data } = await progressService.updateLessonProgress(activeLesson.id, watchedSeconds);
      if (data.course_completed) {
        setShowCelebration(true);
        // Récupère le certificat fraîchement généré
        const certRes = await certificateService.getMyCertificates();
        const certs = extractResults(certRes.data);
        const cert = certs.find((c) => c.course_title === course.title);
        if (cert) setCertificateUrl(cert.pdf_url);
      }
      // Marque la leçon comme complétée localement pour l'UI
      if (data.lesson_completed) {
        setCourse((prev) => ({
          ...prev,
          lessons: prev.lessons.map((l) =>
            l.id === activeLesson.id ? { ...l, _completedLocally: true } : l
          ),
        }));
      }
    } catch (err) {
      console.error('Erreur de sauvegarde progression', err);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!course) {
    return <div className="text-center py-32 text-gray-500">Cours introuvable.</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center gap-4">
        <Link to="/my-courses" className="text-gray-400 hover:text-primary-600">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-bold text-dark truncate">{course.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Player */}
        <div className="lg:col-span-2 bg-black">
          {activeLesson?.video_url ? (
            <video
              ref={videoRef}
              key={activeLesson.id}
              src={activeLesson.video_url}
              controls
              autoPlay
              className="w-full aspect-video"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
            />
          ) : (
            <div className="aspect-video flex items-center justify-center text-white/50">
              <Lock className="w-10 h-10" />
            </div>
          )}

          <div className="p-6 bg-white">
            <h2 className="font-bold text-lg text-dark mb-2">{activeLesson?.title}</h2>
            <p className="text-gray-500 text-sm mb-4">{activeLesson?.description}</p>

            {activeLesson?.resources?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-dark mb-2">Ressources</h3>
                <div className="space-y-2">
                  {activeLesson.resources.map((res) => (
                    <a
                      key={res.id}
                      href={res.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-primary-600 hover:underline"
                    >
                      <Download className="w-4 h-4" /> {res.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Playlist des leçons */}
        <div className="border-l border-gray-100 bg-white">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-dark text-sm">Contenu du cours</h3>
            <p className="text-xs text-gray-400">{course.lessons.length} leçons</p>
          </div>
          <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
            {course.lessons.map((lesson, idx) => {
              const isActive = activeLesson?.id === lesson.id;
              const isLocked = !lesson.video_url;
              const isDone = lesson._completedLocally;

              return (
                <button
                  key={lesson.id}
                  disabled={isLocked}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full text-left p-4 flex items-center gap-3 transition ${
                    isActive ? 'bg-primary-50' : 'hover:bg-gray-50'
                  } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLocked ? (
                    <Lock className="w-4 h-4 text-gray-300 shrink-0" />
                  ) : isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" />
                  ) : isActive ? (
                    <PlayCircle className="w-4 h-4 text-primary-600 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                  )}
                  <span className={`text-sm ${isActive ? 'font-semibold text-primary-700' : 'text-gray-600'}`}>
                    {idx + 1}. {lesson.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de célébration + certificat */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-md text-center"
          >
            <div className="bg-success-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
              <Award className="w-9 h-9 text-success-600" />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-2">Félicitations ! 🎉</h2>
            <p className="text-gray-500 mb-6">
              Tu as terminé le cours <strong>{course.title}</strong>. Ton certificat est prêt !
            </p>
            <div className="flex gap-3">
              {certificateUrl && (
                <a href={certificateUrl} target="_blank" rel="noreferrer" className="btn-secondary flex-1">
                  Voir le certificat
                </a>
              )}
              <button onClick={() => setShowCelebration(false)} className="btn-outline flex-1">
                Continuer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}