import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Upload, Video, FileText, Loader2, Image as ImageIcon, Trash2, CheckCircle2 } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { uploadToCloudinary } from '../../services/cloudinaryService';

export default function ManageCourse() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [lessonData, setLessonData] = useState({ title: '', description: '', is_free_preview: false });
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingVideoId, setUploadingVideoId] = useState(null);
  const [savingLesson, setSavingLesson] = useState(false);

  const fetchCourse = async () => {
    const { data } = await courseService.getCourseBySlug(slug);
    setCourse(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingThumbnail(true);
    try {
      await courseService.uploadThumbnail(course.id, file);
      await fetchCourse();
    } catch (err) {
      console.error('DETAIL ERREUR THUMBNAIL:', err.response?.data);
      alert("Erreur lors de l'upload de l'image.");
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setSavingLesson(true);
    try {
      await courseService.addLesson(course.id, {
        ...lessonData,
        video_url: 'https://placeholder.com/pending.mp4',
        order: course.lessons.length + 1,
      });
      setLessonData({ title: '', description: '', is_free_preview: false });
      setShowLessonForm(false);
      await fetchCourse();
    } catch (err) {
      console.error('DETAIL ERREUR LESSON:', JSON.stringify(err.response?.data));
      alert("Erreur lors de la création de la leçon.");
    } finally {
      setSavingLesson(false);
    }
  };

  const handleVideoUpload = async (lessonId, file) => {
    setUploadingVideoId(lessonId);
    try {
      // 1. Upload direct vers Cloudinary (léger, ne passe pas par notre backend)
      const videoData = await uploadToCloudinary(file, 'video');

      // 2. On informe juste notre backend de l'URL obtenue (requête légère, pas de fichier)
      await courseService.attachVideoToLesson(lessonId, videoData);

      await fetchCourse();
    } catch (err) {
      console.error('DETAIL ERREUR VIDEO:', err);
      alert("Erreur lors de l'upload de la vidéo.");
    } finally {
      setUploadingVideoId(null);
    }
  };

  const togglePublish = async () => {
    try {
      await courseService.updateCourse(course.slug, { is_published: !course.is_published });
      await fetchCourse();
    } catch (err) {
      console.error('DETAIL ERREUR PUBLISH:', err.response?.data);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark mb-1">{course.title}</h1>
          <p className="text-gray-500 text-sm">{course.lessons.length} leçon(s) · {course.price} €</p>
        </div>
        <button
          onClick={togglePublish}
          className={course.is_published ? 'btn-outline' : 'btn-secondary'}
        >
          {course.is_published ? 'Dépublier' : 'Publier le cours'}
        </button>
      </div>

      {/* Thumbnail */}
      <div className="card mb-6">
        <h2 className="font-semibold text-dark mb-3 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" /> Image de couverture
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-32 h-20 bg-gradient-card rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
            {course.thumbnail ? (
              <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-6 h-6 text-white/50" />
            )}
          </div>
          <label className="btn-outline text-sm py-2 cursor-pointer flex items-center gap-2">
            {uploadingThumbnail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploadingThumbnail ? 'Upload en cours...' : "Changer l'image"}
            <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" disabled={uploadingThumbnail} />
          </label>
        </div>
      </div>

      {/* Leçons */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-dark">Leçons du cours</h2>
          <button onClick={() => setShowLessonForm(!showLessonForm)} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Ajouter une leçon
          </button>
        </div>

        {showLessonForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleAddLesson}
            className="bg-primary-50 rounded-xl p-4 mb-4 space-y-3"
          >
            <input
              type="text" required placeholder="Titre de la leçon"
              value={lessonData.title}
              onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-primary-500 text-sm"
            />
            <textarea
              placeholder="Description (optionnel)" rows={2}
              value={lessonData.description}
              onChange={(e) => setLessonData({ ...lessonData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-primary-500 text-sm resize-none"
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={lessonData.is_free_preview}
                onChange={(e) => setLessonData({ ...lessonData, is_free_preview: e.target.checked })}
                className="w-4 h-4 accent-primary-600"
              />
              Aperçu gratuit
            </label>
            <button type="submit" disabled={savingLesson} className="btn-primary text-sm py-2 px-4">
              {savingLesson ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enregistrer la leçon'}
            </button>
          </motion.form>
        )}

        <div className="space-y-3">
          {course.lessons.map((lesson, idx) => (
            <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-400">{idx + 1}.</span>
                <div>
                  <p className="text-sm font-medium text-dark">{lesson.title}</p>
                  {lesson.video_url && !lesson.video_url.includes('placeholder') ? (
                    <span className="text-xs text-success-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Vidéo uploadée
                    </span>
                  ) : (
                    <span className="text-xs text-secondary-500">Vidéo manquante</span>
                  )}
                </div>
              </div>
              <label className="btn-outline text-xs py-1.5 px-3 cursor-pointer flex items-center gap-1.5">
                {uploadingVideoId === lesson.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Video className="w-3.5 h-3.5" />
                )}
                {uploadingVideoId === lesson.id ? 'Upload...' : 'Uploader vidéo'}
                <input
                  type="file" accept="video/*" className="hidden"
                  disabled={uploadingVideoId === lesson.id}
                  onChange={(e) => e.target.files[0] && handleVideoUpload(lesson.id, e.target.files[0])}
                />
              </label>
            </div>
          ))}
          {course.lessons.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Aucune leçon pour l'instant.</p>
          )}
        </div>
      </div>
    </div>
  );
}