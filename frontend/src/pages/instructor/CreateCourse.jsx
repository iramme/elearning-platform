import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookPlus, Loader2 } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { useEffect } from 'react';

export default function CreateCourse() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', level: 'BEGINNER',
    category: '', is_published: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    courseService.getCategories().then(({ data }) => {
      setCategories(data.results || data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await courseService.createCourse(formData);
      navigate(`/instructor/courses/${data.slug}/edit`);
    } catch (err) {
      const messages = err.response?.data;
      const firstError = messages ? Object.values(messages)[0] : null;
      setError(Array.isArray(firstError) ? firstError[0] : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary-100 p-3 rounded-xl">
            <BookPlus className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark">Créer un nouveau cours</h1>
            <p className="text-gray-500 text-sm">Remplis les informations de base, tu pourras ajouter les leçons ensuite</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Titre du cours</label>
            <input
              type="text" name="title" required value={formData.title} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
              placeholder="Ex: Python pour Débutants"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
            <textarea
              name="description" required rows={4} value={formData.description} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition resize-none"
              placeholder="Décris ce que les étudiants vont apprendre..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Prix (€)</label>
              <input
                type="number" name="price" min="0" step="0.01" required value={formData.price} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
                placeholder="29.99"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Niveau</label>
              <select
                name="level" value={formData.level} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition"
              >
                <option value="BEGINNER">Débutant</option>
                <option value="INTERMEDIATE">Intermédiaire</option>
                <option value="ADVANCED">Avancé</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Catégorie</label>
            <select
              name="category" required value={formData.category} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition"
            >
              <option value="">Choisis une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange}
              className="w-4 h-4 rounded accent-primary-600"
            />
            <span className="text-sm text-gray-700">Publier immédiatement (visible dans le catalogue)</span>
          </label>

          <button
            type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Créer le cours et continuer'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}